const pool = require("../lib/postgres");

/**
 * Return all students linked to a parent.
 * Ownership is enforced by the WHERE psm.parent_id = $1 clause —
 * a parent can never retrieve students outside their own map.
 *
 * @param {number} parentId  - parents.id (BIGINT, from JWT)
 * @returns {Promise<Array>}
 */
exports.getChildren = async (parentId) => {
  const { rows } = await pool.query(
    `SELECT
       u.id,
       u.username  AS name,
       u.email,
       psm.created_at AS linked_at
     FROM parent_student_map psm
     INNER JOIN users u ON u.id = psm.student_id
     WHERE psm.parent_id = $1
     ORDER BY u.username ASC`,
    [parentId]
  );
  return rows;
};

/**
 * Return a single child's profile + dyslexia session analytics,
 * only if the parent owns the mapping.
 *
 * Returns null when no ownership record is found (caller should 404).
 *
 * @param {number} parentId  - parents.id (BIGINT, from JWT)
 * @param {string} studentId - users.id  (UUID)
 * @returns {Promise<object|null>}
 */
exports.getChildById = async (parentId, studentId) => {
  // 1. Verify ownership
  const ownershipCheck = await pool.query(
    `SELECT u.id, u.username AS name, u.email, psm.created_at AS linked_at
     FROM parent_student_map psm
     INNER JOIN users u ON u.id = psm.student_id
     WHERE psm.parent_id = $1
       AND psm.student_id = $2::uuid
     LIMIT 1`,
    [parentId, studentId]
  );

  if (!ownershipCheck.rows.length) return null;

  const child = ownershipCheck.rows[0];

  // 2. Recent game results
  const resultsQuery = await pool.query(
    `SELECT
       id::text   AS id,
       game_name,
       game_type,
       difficulty,
       score,
       completed_at AS created_at
     FROM game_results
     WHERE user_id = $1::uuid
     ORDER BY completed_at DESC
     LIMIT 50`,
    [studentId]
  );

  // 3. Latest dyslexia session
  const sessionQuery = await pool.query(
    `SELECT
       session_id,
       game_type,
       difficulty,
       score,
       total,
       accuracy,
       fixation_mean_dur,
       regressions_count,
       reading_speed_wpm,
       risk,
       risk_score,
       ml_prediction,
       "timestamp"
     FROM dyslexia_sessions
     WHERE user_id = $1::uuid
     ORDER BY "timestamp" DESC
     LIMIT 1`,
    [studentId]
  );

  const results = resultsQuery.rows;
  const latestSession = sessionQuery.rows[0] || null;

  // 4. Compute analytics
  const totalGamesPlayed = results.length;
  const averageScore = totalGamesPlayed
    ? Number(
        (
          results.reduce((sum, r) => sum + Number(r.score || 0), 0) /
          totalGamesPlayed
        ).toFixed(2)
      )
    : 0;
  const lastActivity = results[0]?.created_at || null;

  return {
    child,
    analytics: {
      total_games_played: totalGamesPlayed,
      average_score: averageScore,
      last_activity: lastActivity,
    },
    latest_session: latestSession,
    results,
  };
};

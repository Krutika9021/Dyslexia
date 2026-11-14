const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export async function saveGameScore(data: any) {
  const res = await fetch(`${API_URL}/api/scores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getRecentScores(limit = 30) {
  const res = await fetch(`${API_URL}/api/scores/recent?limit=${limit}`);
  return res.json();
}

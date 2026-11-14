const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
    : {
        host: process.env.POSTGRES_HOST || "localhost",
        port: Number(process.env.POSTGRES_PORT || 5432),
        user: process.env.POSTGRES_USER || "postgres",
        password: process.env.POSTGRES_PASSWORD || "",
        database: process.env.POSTGRES_DB || "dyslexiadb",
        max: 10,
      }
);

pool.on("connect", () => console.log("[postgres] pool connected"));
pool.on("error", (err) => console.error("[postgres] pool error:", err.message));

// Verify connection on startup
pool.query("SELECT 1").then(() => {
  console.log("[postgres] database reachable");
}).catch((err) => {
  console.error("[postgres] database unreachable:", err.message);
});

module.exports = pool;

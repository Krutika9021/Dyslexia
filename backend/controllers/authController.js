const pool = require("../lib/postgres");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  console.log("[register] body:", req.body);
  const { name, username, firstName, lastName, email, password, role } = req.body;
  const resolvedUsername =
    username ||
    name ||
    (firstName && lastName ? `${firstName} ${lastName}` : undefined);

  if (!resolvedUsername || !email || !password) {
    return res.status(400).json({ message: "Username, email, and password are required" });
  }

  // Map frontend role to is_admin flag
  const isAdmin = role === "admin";

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1 LIMIT 1", [email]);
    if (existing.rows.length) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (username, email, password, is_admin)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, is_admin, created_at`,
      [resolvedUsername, email, hashedPassword, isAdmin]
    );

    const newUser = result.rows[0];
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.is_admin ? "admin" : (role || "student"),
      },
    });
  } catch (error) {
    console.error("[register] error:", error.message);
    res.status(500).json({ message: "Server error", detail: error.message });
  }
};

exports.login = async (req, res) => {
  console.log("[login] body:", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1 LIMIT 1", [email]);
    if (!result.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const role = user.is_admin ? "admin" : "student";

    const token = jwt.sign(
      { id: user.id, email: user.email, role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    console.error("[login] error:", error.message);
    return res.status(500).json({ message: "Server error", detail: error.message });
  }
};


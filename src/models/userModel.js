const { pool } = require('../config/db');

// Example user model for authentication.
// Table structure (MySQL) should roughly be:
// users(id BIGINT PK, email VARCHAR(255) UNIQUE, password_hash VARCHAR(255), created_at DATETIME, updated_at DATETIME, is_active TINYINT)

const findUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT id, email, password_hash AS passwordHash, is_active AS isActive FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
};

module.exports = {
  findUserByEmail
};


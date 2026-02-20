const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('./env');

let sslConfig = undefined;

if (config.ssl.enabled) {
  sslConfig = {
    rejectUnauthorized: true
  };

  if (config.ssl.caPath) {
    const caFullPath = path.resolve(process.cwd(), config.ssl.caPath);
    if (fs.existsSync(caFullPath)) {
      sslConfig.ca = fs.readFileSync(caFullPath, 'utf8');
    }
  }
}

const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: sslConfig
});

pool.on('connection', () => {
  // Optional: add connection-level configuration if needed
});

const getConnection = async () => pool.getConnection();

module.exports = {
  pool,
  getConnection
};


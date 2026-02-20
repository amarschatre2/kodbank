const http = require('http');
const app = require('./app');
const config = require('./config/env');
const { pool } = require('./config/db');

const PORT = config.port;

const server = http.createServer(app);

const start = async () => {
  try {
    // Test database connection on startup
    await pool.query('SELECT 1');
    console.log('MySQL pool connected successfully');

    server.listen(PORT, () => {
      console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server due to database error:', err.message);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    pool.end().then(() => {
      console.log('MySQL pool closed');
      process.exit(0);
    });
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start();


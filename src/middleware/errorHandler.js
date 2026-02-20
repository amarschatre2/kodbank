const config = require('../config/env');

// Centralized error handler for the API
// In production, avoid leaking internal details.
// Use next(err) with proper statusCode/message from controllers.

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isProd = config.nodeEnv === 'production';

  const response = {
    message: err.message || 'Internal server error'
  };

  if (!isProd) {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};

module.exports = errorHandler;


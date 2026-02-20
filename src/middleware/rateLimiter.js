const rateLimit = require('express-rate-limit');

// Global rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    message: 'Too many requests from this IP, please try again later.'
  }
});

// More aggressive limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    message: 'Too many login attempts, please try again later.'
  }
});

module.exports = {
  apiLimiter,
  authLimiter
};


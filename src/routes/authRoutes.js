const express = require('express');
const { login, me } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Public login route with stricter rate limiting
router.post('/login', authLimiter, login);

// Protected route: fetch current user profile
router.get('/me', authMiddleware, me);

module.exports = router;


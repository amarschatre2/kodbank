const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/env');
const routes = require('./routes');
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Trust reverse proxy in production (e.g. when behind Nginx/load balancer)
if (config.nodeEnv === 'production') {
  app.set('trust proxy', 1);
}

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false // Adjust/enable CSP based on your frontend setup
  })
);

// Logging
if (config.nodeEnv !== 'test') {
  app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
}

// CORS - restrict to known frontend origin in production
const corsOptions = {
  origin: (origin, callback) => {
    if (!config.cors.appBaseUrl) {
      // If not configured, allow all (recommended only in development)
      return callback(null, true);
    }
    if (!origin || origin === config.cors.appBaseUrl) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10kb' })); // limit JSON payload size

// Global rate limiter
app.use('/api', apiLimiter);

// API routes
app.use('/api/v1', routes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;


const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env in project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const requiredEnv = (key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return process.env[key];
};

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4000,
  db: {
    host: requiredEnv('MYSQL_HOST'),
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: requiredEnv('MYSQL_USER'),
    password: requiredEnv('MYSQL_PASSWORD'),
    database: requiredEnv('MYSQL_DATABASE')
  },
  ssl: {
    // Aiven requires SSL. This basic config enables TLS.
    // For stronger validation, use Aiven's CA cert via MYSQL_SSL_CA_PATH.
    enabled: true,
    caPath: process.env.MYSQL_SSL_CA_PATH || null
  },
  jwt: {
    secret: requiredEnv('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN || '15m'
  },
  cors: {
    appBaseUrl: process.env.APP_BASE_URL || ''
  }
};


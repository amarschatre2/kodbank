const { findUserByEmail } = require('../models/userModel');
const { verifyPassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await findUserByEmail(email);

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Use sub for user id in JWT
    const accessToken = signToken({
      sub: user.id,
      email: user.email
    });

    return res.status(200).json({
      accessToken,
      tokenType: 'Bearer'
    });
  } catch (err) {
    return next(err);
  }
};

const me = async (req, res) => {
  // This assumes authMiddleware has already set req.user
  return res.status(200).json({
    id: req.user.id,
    email: req.user.email
  });
};

module.exports = {
  login,
  me
};


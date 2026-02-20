const bcrypt = require('bcryptjs');

const HASH_ROUNDS = 12;

const hashPassword = async (plain) => {
  return bcrypt.hash(plain, HASH_ROUNDS);
};

const verifyPassword = async (plain, hash) => {
  return bcrypt.compare(plain, hash);
};

module.exports = {
  hashPassword,
  verifyPassword
};


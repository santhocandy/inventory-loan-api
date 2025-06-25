const jwt = require('jsonwebtoken');
require('dotenv').config();
const logger = require('../utils/logger');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Authorization token missing or invalid');
    return res.status(401).json({ error: 'Authorization token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    logger.info('Authenticated user:', decoded);
    next();
  } catch (err) {
    logger.error('Invalid or expired token:', err);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

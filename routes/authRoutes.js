const logger = require('../utils/logger');
const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

logger.info('Auth route initialized: POST /login');
router.post('/login', login);

module.exports = router;
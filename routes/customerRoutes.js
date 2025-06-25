const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
logger.info('Customer routes initialized');
const auth = require('../middleware/auth');
const {
  createOrGetCustomer,
  getCustomer,
  updateCustomer
} = require('../controllers/customerController');

router.post('/', auth, createOrGetCustomer);

router.put('/:id', auth, updateCustomer);

router.get('/:id', auth, getCustomer);

module.exports = router;
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const loanController = require('../controllers/loanController');
const logger = require('../utils/logger');
logger.info('Loan routes loaded');

router.post('/', auth, loanController.createLoan);

router.get('/', auth, loanController.getAllLoans);

router.get('/:id', auth, loanController.getLoanById);

router.put('/:id', auth, loanController.updateLoan);

router.delete('/:id', auth, loanController.deleteLoan);

module.exports = router;
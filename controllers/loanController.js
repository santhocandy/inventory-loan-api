const logger = require('../utils/logger');
const loanService = require('../services/loanService');

exports.createLoan = async (req, res) => {
  try {
    const { item_id, interest_rate, duration } = req.body;
    if (!item_id) return res.status(400).json({ error: 'item_id is required' });

    const loan = await loanService.createLoan(item_id, interest_rate, duration);
    res.status(201).json(loan);
  } catch (err) {
    logger.error('Error creating loan:', err);
    res.status(400).json({ error: err.toString() });
  }
};


exports.updateLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;

    const result = await loanService.updateLoan(id, fields);
    if (!result.updated) return res.status(404).json({ error: 'Loan not found or not updated' });

    res.json({ message: result.message || 'Loan updated successfully' });
  } catch (err) {
    logger.error('Error updating loan:', err);
    res.status(400).json({ error: err.toString() });
  }
};

exports.getAllLoans = async (req, res) => {
  try {
    const loans = await loanService.getAllLoans();
    res.json(loans);
  } catch (err) {
    logger.error('Error fetching loans:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getLoanById = async (req, res) => {
  try {
    const loan = await loanService.getLoanById(req.params.id);
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    res.json(loan);
  } catch (err) {
    logger.error('Error fetching loan by ID:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.deleteLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await loanService.deleteLoan(id);
    if (!result.updated) return res.status(404).json({ error: 'Loan not found or already cancelled' });

    res.json({ message: 'Loan marked as cancelled' });
  } catch (err) {
    logger.error('Error cancelling loan:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
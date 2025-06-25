const customerService = require('../services/customerService');
const logger = require('../utils/logger');

exports.createOrGetCustomer = async (req, res) => {
  try {
    const { name, phone, id_proof } = req.body;
    if (!name || !phone) {
      logger.warn('[CustomerController] Missing name or phone in create request. name:', name, 'phone:', phone);
      return res.status(400).json({ error: 'Name and phone are required' });
    }
    const customer = await customerService.findOrCreateCustomer(name, phone, id_proof);
    logger.info(`[CustomerController] Customer created or fetched: ${customer.id}`);
    res.status(200).json(customer);
  } catch (err) {
    logger.error('[CustomerController] Error creating or fetching customer:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await customerService.getCustomerById(id);
    if (!customer) {
      logger.warn(`[CustomerController] Customer not found with ID: ${id}`);
      return res.status(404).json({ error: 'Customer not found' });
    }
    logger.info(`[CustomerController] Fetched customer: ${id}`);
    res.json(customer);
  } catch (err) {
    logger.error('[CustomerController] Error fetching customer:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, id_proof } = req.body;
    if (!name && !phone && !id_proof) {
      logger.warn('[CustomerController] No fields provided for update');
      return res.status(400).json({ error: 'At least one field is required for update' });
    }

    const updated = await customerService.updateCustomer(id, { name, phone, id_proof });
    if (!updated) {
      logger.warn(`[CustomerController] No customer updated, possibly not found: ${id}`);
      return res.status(404).json({ error: 'Customer not found or not updated' });
    }

    logger.info(`[CustomerController] Customer updated: ${id} with fields: ${JSON.stringify({ name, phone, id_proof })}`);
    res.json({ message: 'Customer updated successfully' });
  } catch (err) {
    logger.error('[CustomerController] Error updating customer:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
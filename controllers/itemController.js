const logger = require('../utils/logger');
const itemService = require('../services/itemService');

exports.getItems = async (req, res) => {
  try {
    const items = await itemService.getAll();
    res.json(items);
  } catch (err) {
    logger.error('[ItemController] Error fetching items:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await itemService.getById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    logger.error('[ItemController] Error fetching item by ID:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.addItem = async (req, res) => {
  try {
    const { name, value, customer_id } = req.body;
    if (!name || !value || !customer_id) {
      return res.status(400).json({ error: 'Name, value, and customer_id are required' });
    }
    const item = await itemService.createItem(name, value, customer_id);
    res.status(201).json(item);
  } catch (err) {
    logger.error('[ItemController] Error adding item:', err);
    res.status(400).json({ error: err.toString() });  }
};

exports.updateItem = async (req, res) => {
  try {
    const { name, value } = req.body;
    const { id } = req.params;
    if (!name || !value) {
      return res.status(400).json({ error: 'Name and value are required' });
    }
    const result = await itemService.updateItem(id, name, value);
    if (!result.updated) return res.status(404).json({ error: 'Item not found or cannot be updated' });
    res.json({ message: 'Item updated successfully' });
  } catch (err) {
    logger.error('[ItemController] Error updating item:', err);
    res.status(400).json({ error: err.toString() });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await itemService.deleteItem(id);
    if (!result.deleted) {
      return res.status(404).json({ error: 'Item not found or could not be archived' });
    }
    res.json({ message: 'Item archived successfully' });
  } catch (err) {
    logger.error('[ItemController] Error deleting item:', err);
    res.status(400).json({ error: err.toString() });
  }
};
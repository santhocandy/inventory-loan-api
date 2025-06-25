const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const itemController = require('../controllers/itemController');
const logger = require('../utils/logger');
logger.info('🔧 Item routes initialized');

router.get('/', itemController.getItems);
router.get('/:id', itemController.getItemById);
router.post('/', auth, itemController.addItem);
router.put('/:id', auth, itemController.updateItem);
router.delete('/:id', auth, itemController.deleteItem);

module.exports = router;
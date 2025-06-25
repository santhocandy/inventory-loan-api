const logger = require('../utils/logger');
const db = require('../models/db');
const { v4: uuidv4 } = require('uuid');

exports.getAll = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM items', [], (err, rows) => {
      if (err) {
        logger.error('Error fetching all items:', err);
        return reject(err);
      }
      resolve(rows);
    });
  });
};

exports.getById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM items WHERE id = ?', [id], (err, row) => {
      if (err) {
        logger.error('Error fetching item by ID:', err);
        return reject(err);
      }
      resolve(row);
    });
  });
};


exports.createItem = (name, value, customer_id) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM items WHERE name = ? AND value = ? AND customer_id = ? AND status = "active"',
      [name, value, customer_id],
      (err, existingItem) => {
        if (err) {
          logger.error('DB error during duplicate item check:', err);
          return reject('DB error during duplicate check.');
        }
        if (existingItem) {
          logger.warn('Duplicate item detected for customer:', customer_id);
          return reject('This item is already in pawn for this customer.');
        }

        const id = uuidv4();
        db.run(
          'INSERT INTO items (id, name, value, customer_id) VALUES (?, ?, ?, ?)',
          [id, name, value, customer_id],
          function (err) {
            if (err) {
              logger.error('Error inserting new item:', err);
              return reject(err);
            }
            logger.info('Item created successfully:', id);
            resolve({ id, name, value, customer_id });
          }
        );
      }
    );
  });
};

exports.updateItem = (id, name, value) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT status FROM items WHERE id = ?', [id], (err, row) => {
      if (err) {
        logger.error('Error checking item status before update:', err);
        return reject('DB error');
      }
      if (!row) return reject('Item not found');

      const allowedStatuses = ['active', 'repaid', 'closed'];
      if (!allowedStatuses.includes(row.status)) {
        return reject(`Cannot update item while in status: ${row.status}`);
      }

      db.run(
        'UPDATE items SET name = ?, value = ? WHERE id = ?',
        [name, value, id],
        function (err) {
          if (err) {
            logger.error('Error updating item:', err);
            return reject(err);
          }
          logger.info('Item updated:', id);
          resolve({ updated: this.changes > 0 });
        }
      );
    });
  });
};


exports.deleteItem = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT status FROM items WHERE id = ?', [id], (err, row) => {
      if (err) {
        logger.error('Error fetching item before deletion:', err);
        return reject('DB error');
      }
      if (!row) return resolve({ deleted: false });
      if (row.status === 'loaned') {
        return reject('Cannot archive item: It is currently loaned.');
      }

      db.run('UPDATE items SET status = ? WHERE id = ?', ['archived', id], function (err) {
        if (err) {
          logger.error('Error archiving item:', err);
          return reject(err);
        }
        logger.info('Item archived:', id);
        resolve({ deleted: this.changes > 0 });
      });
    });
  });
};
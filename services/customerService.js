const db = require('../models/db');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

exports.findOrCreateCustomer = (name, phone, id_proof) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM customers WHERE phone = ?', [phone], (err, row) => {
      if (err) {
        logger.error('DB error finding customer by phone:', err);
        return reject(err);
      }

      if (row) {
        logger.info('Customer found:', row.id);
        logger.info('Response:', row);
        resolve(row);
      } else {
        const id = uuidv4();
        db.run(
          'INSERT INTO customers (id, name, phone, id_proof) VALUES (?, ?, ?, ?)',
          [id, name, phone, id_proof || null],
          function (err) {
            if (err) {
              logger.error('DB error inserting customer:', err);
              return reject(err);
            }
            const newCustomer = { id, name, phone, id_proof };
            logger.info('New customer created:', id);
            logger.info('Response:', newCustomer);
            resolve(newCustomer);
          }
        );
      }
    });
  });
};

exports.getCustomerById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM customers WHERE id = ?', [id], (err, row) => {
      if (err) {
        logger.error('DB error fetching customer by ID:', err);
        return reject(err);
      }
      if (row) {
        logger.info('Customer retrieved by ID:', id);
        logger.info('Response:', row);
      } else {
        logger.warn('Customer not found with ID:', id);
      }
      resolve(row);
    });
  });
};

exports.updateCustomer = (id, fields) => {
  return new Promise((resolve, reject) => {
    const keys = Object.keys(fields).filter(key => fields[key] !== undefined);
    if (keys.length === 0) {
      logger.warn('No valid fields provided for update');
      return resolve(false);
    }

    const updates = keys.map(key => `${key} = ?`).join(', ');
    const values = keys.map(key => fields[key]);
    values.push(id);

    const query = `UPDATE customers SET ${updates} WHERE id = ?`;
    db.run(query, values, function (err) {
      if (err) {
        logger.error('DB error updating customer:', err);
        return reject(err);
      }
      if (this.changes > 0) {
        logger.info('Customer updated successfully:', id);
        logger.info('Updated fields:', fields);
      } else {
        logger.warn('No customer updated, possibly invalid ID:', id);
      }
      resolve(this.changes > 0);
    });
  });
};
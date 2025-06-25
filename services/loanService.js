const db = require('../models/db');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

exports.createLoan = (item_id, interest_rate = 2.0, duration = 30) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM items WHERE id = ?', [item_id], (err, item) => {
      if (err || !item) {
        logger.error('Item not found or DB error:', err);
        return reject('Item not found');
      }
      if (item.status === 'loaned') {
        logger.warn(`Attempt to loan already loaned item: ${item_id}`);
        return reject('Item already loaned');
      }

      const loan_amount = Math.floor(item.value * 0.7);
      const id = uuidv4();
      const due_date = new Date();
      due_date.setDate(due_date.getDate() + duration);

      const interest = Math.floor(loan_amount * (interest_rate / 100) * (duration / 30));
      const total_amount = loan_amount + interest;

      db.run(
        `INSERT INTO loans 
         (id, item_id, loan_amount, interest, interest_rate, duration_days, due_date, status, total_amount)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, item_id, loan_amount, interest, interest_rate, duration, due_date.toISOString(), 'active', total_amount],
        function (err) {
          if (err) return reject(err);

          logger.info(`Loan created successfully for item ${item_id}`);

          db.run('UPDATE items SET status = ? WHERE id = ?', ['loaned', item_id], function (updateErr) {
            if (updateErr) return reject(updateErr);
            resolve({
              id,
              item_id,
              loan_amount,
              interest,
              total_amount,
              interest_rate,
              duration_days: duration,
              due_date: due_date.toISOString(),
              status: 'active'
            });
          });
        }
      );
    });
  });
};

exports.updateLoan = (id, fields) => {
  return new Promise((resolve, reject) => {
    const allowed = ['status', 'due_date'];
    const updates = Object.keys(fields).filter(key => allowed.includes(key) && fields[key] !== undefined);
    if (updates.length === 0) return resolve({ updated: false });

    db.get('SELECT * FROM loans WHERE id = ?', [id], (err, loan) => {
      if (err || !loan) {
        logger.error('Loan not found or DB error:', err);
        return reject('Loan not found');
      }

      if (fields.due_date) {
        const oldDue = new Date(loan.due_date);
        const newDue = new Date(fields.due_date);

        if (newDue < oldDue) {
          logger.warn(`Attempted to reduce due date from ${oldDue} to ${newDue} for loan ${id}`);
          return reject('New due date cannot be earlier than existing due date.');
        }

        const issueDate = new Date(loan.issue_date);
        const newDuration = Math.ceil((newDue - issueDate) / (1000 * 60 * 60 * 24));
        const newInterest = Math.floor(loan.loan_amount * (loan.interest_rate / 100) * (newDuration / 30));
        const newTotal = loan.loan_amount + newInterest;

        fields.duration_days = newDuration;
        fields.interest = newInterest;
        fields.total_amount = newTotal;
      }

      proceedUpdate(fields);
    });

    function proceedUpdate(fieldsToUpdate) {
      const keys = Object.keys(fieldsToUpdate);
      const query = `UPDATE loans SET ${keys.map(k => `${k} = ?`).join(', ')} WHERE id = ?`;
      const values = [...keys.map(k => fieldsToUpdate[k]), id];

      db.run(query, values, function (err) {
        if (err) return reject(err);

        logger.info(`Loan ${id} updated successfully`);

        if (fieldsToUpdate.status === 'repaid') {
          db.get('SELECT item_id FROM loans WHERE id = ?', [id], (err, row) => {
            if (err || !row) return reject('Loan or item not found');
            db.run('UPDATE items SET status = ? WHERE id = ?', ['active', row.item_id], function (itemErr) {
              if (itemErr) return reject(itemErr);
              resolve({ updated: true, message: 'Loan repaid and item re-activated' });
            });
          });
        } else {
          resolve({ updated: this.changes > 0, message: 'Loan updated successfully' });
        }
      });
    }
  });
};

exports.getAllLoans = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM loans', [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

exports.getLoanById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM loans WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

exports.deleteLoan = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT item_id FROM loans WHERE id = ?', [id], (err, row) => {
      if (err || !row) {
        logger.error('Loan not found during delete:', err);
        return reject('Loan not found');
      }
      const itemId = row.item_id;

      db.run('UPDATE loans SET status = ? WHERE id = ?', ['cancelled', id], function (err) {
        if (err) return reject(err);

        db.run('UPDATE items SET status = ? WHERE id = ?', ['active', itemId], function (itemErr) {
          if (itemErr) return reject(itemErr);

          logger.info(`Loan ${id} cancelled and item ${itemId} reactivated`);

          resolve({ updated: true, message: 'Loan cancelled and item reactivated' });
        });
      });
    });
  });
};
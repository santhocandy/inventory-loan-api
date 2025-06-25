const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database('./data/database.db');
const db = new sqlite3.Database(':memory:');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');



const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );
`;

const createCustomersTable = `
  CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    id_proof TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`;

const createItemsTable = `
  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    value INTEGER NOT NULL,
    status TEXT DEFAULT 'active',
    customer_id TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );
`;

const createLoansTable = `
  CREATE TABLE IF NOT EXISTS loans (
    id TEXT PRIMARY KEY,
    item_id TEXT NOT NULL,
    loan_amount INTEGER NOT NULL,
    interest INTEGER NOT NULL,
    interest_rate REAL DEFAULT 0.02,
    duration_days INTEGER DEFAULT 30,
    issue_date TEXT DEFAULT CURRENT_TIMESTAMP,
    due_date TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    FOREIGN KEY (item_id) REFERENCES items(id)
  );
`;

db.serialize(() => {
  db.run(createUsersTable, (err) => {
    if (err) logger.error('Error creating users table:', err);
    else logger.info('Users table created or already exists');
  });

  db.run(createCustomersTable, (err) => {
    if (err) logger.error('Error creating customers table:', err);
    else logger.info('Customers table created or already exists');
  });

  db.run(createItemsTable, (err) => {
    if (err) logger.error('Error creating items table:', err);
    else logger.info('Items table created or already exists');
  });

  db.run(createLoansTable, (err) => {
    if (err) logger.error('Error creating loans table:', err);
    else logger.info('Loans table created or already exists');
  });
});


const id = uuidv4();
const username = 'admin';
const password = '1234';

bcrypt.hash(password, 10, (err, hash) => {
  if (!err) {
    db.run(
      'INSERT INTO users (id, username, password) VALUES (?, ?, ?)',
      [id, username, hash],
      function (err) {
        if (err) {
          console.error('User seed failed:', err);
        } else {
          console.log(`[INFO] Admin user created with username: ${username}`);
        }
      }
    );
  }
});

module.exports = db;


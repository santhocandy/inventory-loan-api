// const db = require('../models/db');
// const bcrypt = require('bcrypt');
// const { v4: uuidv4 } = require('uuid');
// const logger = require('../utils/logger');

// const username = 'admin';
// const password = '1234';

// bcrypt.hash(password, 10, (err, hash) => {
//   if (err) {
//     logger.error('Hashing error:', err);
//     return;
//   }

//   const id = uuidv4();
//   db.run(
//     'INSERT INTO users (id, username, password) VALUES (?, ?, ?)',
//     [id, username, hash],
//     (err) => {
//       if (err) {
//         logger.error('Seeding failed:', err.message);
//       } else {
//         logger.info('✅ Admin user seeded');
//       }
//     }
//   );
// });

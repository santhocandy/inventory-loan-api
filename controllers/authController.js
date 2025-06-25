const db = require('../models/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) {
      console.error('Login DB error:', err);
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error('Bcrypt compare error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (result) {
        if (!process.env.JWT_SECRET) {
          return res.status(500).json({ error: 'JWT secret is not configured' });
        }
        const token = jwt.sign(
          { id: user.id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
        res.json({ token });
      } else {
        res.status(401).json({ error: 'Invalid username or password' });
      }
    });
  });
};
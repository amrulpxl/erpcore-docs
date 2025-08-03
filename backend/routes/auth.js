const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { db } = require('../config/database');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/login', [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    db.get(
      'SELECT * FROM admin_users WHERE username = ?',
      [username],
      async (err, user) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
          if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            const token = generateToken({ 
              id: 1, 
              username: username,
              role: 'admin'
            });
            
            return res.json({
              message: 'Login successful',
              token,
              user: { id: 1, username, role: 'admin' }
            });
          }
          
          return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
        db.run(
          'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
          [user.id]
        );

        const token = generateToken({ 
          id: user.id, 
          username: user.username,
          role: 'admin'
        });

        res.json({
          message: 'Login successful',
          token,
          user: { 
            id: user.id, 
            username: user.username, 
            role: 'admin' 
          }
        });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/create-admin', [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    db.get(
      'SELECT COUNT(*) as count FROM admin_users',
      [],
      async (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        if (result.count > 0) {
          return res.status(400).json({ error: 'Admin user already exists' });
        }

        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        db.run(
          'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
          [username, passwordHash],
          function(err) {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).json({ error: 'Failed to create admin user' });
            }

            res.status(201).json({
              message: 'Admin user created successfully',
              user: { id: this.lastID, username }
            });
          }
        );
      }
    );
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

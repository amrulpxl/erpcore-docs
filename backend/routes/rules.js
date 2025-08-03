const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  const { category } = req.query;
  
  let query = 'SELECT * FROM rules WHERE is_active = 1';
  let params = [];
  
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  
  query += ' ORDER BY updated_at DESC';
  
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get(
    'SELECT * FROM rules WHERE id = ? AND is_active = 1',
    [id],
    (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!row) {
        return res.status(404).json({ error: 'Rule not found' });
      }
      
      res.json(row);
    }
  );
});

router.get('/meta/categories', (req, res) => {
  db.all(
    'SELECT DISTINCT category FROM rules WHERE is_active = 1 ORDER BY category',
    [],
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      const categories = rows.map(row => row.category);
      res.json(categories);
    }
  );
});

router.post('/', authenticateToken, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('version').optional().trim()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content, category, version = '1.0.0' } = req.body;

  db.run(
    'INSERT INTO rules (title, content, category, version) VALUES (?, ?, ?, ?)',
    [title, content, category, version],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to create rule' });
      }

      res.status(201).json({
        message: 'Rule created successfully',
        id: this.lastID
      });
    }
  );
});

router.put('/:id', authenticateToken, [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('content').optional().trim().notEmpty().withMessage('Content cannot be empty'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('version').optional().trim(),
  body('is_active').optional().isBoolean()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const updates = req.body;
  
  const fields = Object.keys(updates).filter(key => updates[key] !== undefined);
  if (fields.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }
  
  const setClause = fields.map(field => `${field} = ?`).join(', ');
  const values = fields.map(field => updates[field]);
  values.push(id);
  
  const query = `UPDATE rules SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
  
  db.run(query, values, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to update rule' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Rule not found' });
    }
    
    res.json({ message: 'Rule updated successfully' });
  });
});

router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run(
    'UPDATE rules SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [id],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to delete rule' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Rule not found' });
      }
      
      res.json({ message: 'Rule deleted successfully' });
    }
  );
});

module.exports = router;

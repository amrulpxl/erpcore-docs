const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  const { limit = 50, offset = 0 } = req.query;
  
  db.all(
    'SELECT * FROM changelog WHERE is_published = 1 ORDER BY release_date DESC, created_at DESC LIMIT ? OFFSET ?',
    [parseInt(limit), parseInt(offset)],
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json(rows);
    }
  );
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get(
    'SELECT * FROM changelog WHERE id = ? AND is_published = 1',
    [id],
    (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!row) {
        return res.status(404).json({ error: 'Changelog entry not found' });
      }
      
      res.json(row);
    }
  );
});

router.get('/meta/latest', (req, res) => {
  db.get(
    'SELECT * FROM changelog WHERE is_published = 1 ORDER BY release_date DESC, created_at DESC LIMIT 1',
    [],
    (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json(row || null);
    }
  );
});

router.get('/meta/versions', (req, res) => {
  db.all(
    'SELECT DISTINCT version FROM changelog WHERE is_published = 1 ORDER BY release_date DESC',
    [],
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      const versions = rows.map(row => row.version);
      res.json(versions);
    }
  );
});

router.post('/', authenticateToken, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('version').trim().notEmpty().withMessage('Version is required'),
  body('release_date').isISO8601().withMessage('Valid release date is required'),
  body('is_published').optional().isBoolean()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content, version, release_date, is_published = true } = req.body;

  db.get(
    'SELECT id FROM changelog WHERE version = ?',
    [version],
    (err, existingEntry) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (existingEntry) {
        return res.status(400).json({ error: 'Version already exists' });
      }

      db.run(
        'INSERT INTO changelog (title, content, version, release_date, is_published) VALUES (?, ?, ?, ?, ?)',
        [title, content, version, release_date, is_published],
        function(err) {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to create changelog entry' });
          }

          res.status(201).json({
            message: 'Changelog entry created successfully',
            id: this.lastID
          });
        }
      );
    }
  );
});

router.put('/:id', authenticateToken, [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('content').optional().trim().notEmpty().withMessage('Content cannot be empty'),
  body('version').optional().trim().notEmpty().withMessage('Version cannot be empty'),
  body('release_date').optional().isISO8601().withMessage('Valid release date is required'),
  body('is_published').optional().isBoolean()
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
  
  const query = `UPDATE changelog SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
  
  db.run(query, values, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to update changelog entry' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Changelog entry not found' });
    }
    
    res.json({ message: 'Changelog entry updated successfully' });
  });
});

router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run(
    'DELETE FROM changelog WHERE id = ?',
    [id],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to delete changelog entry' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Changelog entry not found' });
      }
      
      res.json({ message: 'Changelog entry deleted successfully' });
    }
  );
});

module.exports = router;

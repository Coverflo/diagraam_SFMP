const express = require('express');
const { dbAsync } = require('../database/connection');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await dbAsync.get(
      'SELECT id, email, first_name, last_name, role, phone, organization, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get user's favorites
router.get('/favorites', authenticateToken, async (req, res) => {
  try {
    const favorites = await dbAsync.all(`
      SELECT a.*, f.created_at as favorited_at
      FROM favorites f
      JOIN activities a ON f.activity_id = a.id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `, [req.user.id]);

    res.json(favorites);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Get user's registrations
router.get('/registrations', authenticateToken, async (req, res) => {
  try {
    const registrations = await dbAsync.all(`
      SELECT a.*, r.status, r.registered_at
      FROM registrations r
      JOIN activities a ON r.activity_id = a.id
      WHERE r.user_id = ?
      ORDER BY a.date, a.start_time
    `, [req.user.id]);

    res.json(registrations);
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// Get all users (admin only)
router.get('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { page = 1, limit = 50, role, search } = req.query;
    const offset = (page - 1) * limit;

    let sql = 'SELECT id, email, first_name, last_name, role, phone, organization, created_at FROM users';
    const params = [];
    const conditions = [];

    if (role) {
      conditions.push('role = ?');
      params.push(role);
    }

    if (search) {
      conditions.push('(first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)');
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const users = await dbAsync.all(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(*) as total FROM users';
    const countParams = [];
    
    if (conditions.length > 0) {
      countSql += ' WHERE ' + conditions.join(' AND ');
      // Add the same condition parameters (excluding limit/offset)
      for (let i = 0; i < params.length - 2; i++) {
        countParams.push(params[i]);
      }
    }

    const { total } = await dbAsync.get(countSql, countParams);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
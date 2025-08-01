const express = require('express');
const { body, validationResult } = require('express-validator');
const { dbAsync } = require('../database/connection');
const { authenticateToken, requireRole, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all activities with optional filtering
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { date, type, room, event_id = 1 } = req.query;
    
    let sql = `
      SELECT 
        a.*,
        GROUP_CONCAT(
          p.first_name || ' ' || p.last_name || '|' || p.title || '|' || p.organization, 
          ';'
        ) as presenters,
        ${req.user ? `
          CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END as is_favorite,
          CASE WHEN r.id IS NOT NULL THEN 1 ELSE 0 END as is_registered
        ` : '0 as is_favorite, 0 as is_registered'}
      FROM activities a
      LEFT JOIN activity_presenters ap ON a.id = ap.activity_id
      LEFT JOIN presenters p ON ap.presenter_id = p.id
      ${req.user ? `
        LEFT JOIN favorites f ON a.id = f.activity_id AND f.user_id = ?
        LEFT JOIN registrations r ON a.id = r.activity_id AND r.user_id = ?
      ` : ''}
      WHERE a.event_id = ?
    `;
    
    const params = [];
    if (req.user) {
      params.push(req.user.id, req.user.id);
    }
    params.push(event_id);

    if (date) {
      sql += ' AND a.date = ?';
      params.push(date);
    }
    if (type) {
      sql += ' AND a.type = ?';
      params.push(type);
    }
    if (room) {
      sql += ' AND a.room = ?';
      params.push(room);
    }

    sql += ' GROUP BY a.id ORDER BY a.date, a.start_time';

    const activities = await dbAsync.all(sql, params);

    // Parse presenters
    const formattedActivities = activities.map(activity => ({
      ...activity,
      presenters: activity.presenters ? activity.presenters.split(';').map(p => {
        const [name, title, organization] = p.split('|');
        return { name, title, organization };
      }) : [],
      is_favorite: Boolean(activity.is_favorite),
      is_registered: Boolean(activity.is_registered)
    }));

    res.json(formattedActivities);
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// Get single activity
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const sql = `
      SELECT 
        a.*,
        GROUP_CONCAT(
          p.first_name || ' ' || p.last_name || '|' || p.title || '|' || p.organization, 
          ';'
        ) as presenters,
        ${req.user ? `
          CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END as is_favorite,
          CASE WHEN r.id IS NOT NULL THEN 1 ELSE 0 END as is_registered
        ` : '0 as is_favorite, 0 as is_registered'}
      FROM activities a
      LEFT JOIN activity_presenters ap ON a.id = ap.activity_id
      LEFT JOIN presenters p ON ap.presenter_id = p.id
      ${req.user ? `
        LEFT JOIN favorites f ON a.id = f.activity_id AND f.user_id = ?
        LEFT JOIN registrations r ON a.id = r.activity_id AND r.user_id = ?
      ` : ''}
      WHERE a.id = ?
      GROUP BY a.id
    `;

    const params = req.user ? [req.user.id, req.user.id, id] : [id];
    const activity = await dbAsync.get(sql, params);

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    // Parse presenters
    const formattedActivity = {
      ...activity,
      presenters: activity.presenters ? activity.presenters.split(';').map(p => {
        const [name, title, organization] = p.split('|');
        return { name, title, organization };
      }) : [],
      is_favorite: Boolean(activity.is_favorite),
      is_registered: Boolean(activity.is_registered)
    };

    res.json(formattedActivity);
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

// Create activity (admin only)
router.post('/', authenticateToken, requireRole(['admin']), [
  body('title').notEmpty().trim(),
  body('date').isISO8601(),
  body('start_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('end_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('room').notEmpty().trim(),
  body('type').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      event_id = 1,
      title,
      subtitle,
      description,
      introduction,
      date,
      start_time,
      end_time,
      room,
      floor,
      type,
      category,
      capacity
    } = req.body;

    const result = await dbAsync.run(
      `INSERT INTO activities 
       (event_id, title, subtitle, description, introduction, date, start_time, end_time, room, floor, type, category, capacity)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [event_id, title, subtitle, description, introduction, date, start_time, end_time, room, floor, type, category, capacity]
    );

    res.status(201).json({ 
      message: 'Activity created successfully', 
      id: result.id 
    });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ error: 'Failed to create activity' });
  }
});

// Add to favorites
router.post('/:id/favorite', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if activity exists
    const activity = await dbAsync.get('SELECT id FROM activities WHERE id = ?', [id]);
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    try {
      await dbAsync.run(
        'INSERT INTO favorites (user_id, activity_id) VALUES (?, ?)',
        [userId, id]
      );
      res.json({ message: 'Added to favorites' });
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        res.status(409).json({ error: 'Already in favorites' });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
});

// Remove from favorites
router.delete('/:id/favorite', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await dbAsync.run(
      'DELETE FROM favorites WHERE user_id = ? AND activity_id = ?',
      [userId, id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Not in favorites' });
    }

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: 'Failed to remove from favorites' });
  }
});

// Register for activity
router.post('/:id/register', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if activity exists and has capacity
    const activity = await dbAsync.get('SELECT id, capacity FROM activities WHERE id = ?', [id]);
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    if (activity.capacity) {
      // Check current registrations
      const { count } = await dbAsync.get(
        'SELECT COUNT(*) as count FROM registrations WHERE activity_id = ? AND status = "registered"',
        [id]
      );
      
      if (count >= activity.capacity) {
        return res.status(409).json({ error: 'Activity is full' });
      }
    }

    try {
      await dbAsync.run(
        'INSERT INTO registrations (user_id, activity_id) VALUES (?, ?)',
        [userId, id]
      );
      res.json({ message: 'Successfully registered' });
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        res.status(409).json({ error: 'Already registered' });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Register activity error:', error);
    res.status(500).json({ error: 'Failed to register for activity' });
  }
});

module.exports = router;
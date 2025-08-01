const express = require('express');
const { body, validationResult } = require('express-validator');
const { dbAsync } = require('../database/connection');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await dbAsync.all(`
      SELECT 
        e.*,
        COUNT(a.id) as activity_count
      FROM events e
      LEFT JOIN activities a ON e.id = a.event_id
      GROUP BY e.id
      ORDER BY e.start_date DESC
    `);

    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await dbAsync.get('SELECT * FROM events WHERE id = ?', [id]);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Get event statistics
    const stats = await dbAsync.get(`
      SELECT 
        COUNT(DISTINCT a.id) as total_activities,
        COUNT(DISTINCT r.user_id) as total_registrations,
        COUNT(DISTINCT CASE WHEN a.type = 'atelier' THEN a.id END) as workshops,
        COUNT(DISTINCT CASE WHEN a.type = 'conference' THEN a.id END) as conferences
      FROM activities a
      LEFT JOIN registrations r ON a.id = r.activity_id AND r.status = 'registered'
      WHERE a.event_id = ?
    `, [id]);

    res.json({
      ...event,
      statistics: stats
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Create event (admin only)
router.post('/', authenticateToken, requireRole(['admin']), [
  body('name').notEmpty().trim(),
  body('start_date').isISO8601(),
  body('end_date').isISO8601(),
  body('venue').notEmpty().trim(),
  body('city').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      description,
      start_date,
      end_date,
      venue,
      city,
      address,
      capacity
    } = req.body;

    const result = await dbAsync.run(
      'INSERT INTO events (name, description, start_date, end_date, venue, city, address, capacity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description, start_date, end_date, venue, city, address, capacity]
    );

    res.status(201).json({ 
      message: 'Event created successfully', 
      id: result.id 
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update event (admin only)
router.put('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      start_date,
      end_date,
      venue,
      city,
      address,
      capacity,
      status
    } = req.body;

    const result = await dbAsync.run(`
      UPDATE events 
      SET name = ?, description = ?, start_date = ?, end_date = ?, venue = ?, city = ?, address = ?, capacity = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, description, start_date, end_date, venue, city, address, capacity, status, id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

module.exports = router;
// backend/src/routes/events.js
import express from 'express';
import db from '../models/index.js';
import auth from '../middleware/auth.js';

const router = express.Router();
const { Event, User } = db;

// List events (public)
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [{ model: User, attributes: ['id','name','email'] }],
      order: [['date', 'ASC']]
    });
    res.json(events);
  } catch (err) {
    console.error('List events error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get event detail (public)
router.get('/:id', async (req, res) => {
  try {
    const ev = await Event.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['id','name','email'] }]
    });
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    res.json(ev);
  } catch (err) {
    console.error('Get event error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create event (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, location, date, capacity } = req.body;
    if (!title || !date) return res.status(400).json({ message: 'title and date are required' });

    // create event with creatorId from req.user
    const ev = await Event.create({
      title,
      description,
      location,
      date: new Date(date), // ensure Date object
      capacity: capacity ? parseInt(capacity, 10) : undefined,
      creatorId: req.user.id
    });
    res.status(201).json(ev);
  } catch (err) {
    console.error('Create event error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

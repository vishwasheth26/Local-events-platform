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
// UPDATE EVENT (creator only)
router.put('/:id', auth, async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.creatorId !== userId) {
      return res.status(403).json({ message: 'Not allowed to edit this event' });
    }

    const { title, description, location, date, capacity } = req.body;

    // validation
    if (title !== undefined && String(title).trim() === '') return res.status(400).json({ message: 'Title cannot be empty' });
    if (date !== undefined && isNaN(new Date(date))) return res.status(400).json({ message: 'Invalid date' });
    if (capacity !== undefined && Number.isNaN(Number(capacity))) return res.status(400).json({ message: 'Capacity must be a number' });

    await event.update({
      title: title !== undefined ? title : event.title,
      description: description !== undefined ? description : event.description,
      location: location !== undefined ? location : event.location,
      date: date !== undefined ? new Date(date) : event.date,
      capacity: capacity !== undefined ? parseInt(capacity, 10) : event.capacity
    });

    return res.json({ message: 'Event updated', event });
  } catch (err) {
    console.error('Update error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE EVENT (creator only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.creatorId !== userId) {
      return res.status(403).json({ message: 'Not allowed to delete this event' });
    }

    await event.destroy();
    return res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});


export default router;

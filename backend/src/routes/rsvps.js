// backend/src/routes/rsvps.js
import express from 'express';
import db from '../models/index.js';
import auth from '../middleware/auth.js';

const router = express.Router();
const { RSVP, User, Event } = db;

// Create or update RSVP
router.post('/:id/rsvp', auth, async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const { status } = req.body;
    if (!['going','interested','not_going'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Use going, interested, not_going' });
    }

    const ev = await Event.findByPk(eventId);
    if (!ev) return res.status(404).json({ message: 'Event not found' });

    let rsvp = await RSVP.findOne({ where: { eventId, userId } });
    if (rsvp) {
      rsvp.status = status;
      await rsvp.save();
      return res.json({ message: 'RSVP updated', rsvp });
    } else {
      rsvp = await RSVP.create({ eventId, userId, status });
      return res.status(201).json({ message: 'RSVP created', rsvp });
    }
  } catch (err) {
    console.error('RSVP post error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// List RSVPs for event
router.get('/:id/rsvps', async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const ev = await Event.findByPk(eventId);
    if (!ev) return res.status(404).json({ message: 'Event not found' });

    const rsvps = await RSVP.findAll({
      where: { eventId },
      include: [{ model: User, attributes: ['id','name','email'] }]
    });

    return res.json(rsvps);
  } catch (err) {
    console.error('RSVP get error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id/rsvp-counts', async (req,res) => {
  const eventId = parseInt(req.params.id,10);
  const counts = await RSVP.findAll({
    where: { eventId },
    attributes: ['status', [db.Sequelize.fn('COUNT', db.Sequelize.col('status')), 'count']],
    group: ['status']
  });
  res.json(counts);
});
export default router;

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middlewares/authMiddleware');

// Validation rules
const createEventValidation = [
  check('title', 'Title is required').not().isEmpty(),
  check('date', 'Date is required').not().isEmpty(),
  check('time', 'Time is required').not().isEmpty(),
  check('location', 'Location is required').not().isEmpty()
];

// Routes
router.post('/', [authMiddleware, createEventValidation], eventController.createEvent);
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.put('/:id', authMiddleware, eventController.updateEvent);
router.delete('/:id', authMiddleware, eventController.deleteEvent);
router.post('/:id/rsvp', authMiddleware, eventController.rsvpEvent);

module.exports = router;

const { Event, User, RSVP } = require('../models');
const { Op } = require('sequelize');

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, time, price, location, isOnline, category, maxAttendees, image } = req.body;
    const organizerId = req.user.id;

    const event = await Event.create({
      title,
      description,
      date,
      time,
      price,
      location,
      isOnline,
      category,
      maxAttendees,
      organizerId,
      image
    });

    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      search, 
      startDate, 
      endDate, 
      minPrice, 
      maxPrice, 
      location, 
      isOnline,
      sortBy 
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Filters
    if (category) where.category = category;
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date[Op.gte] = startDate;
      if (endDate) where.date[Op.lte] = endDate;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    if (location) {
      where.location = { [Op.iLike]: `%${location}%` };
    }

    if (isOnline !== undefined) {
      where.isOnline = isOnline === 'true';
    }

    // Sorting
    let order = [['date', 'ASC']]; // Default
    if (sortBy === 'date_desc') order = [['date', 'DESC']];
    if (sortBy === 'price_asc') order = [['price', 'ASC']];
    if (sortBy === 'price_desc') order = [['price', 'DESC']];
    // For popularity, we'd ideally sort by attendee count, but that might require a subquery or literal
    // Simple approach if we had an 'attendeesCount' column or similar:
    // if (sortBy === 'popularity') order = [['current_attendees', 'DESC']];

    const events = await Event.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        { model: User, as: 'organizer', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'attendees', attributes: ['id'], through: { attributes: [] } }
      ],
      distinct: true, // Important for correct count with many-to-many
      order
    });

    res.json({
      events: events.rows,
      totalPages: Math.ceil(events.count / limit),
      currentPage: parseInt(page),
      totalEvents: events.count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [
        { model: User, as: 'organizer', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'attendees', attributes: ['id', 'name'], through: { attributes: ['status'] } }
      ]
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await event.update(req.body);
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await event.destroy();
    res.json({ message: 'Event deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.rsvpEvent = async (req, res) => {
  try {
    const { status } = req.body; // 'going', 'interested', 'not_going'
    const userId = req.user.id;
    const eventId = req.params.id;

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already RSVPed
    const existingRSVP = await RSVP.findOne({ where: { userId, eventId } });

    if (existingRSVP) {
      if (status === 'not_going') {
        await existingRSVP.destroy();
        return res.json({ message: 'RSVP removed' });
      }
      existingRSVP.status = status || 'going';
      await existingRSVP.save();
      return res.json(existingRSVP);
    }

    if (status === 'not_going') {
        return res.json({ message: 'RSVP removed' });
    }

    const rsvp = await RSVP.create({
      userId,
      eventId,
      status: status || 'going'
    });

    res.status(201).json(rsvp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

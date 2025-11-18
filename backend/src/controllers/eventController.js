// backend/src/controllers/eventController.js
import db from "../../models/index.js";
const { Event, User, Interest } = db;

export const createEvent = async (req, res) => {
  try {
    // Accept either `date` or `event_date` from frontend and normalize names.
    const {
      title,
      description,
      location,
      date,
      event_date,
      time,
      category,
      image,
      price,
      maxAttendees,
      maxAtt,
      isOnline,
      attendees,
      interests
    } = req.body;

    // Minimal validation
    if (!title || !(date || event_date) || !location) {
      return res.status(400).json({ message: "title, date and location are required" });
    }

    const finalDate = date || event_date;

    const event = await Event.create({
      title,
      description,
      location,
      event_date: finalDate,              // keep DB column name if it's event_date
      time: time || null,
      category: category || "General",
      image: image || null,
      price: price || "Free",
      maxAttendees: maxAttendees || maxAtt || 0,
      attendees: attendees || 0,
      isOnline: !!isOnline,
      createdBy: req.user ? req.user.id : null,
    });

    // If interests were sent and association exists, set them
    if (interests?.length && typeof event.setInterests === "function") {
      await event.setInterests(interests);
    }

    // Return consistent shape so frontend can use res.event.id
    return res.status(201).json({ message: "Event created", event });
  } catch (err) {
    console.error("Create Event error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
        {
          model: Interest,
          as: "Interests",
          through: { attributes: [] },
        },
      ],
      order: [["event_date", "ASC"]],
    });

    // Normalize for frontend: map event_date -> date if needed (frontend expects event.date)
    const normalized = events.map(ev => {
      const e = ev.toJSON ? ev.toJSON() : ev;
      if (e.event_date && !e.date) e.date = e.event_date;
      if (typeof e.attendees === "undefined") e.attendees = 0;
      if (typeof e.maxAttendees === "undefined") e.maxAttendees = e.capacity || 0;
      return e;
    });

    return res.json(normalized);
  } catch (err) {
    console.error("Get events error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

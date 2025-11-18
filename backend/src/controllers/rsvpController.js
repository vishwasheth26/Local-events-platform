import db from "../../models/index.js";
const { RSVP, Event } = db;

export const toggleRSVP = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if RSVP exists already
    const existing = await RSVP.findOne({ where: { userId, eventId } });

    if (existing) {
      // Remove RSVP (Cancel)
      await existing.destroy();
      event.attendees = event.attendees - 1;
      await event.save();

      return res.json({
        message: "RSVP cancelled",
        attendees: event.attendees,
        event,
      });
    }

    // Validate capacity
    if (event.attendees >= event.maxAttendees) {
      return res.status(400).json({ message: "Event is full." });
    }

    // Create RSVP
    await RSVP.create({ userId, eventId });
    event.attendees = event.attendees + 1;
    await event.save();

    return res.json({
      message: "RSVP confirmed",
      attendees: event.attendees,
      event,
    });

  } catch (err) {
    console.error("RSVP error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const myRsvps = async (req, res) => {
  try {
    const userId = req.user.id;

    const rsvps = await RSVP.findAll({
      where: { userId },
      include: [{ model: Event }],
    });

    res.json(rsvps);
  } catch (err) {
    console.error("myRsvps error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

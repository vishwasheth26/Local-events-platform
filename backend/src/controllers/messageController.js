// backend/src/controllers/messageController.js
import db from "../../models/index.js";
const { Message, User } = db;

/**
 * Create/send a message via HTTP.
 * Body: { eventId, text }
 * Authenticated route (req.user.id)
 */
export const sendMessage = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { eventId, text } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!eventId || !text) return res.status(400).json({ message: "eventId and text are required" });

    const saved = await Message.create({
      userId,
      eventId,
      text,
    });

    // include user info for client convenience
    const messageWithUser = await Message.findByPk(saved.id, {
      include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }],
    });

    return res.status(201).json(messageWithUser);
  } catch (err) {
    console.error("Message error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get messages sent BY the authenticated user (optional endpoint).
 */
export const getMessages = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const msgs = await Message.findAll({
      where: { userId },
      include: [{ model: User, as: "user", attributes: ["id", "name"] }],
      order: [["createdAt", "DESC"]],
    });

    res.json(msgs);
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get messages for a specific event (chat room)
 * GET /api/messages/event/:eventId
 */
export const getMessagesByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!eventId) return res.status(400).json({ message: "eventId required" });

    const messages = await Message.findAll({
      where: { eventId },
      include: [{ model: User, as: "user", attributes: ["id", "name", "email", "avatar"] }],
      order: [["createdAt", "ASC"]],
    });

    res.json(messages);
  } catch (err) {
    console.error("Get event messages error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

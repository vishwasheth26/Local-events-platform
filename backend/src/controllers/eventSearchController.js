// backend/src/controllers/eventSearchController.js
import db from "../../models/index.js";
import { Op } from "sequelize";

const { Event } = db;

export const advancedSearchEvents = async (req, res) => {
  try {
    const {
      text,
      category,
      startDate,
      endDate,
      location,
      isOnline,
      price,
    } = req.query;

    let where = {};

    // TEXT SEARCH
    if (text) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${text}%` } },
        { description: { [Op.iLike]: `%${text}%` } },
      ];
    }

    // CATEGORY FILTER
    if (category && category !== "all") {
      where.category = category;
    }

    // DATE RANGE
    if (startDate && endDate) {
      where.event_date = { [Op.between]: [startDate, endDate] };
    }

    // LOCATION
    if (location) {
      where.location = { [Op.iLike]: `%${location}%` };
    }

    // ONLINE / IN-PERSON FILTER
    if (isOnline === "true") where.isOnline = true;
    if (isOnline === "false") where.isOnline = false;

    // PRICE FILTER
    if (price === "free") where.price = "Free";
    if (price === "paid") where.price = { [Op.ne]: "Free" };

    const events = await Event.findAll({ where });

    return res.json(events);
  } catch (err) {
    console.error("Advanced Search Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

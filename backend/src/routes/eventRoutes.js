import express from "express";
import authenticateToken from "../middlewares/authMiddleware.js";

import { createEvent, getEvents } from "../controllers/eventController.js";
import { advancedSearchEvents } from "../controllers/eventSearchController.js";

const router = express.Router();

// Create event (protected)
router.post("/", authenticateToken, createEvent);

// Get all events
router.get("/", getEvents);

// Advanced search
router.get("/search/advanced", advancedSearchEvents);

export default router;

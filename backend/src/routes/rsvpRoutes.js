import express from "express";
import authenticateToken from "../middlewares/authMiddleware.js";
import { toggleRSVP, myRsvps } from "../controllers/rsvpController.js";

const router = express.Router();

// Toggle RSVP (join or cancel)
router.post("/", authenticateToken, toggleRSVP);

// Get all events the user RSVP'd for
router.get("/mine", authenticateToken, myRsvps);

export default router;

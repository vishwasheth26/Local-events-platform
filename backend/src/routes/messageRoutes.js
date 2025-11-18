import express from "express";
import authenticateToken from "../middlewares/authMiddleware.js";
import { getMessagesByEvent } from "../controllers/messageController.js";

import {
  sendMessage,
  getMessages
} from "../controllers/messageController.js";

const router = express.Router();

// Send a message
router.post("/", authenticateToken, sendMessage);

// Get my messages
router.get("/", authenticateToken, getMessages);
router.get("/event/:eventId", authenticateToken, getMessagesByEvent);

export default router;

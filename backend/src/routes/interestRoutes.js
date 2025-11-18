import express from "express";
import authenticateToken from "../middlewares/authMiddleware.js";

import {
  createInterest,
  getAllInterests,
  saveUserInterests
} from "../controllers/interestController.js";

const router = express.Router();

// Create
router.post("/create", authenticateToken, createInterest);

// Get all
router.get("/", getAllInterests);

// Save user interests
router.post("/user/save", authenticateToken, saveUserInterests);

export default router;

import express from "express";
import { body } from "express-validator";
import authenticateToken from "../middlewares/authMiddleware.js";

import {
  registerUser,
  loginUser,
  getProfile,
  sendOtp,
  verifyOtp,
} from "../controllers/userController.js";
import {
  sendForgotOtp,
  verifyForgotOtp,
  resetPassword
} from "../controllers/userController.js";

const router = express.Router();

// Register (with OTP)
router.post(
  "/register",
  body("name").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  registerUser
);

// Login (password login only)
router.post(
  "/login",
  body("email").isEmail(),
  body("password").notEmpty(),
  loginUser
);

// OTP login endpoints
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

router.post("/forgot/send-otp", sendForgotOtp);
router.post("/forgot/verify-otp", verifyForgotOtp);
router.post("/forgot/reset-password", resetPassword);


// Profile
router.get("/profile", authenticateToken, getProfile);

export default router;

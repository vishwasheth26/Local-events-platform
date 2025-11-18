// src/controllers/userController.js
import db from "../../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const { User } = db;

// ---- Email Transporter ----
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// -------------------------------
// REGISTER USER (SEND OTP)
// -------------------------------
export const registerUser = async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashed,
      isVerified: false,
    });

    // Generate Signup OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await user.update({
      otpCode: code,
      otpExpiry: new Date(Date.now() + 5 * 60000), // 5 min
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Verify your account",
      text: `Your signup OTP is: ${code}`,
    });

    return res.status(201).json({
      message: "User created. OTP sent.",
      email: user.email,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// -------------------------------
// LOGIN USER (PASSWORD)
// -------------------------------
export const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) return res.status(400).json({ error: "User not found" });

    if (!user.isVerified)
      return res.status(400).json({ error: "Please verify OTP first" });

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token, user });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// -------------------------------
// SEND OTP (LOGIN OTP)
// -------------------------------
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    user.otpCode = code;
    user.otpExpiry = new Date(Date.now() + 5 * 60000);
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your login OTP is: ${code}`,
    });

    return res.json({ message: "OTP sent" });
  } catch (err) {
    console.error("Send OTP error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// -------------------------------
// VERIFY OTP (SIGNUP / LOGIN)
// -------------------------------
export const verifyOtp = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.otpCode || user.otpCode !== code)
      return res.status(400).json({ error: "Invalid OTP" });

    if (new Date() > new Date(user.otpExpiry))
      return res.status(400).json({ error: "OTP expired" });

    user.isVerified = true;
    user.otpCode = null;
    await user.save();

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ message: "OTP verified", token, user });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
export const sendForgotOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    user.otpCode = code;
    user.otpExpiry = new Date(Date.now() + 5 * 60000); // 5 min
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password OTP",
      text: `Your OTP for password reset is: ${code}`,
    });

    res.json({ message: "OTP sent for password reset" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};
export const verifyForgotOtp = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.otpCode || user.otpCode !== code)
      return res.status(400).json({ error: "Invalid OTP" });

    if (new Date() > new Date(user.otpExpiry))
      return res.status(400).json({ error: "OTP expired" });

    // Mark as verified for password reset
    user.tempResetAllowed = true;
    await user.save();

    return res.json({ message: "OTP verified. You can reset password now." });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.tempResetAllowed)
      return res.status(400).json({ error: "OTP verification required" });

    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;
    user.tempResetAllowed = false;
    user.otpCode = null;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};


// -------------------------------
// PROFILE
// -------------------------------
export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "role", "createdAt"],
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json(user);
  } catch (err) {
    console.error("Profile error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// backend/src/server.js
import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

import db from "../models/index.js";

import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import rsvpRoutes from "./routes/rsvpRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import cmsRoutes from "./routes/cmsRoutes.js";
import interestRoutes from "./routes/interestRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
dotenv.config();

const { sequelize, Message, User } = db;

const app = express();
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],  // your frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());

// API routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/rsvp", rsvpRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/cms", cmsRoutes);
app.use("/api/interests", interestRoutes);
app.use("/api/groups", groupRoutes);

app.get("/", (req, res) => res.json({ message: "Local Events Platform API" }));

// HTTP + socket server
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// SOCKET.IO
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("joinRoom", (eventId) => {
    socket.join(`event_${eventId}`);
  });

  socket.on("leaveRoom", (eventId) => {
    socket.leave(`event_${eventId}`);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const { userId, eventId, text } = data;

      if (!userId || !eventId || !text)
        return socket.emit("errorMessage", { message: "Invalid payload" });

      const saved = await Message.create({ userId, eventId, text });

      const user = await User.findByPk(saved.userId, {
        attributes: ["id", "name"],
      });

      const payload = {
        id: saved.id,
        userId: saved.userId,
        eventId: saved.eventId,
        text: saved.text,
        createdAt: saved.createdAt,
        user,
      };

      io.to(`event_${eventId}`).emit("receiveMessage", payload);
    } catch (err) {
      console.error("Socket error:", err);
      socket.emit("errorMessage", { message: "Failed to send message" });
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// START SERVER
const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
    console.log(`🚀 Server running on port ${PORT}`);
  } catch (err) {
    console.error("❌ DB error:", err);
  }
});

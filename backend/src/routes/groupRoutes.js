// backend/src/routes/groupRoutes.js
import express from "express";
import authenticateToken from "../middlewares/authMiddleware.js";
import {
  getGroupDiscussions,
  createGroupDiscussion,
  getDiscussionDetail,
  addDiscussionComment
} from "../controllers/groupDiscussionController.js";

const router = express.Router();

router.get("/:groupId/discussions", getGroupDiscussions);
router.post("/:groupId/discussions", authenticateToken, createGroupDiscussion);
router.get("/discussion/:discussionId", getDiscussionDetail);
router.post("/discussion/:discussionId/comments", authenticateToken, addDiscussionComment);

export default router;

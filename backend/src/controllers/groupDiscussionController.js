// backend/src/controllers/groupDiscussionController.js
import db from "../../models/index.js";
const { Group, GroupDiscussion, DiscussionComment, User } = db;

export const getGroupDiscussions = async (req, res) => {
  try {
    const { groupId } = req.params;
    const discussions = await GroupDiscussion.findAll({
      where: { groupId },
      include: [{ model: User, as: "author", attributes: ["id", "name", "email"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(discussions);
  } catch (err) {
    console.error("getGroupDiscussions:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createGroupDiscussion = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { title, content } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!title || !content) return res.status(400).json({ message: "title and content required" });

    // Optional: check group exists
    const g = await Group.findByPk(groupId);
    if (!g) return res.status(404).json({ message: "Group not found" });

    const discussion = await GroupDiscussion.create({ groupId, userId, title, content });
    res.status(201).json(discussion);
  } catch (err) {
    console.error("createGroupDiscussion:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDiscussionDetail = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const discussion = await GroupDiscussion.findByPk(discussionId, {
      include: [
        { model: User, as: "author", attributes: ["id", "name"] },
        { 
          model: DiscussionComment,
          include: [{ model: User, as: "author", attributes: ["id", "name"] }],
          order: [["createdAt", "ASC"]]
        },
      ],
    });

    if (!discussion) return res.status(404).json({ message: "Discussion not found" });
    res.json(discussion);
  } catch (err) {
    console.error("getDiscussionDetail:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const addDiscussionComment = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { text } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!text) return res.status(400).json({ message: "text required" });

    // Optional: check discussion exists
    const d = await GroupDiscussion.findByPk(discussionId);
    if (!d) return res.status(404).json({ message: "Discussion not found" });

    const comment = await DiscussionComment.create({ discussionId, userId, text });
    const loaded = await DiscussionComment.findByPk(comment.id, {
      include: [{ model: User, as: "author", attributes: ["id", "name"] }]
    });

    res.status(201).json(loaded);
  } catch (err) {
    console.error("addDiscussionComment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

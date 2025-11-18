import db from "../../models/index.js";
const { Interest, UserInterests } = db;

export const createInterest = async (req, res) => {
  try {
    const { name } = req.body;
    const interest = await Interest.create({ name });
    res.status(201).json(interest);
  } catch (err) {
    console.error("Create interest error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllInterests = async (req, res) => {
  try {
    const interests = await Interest.findAll();
    res.json(interests);
  } catch (err) {
    console.error("Get interests error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const saveUserInterests = async (req, res) => {
  try {
    await UserInterests.destroy({ where: { userId: req.user.id } });

    await UserInterests.bulkCreate(
      req.body.interests.map((i) => ({
        userId: req.user.id,
        interestId: i,
      }))
    );

    res.json({ message: "Interests saved" });
  } catch (err) {
    console.error("Save interests error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

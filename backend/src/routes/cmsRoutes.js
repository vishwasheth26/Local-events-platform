import express from "express";
import axios from "axios";

const router = express.Router();
const STRAPI_URL = "http://localhost:1337/api";

// Blogs
router.get("/blogs", async (req, res) => {
  try {
    const response = await axios.get(`${STRAPI_URL}/blogs?populate=*`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// Announcements
router.get("/announcements", async (req, res) => {
  try {
    const response = await axios.get(`${STRAPI_URL}/announcements?populate=*`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
});

export default router;

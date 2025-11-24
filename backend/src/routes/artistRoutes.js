import express from "express";
import { getArtist, getSuggestion } from "../services/spotifyServices.js";

const router = express.Router();

// Fetch artist info
router.get("/search", async (req, res) => {
  try {
    const { artist } = req.query;
    if (!artist)
      return res.status(400).json({ error: "Missing artist name" });

    const data = await getArtist(artist);
    res.json(data);
  } catch (err) {
    console.error("Artist error:", err);
    res.status(500).json({ error: "Error fetching artist" });
  }
});

// Suggestions
router.get("/suggest", async (req, res) => {
  try {
    const query = req.query.query || "";
    const suggestions = await getSuggestion(query);
    res.json(suggestions);
  } catch (err) {
    console.error("Suggestion error:", err);
    res.status(500).json({ error: "Error fetching suggestions" });
  }
});

export default router;

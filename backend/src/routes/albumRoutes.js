import express from "express";
import { getAlbum } from "../services/spotifyServices.js";

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const { artistId } = req.query;
    if (!artistId || !artistId.trim()) {
      return res.status(400).json({ error: "Missing or invalid artistId" });
    }
    const albums = await getAlbum(artistId);
    res.json(albums);
  } 
  catch (err) {
    console.error(`Album error for artist ${req.query.artistId}:`, err);
    if (err.response?.status === 401) {
      return res.status(401).json({ error: "Unauthorized - token expired" });
    }
    if (err.response?.status === 404) {
      return res.status(404).json({ error: "Artist not found" });
    }
    if (err.response?.status === 429) {
      return res.status(429).json({ error: "Rate limited - try again later" });
    }
    res.status(500).json({ error: err.message || "Error fetching albums" });
  }
});

export default router;
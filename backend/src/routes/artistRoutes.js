import express from "express";
import { getArtist, getArtistById, getSuggestion, getTopTracks } from "../services/spotifyServices.js";

const router = express.Router();

// Fetch artist by name (for search)
router.get("/search", async (req, res) => {
  try {
    const { artist } = req.query;
    if (!artist) {
      return res.status(400).json({ error: "Missing artist name" });
    }

    const data = await getArtist(artist);
    res.json(data);
  } catch (err) {
    console.error("Artist search error:", err);
    res.status(500).json({ error: "Error fetching artist" });
  }
});

// Get suggestions while typing
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

// ✅ Get artist details by ID (not by name!)
router.get("/detail", async (req, res) => {
  try {
    const { artistId } = req.query;
    if (!artistId || !artistId.trim()) {
      return res.status(400).json({ error: "Missing or invalid artistId" });
    }

    // ✅ Use getArtistById instead of getArtist
    const artist = await getArtistById(artistId);
    res.json(artist);
  } catch (err) {
    console.error(`Artist detail error for ID ${req.query.artistId}:`, err);
    
    if (err.response?.status === 404) {
      return res.status(404).json({ error: "Artist not found" });
    }
    
    res.status(500).json({ error: err.message || "Error fetching artist details" });
  }
});

// Get top tracks for an artist
router.get("/top-tracks", async (req, res) => {
  try {
    const { artistId } = req.query;

    if (!artistId || !artistId.trim()) {
      return res.status(400).json({ error: "Missing or invalid artistId" });
    }

    const tracks = await getTopTracks(artistId);
    res.json(tracks);
  } catch (err) {
    console.error(`Top tracks error for artist ${req.query.artistId}:`, err);

    if (err.response?.status === 401) {
      return res.status(401).json({ error: "Unauthorized - token expired" });
    }
    if (err.response?.status === 404) {
      return res.status(404).json({ error: "Artist not found" });
    }

    res.status(500).json({ error: err.message || "Error fetching top tracks" });
  }
});

export default router;
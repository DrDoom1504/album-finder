import express from "express";
import { getAlbum, getAlbumById } from "../services/spotifyServices.js";

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

router.get("/detail", async (req, res) => {
  try {
    const { albumId } = req.query;
    if (!albumId || !albumId.trim()) {
      return res.status(400).json({ error: "Missing or invalid albumId" });
    }
    const album = await getAlbumById(albumId);
    res.json(album);
  } catch (err) {
    console.error(`Album detail error for id ${req.query.albumId}:`, err);
    if (err.response?.status === 401) {
      return res.status(401).json({ error: "Unauthorized - token expired" });
    }
    if (err.response?.status === 404) {
      return res.status(404).json({ error: "Album not found" });
    }
    if (err.response?.status === 429) {
      return res.status(429).json({ error: "Rate limited - try again later" });
    }
    res.status(500).json({ error: err.message || "Error fetching album details" });
  }
});

export default router;
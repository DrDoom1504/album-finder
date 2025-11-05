import express from "express";
import { getArtist } from "../services/spotifyServices.js";

const router = express.Router();

// GET /api/artist/search?artist=<name>
router.get("/search", async (req, res) => {
    try {
        const { artist } = req.query;
        const data = await getArtist(artist);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching artist" });
    }
});

export default router;
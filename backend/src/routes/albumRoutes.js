import express from "express";
import { getAlbum } from "../services/spotifyServices.js";

const router = express.Router();


router.get("/search", async (req, res) => {
    try {
        const { artistId } = req.query;
        const data = await getAlbum(artistId);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching albums" });
    }
});

export default router;
import express from "express";
import { getAlbum } from "../services/spotifyServices.js";

const router = express.Router();


router.get("/search", async (req, res) => {
    try {
        const { artistId } = req.query;
        if (!artistId) {
            return res.status(400).json({ error: "Missing required query param: artistId" });
        }
        const data = await getAlbum(artistId);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching albums" });
    }
});

export default router;
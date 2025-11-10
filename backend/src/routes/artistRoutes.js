import express from "express";
import { getArtist, getSuggestion } from "../services/spotifyServices.js";

const router = express.Router();


router.get("/search", async (req, res) => {
  try {
    const { artist } = req.query;
    const data = await getArtist(artist);
    res.json(data);
  }catch(err){
   console.error(err);
        res.status(500).json({ error: "Error fetching albums" });
}
});
router.get("/suggest", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);
    const suggestions = await getSuggestion(query);
    return res.json(suggestions || []);
  } catch (err) {
    console.error('Suggestion error:', err.message);
    res.status(500).json({ error: "Error fetching suggestions" });
  }
});
export default router;
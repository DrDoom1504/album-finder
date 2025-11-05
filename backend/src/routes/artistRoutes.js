import express from "express";
import { getArtist } from "../services/spotifyServices.js";

const router = express.Router();


router.get("/search", async (req, res) => {
  try {
    const { artist } = req.query;
    const data = await getArtist(artist);
    res.json(data);
  }catch(err){
    console.log(err);
}
});

export default router;
import express from "express";
import { v4 as uuidv4 } from "uuid";
import { getUserBySession } from "../utils/authHelpers.js";
import { pool } from "../db.js";

const router = express.Router();

router.post("/history", async (req, res) => {
  try {
    const sessionId = req.cookies?.local_sid;
    const user = await getUserBySession(sessionId);
    if (!user) return res.status(401).json({ error: "Not authenticated" });

    const { artistId, artistName, artistImage, query } = req.body;
    if (!artistId && !query) {
      return res.status(400).json({ error: "artistId or query is required" });
    }

    await pool.query(
      `DELETE FROM search_history
       WHERE user_id = $1
       AND (
         ($2::text IS NOT NULL AND artist_id = $2)
         OR ($2::text IS NULL AND $3::text IS NOT NULL AND LOWER(query) = LOWER($3))
       )`,
      [user.id, artistId || null, query || artistName || null]
    );

    await pool.query(
      "INSERT INTO search_history (id, user_id, artist_id, artist_name, artist_image, query) VALUES ($1, $2, $3, $4, $5, $6)",
      [uuidv4(), user.id, artistId || null, artistName || null, artistImage || null, query || null]
    );

    await pool.query(
      `DELETE FROM search_history
       WHERE user_id = $1
       AND id NOT IN (
         SELECT id FROM search_history
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT 5
       )`,
      [user.id]
    );

    return res.json({ ok: true });
  } catch (err) {
    console.error("Failed to save search history", err);
    return res.status(500).json({ error: "Could not save search history" });
  }
});

router.get("/history", async (req, res) => {
  try {
    const sessionId = req.cookies?.local_sid;
    const user = await getUserBySession(sessionId);
    if (!user) return res.status(401).json({ error: "Not authenticated" });

    const { rows } = await pool.query(
      `SELECT id, artist_id, artist_name, artist_image, query, created_at
       FROM (
         SELECT DISTINCT ON (COALESCE(artist_id, LOWER(query), LOWER(artist_name)))
           id, artist_id, artist_name, artist_image, query, created_at
         FROM search_history
         WHERE user_id = $1
         ORDER BY COALESCE(artist_id, LOWER(query), LOWER(artist_name)), created_at DESC
       ) deduped_history
       ORDER BY created_at DESC
       LIMIT 20`,
      [user.id]
    );

    return res.json({ history: rows });
  } catch (err) {
    console.error("Failed to load search history", err);
    return res.status(500).json({ error: "Could not load search history" });
  }
});

router.delete("/history/:id", async (req, res) => {
  try {
    const sessionId = req.cookies?.local_sid;
    const user = await getUserBySession(sessionId);
    if (!user) return res.status(401).json({ error: "Not authenticated" });

    await pool.query("DELETE FROM search_history WHERE id = $1 AND user_id = $2", [req.params.id, user.id]);
    return res.json({ ok: true });
  } catch (err) {
    console.error("Failed to remove search history", err);
    return res.status(500).json({ error: "Could not remove search history" });
  }
});

router.delete("/history", async (req, res) => {
  try {
    const sessionId = req.cookies?.local_sid;
    const user = await getUserBySession(sessionId);
    if (!user) return res.status(401).json({ error: "Not authenticated" });

    await pool.query("DELETE FROM search_history WHERE user_id = $1", [user.id]);
    return res.json({ ok: true });
  } catch (err) {
    console.error("Failed to clear search history", err);
    return res.status(500).json({ error: "Could not clear search history" });
  }
});

export default router;

import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { pool } from "../db.js";

export async function findUserByEmail(email) {
  const { rows } = await pool.query("SELECT id, email, password_hash, display_name FROM users WHERE email = $1", [email.toLowerCase()]);
  return rows[0] || null;
}

export async function getUserById(id) {
  const { rows } = await pool.query("SELECT id, email, display_name FROM users WHERE id = $1", [id]);
  return rows[0] || null;
}

export async function createUser({ email, password, displayName, spotifyId }) {
  const password_hash = password ? await bcrypt.hash(password, 10) : null;
  const id = uuidv4();
  await pool.query(
    "INSERT INTO users (id, email, password_hash, spotify_id, display_name) VALUES ($1, $2, $3, $4, $5)",
    [id, email.toLowerCase(), password_hash, spotifyId || null, displayName]
  );
  return { id, email: email.toLowerCase(), display_name: displayName, spotify_id: spotifyId || null };
}

export async function findUserBySpotifyId(spotifyId) {
  const { rows } = await pool.query(
    "SELECT id, email, display_name, spotify_id FROM users WHERE spotify_id = $1",
    [spotifyId]
  );
  return rows[0] || null;
}

export async function updateUserSpotifyId(userId, spotifyId) {
  await pool.query("UPDATE users SET spotify_id = $1 WHERE id = $2", [spotifyId, userId]);
}

export async function createLocalSession(userId) {
  const sessionId = uuidv4();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  await pool.query(
    "INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)",
    [sessionId, userId, expiresAt.toISOString()]
  );
  return sessionId;
}

export async function getUserBySession(sessionId) {
  if (!sessionId) return null;

  const { rows } = await pool.query(
    `SELECT u.id, u.email, u.display_name
     FROM users u
     JOIN sessions s ON s.user_id = u.id
     WHERE s.id = $1 AND s.expires_at > NOW()`,
    [sessionId]
  );

  return rows[0] || null;
}

export async function deleteLocalSession(sessionId) {
  if (!sessionId) return;
  await pool.query("DELETE FROM sessions WHERE id = $1", [sessionId]);
}

export async function validatePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

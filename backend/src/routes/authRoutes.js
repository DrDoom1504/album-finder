import express from "express";
import fetch from "node-fetch";
import crypto from "crypto";
import {
  createUser,
  findUserByEmail,
  findUserBySpotifyId,
  updateUserSpotifyId,
  createLocalSession,
  getUserBySession,
  deleteLocalSession,
  validatePassword,
} from "../utils/authHelpers.js";

const router = express.Router();

const SESSIONS = {}; 

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
  FRONTEND_URL = "http://localhost:5173",
} = process.env;

function base64Credentials() {
  return Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64");
}

router.get("/login", (_req, res) => {
  // Validate required env vars early to give a clear error instead of sending 'undefined' to Spotify
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_REDIRECT_URI) {
    console.error("[auth] Missing SPOTIFY_CLIENT_ID or SPOTIFY_REDIRECT_URI env var", {
      SPOTIFY_CLIENT_ID: !!SPOTIFY_CLIENT_ID,
      SPOTIFY_REDIRECT_URI: !!SPOTIFY_REDIRECT_URI,
    });
    return res.status(500).send("Server misconfigured: missing Spotify client ID or redirect URI");
  }

  console.log("[auth] using redirect_uri=", SPOTIFY_REDIRECT_URI);
  const state = crypto.randomBytes(16).toString("hex");
  const scope = [
    "streaming",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-email",
    "user-read-private",
  ].join(" ");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: SPOTIFY_CLIENT_ID,
    scope,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    state,
  });

  const authorizeUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  res.redirect(authorizeUrl);
});

// Simple health check
router.get("/health", (_req, res) => res.json({ ok: true }));

router.get("/callback", async (req, res) => {
  const { code, state, error } = req.query;
  if (error) return res.status(400).send(`Spotify auth error: ${error}`);

  try {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
    });

    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${base64Credentials()}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const tokenJson = await tokenRes.json();
    if (!tokenRes.ok) return res.status(500).json(tokenJson);

    const { refresh_token, access_token } = tokenJson;
    const sessionId = crypto.randomBytes(16).toString("hex");
    SESSIONS[sessionId] = { refresh_token };

    const profileRes = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const profile = await profileRes.json();
    if (!profileRes.ok) return res.status(500).json(profile);

    let user = await findUserBySpotifyId(profile.id);
    if (!user) {
      const existingByEmail = profile.email ? await findUserByEmail(profile.email) : null;
      if (existingByEmail) {
        await updateUserSpotifyId(existingByEmail.id, profile.id);
        user = existingByEmail;
      } else {
        user = await createUser({
          email: profile.email || `${profile.id}@spotify.local`,
          displayName: profile.display_name || profile.id,
          spotifyId: profile.id,
        });
      }
    }

    const localSessionId = await createLocalSession(user.id);
    res.cookie("local_sid", localSessionId, { httpOnly: true, sameSite: "lax" });
    res.cookie("spotify_sid", sessionId, { httpOnly: true, sameSite: "lax" });
    res.redirect(FRONTEND_URL);
  } catch (err) {
    console.error("Error in /auth/callback:", err);
    res.status(500).send("Auth callback failed");
  }
});

router.get("/refresh", async (req, res) => {
  try {
    const sessionId = req.cookies?.spotify_sid;
    if (!sessionId || !SESSIONS[sessionId]) return res.status(401).json({ error: "Not authenticated" });

    const { refresh_token } = SESSIONS[sessionId];
    const body = new URLSearchParams({ grant_type: "refresh_token", refresh_token });

    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${base64Credentials()}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const tokenJson = await tokenRes.json();
    if (!tokenRes.ok) return res.status(500).json(tokenJson);


    return res.json({ access_token: tokenJson.access_token, expires_in: tokenJson.expires_in });
  } catch (err) {
    console.error("Error in /auth/refresh:", err);
    res.status(500).json({ error: "Failed to refresh token" });
  }
});

router.get("/me", async (req, res) => {
  try {
    const localSessionId = req.cookies?.local_sid;
    if (localSessionId) {
      const user = await getUserBySession(localSessionId);
      if (user) {
        return res.json({ profile: { email: user.email, display_name: user.display_name, local: true } });
      }
    }

    const sessionId = req.cookies?.spotify_sid;
    if (!sessionId || !SESSIONS[sessionId]) return res.status(401).json({ error: "Not authenticated" });

    const { refresh_token } = SESSIONS[sessionId];
    const body = new URLSearchParams({ grant_type: "refresh_token", refresh_token });
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${base64Credentials()}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });
    const tokenJson = await tokenRes.json();
    if (!tokenRes.ok) return res.status(500).json(tokenJson);

    const access_token = tokenJson.access_token;
    const profileRes = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const profile = await profileRes.json();
    if (!profileRes.ok) return res.status(500).json(profile);

    return res.json({ profile, access_token });
  } catch (err) {
    console.error("Error in /auth/me:", err);
    res.status(500).json({ error: "Failed to get profile" });
  }
});

router.get("/logout", async (req, res) => {
  const spotifySessionId = req.cookies?.spotify_sid;
  const localSessionId = req.cookies?.local_sid;
  if (spotifySessionId) delete SESSIONS[spotifySessionId];
  if (localSessionId) await deleteLocalSession(localSessionId);
  res.clearCookie("spotify_sid");
  res.clearCookie("local_sid");
  res.json({ ok: true });
});

router.post("/local/signup", async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "Email is already registered" });
    }

    const user = await createUser({ email, password, displayName });
    const sessionId = await createLocalSession(user.id);
    res.cookie("local_sid", sessionId, { httpOnly: true, sameSite: "lax" });
    res.json({ profile: { email: user.email, display_name: user.display_name, local: true } });
  } catch (err) {
    console.error("Signup failed", err);
    res.status(500).json({ error: "Signup failed" });
  }
});

router.post("/local/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await validatePassword(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const sessionId = await createLocalSession(user.id);
    res.cookie("local_sid", sessionId, { httpOnly: true, sameSite: "lax" });
    res.json({ profile: { email: user.email, display_name: user.display_name, local: true } });
  } catch (err) {
    console.error("Login failed", err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;

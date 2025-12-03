import express from "express";
import fetch from "node-fetch";
import crypto from "crypto";

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

    const { refresh_token } = tokenJson;
    const sessionId = crypto.randomBytes(16).toString("hex");
    SESSIONS[sessionId] = { refresh_token };

  
    res.cookie("sid", sessionId, { httpOnly: true, sameSite: "lax" });

    res.redirect(FRONTEND_URL || "/");
  } catch (err) {
    console.error("Error in /auth/callback:", err);
    res.status(500).send("Auth callback failed");
  }
});

router.get("/refresh", async (req, res) => {
  try {
    const sessionId = req.cookies?.sid;
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
    const sessionId = req.cookies?.sid;
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

router.get("/logout", (req, res) => {
  const sessionId = req.cookies?.sid;
  if (sessionId) delete SESSIONS[sessionId];
  res.clearCookie("sid");
  res.json({ ok: true });
});

export default router;

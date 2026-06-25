import React, { useCallback, useEffect, useState, useRef } from "react";
import { AuthContext } from "./authContextValue";
import { recentSearchesStorage } from "../utils/storage";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const playerRef = useRef(null);

  const fetchMe = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, { credentials: "include" });
      if (!res.ok) return null;
      const json = await res.json();
      setUser(json.profile);
      setAccessToken(json.access_token);
      setIsPremium(json.profile.product === "premium");
      return json;
    } catch {
      return null;
    }
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/refresh`, { credentials: "include" });
      if (!res.ok) return null;
      const json = await res.json();
      setAccessToken(json.access_token);
      return json.access_token;
    } catch {
      return null;
    }
  }, []);

 
  useEffect(() => {
    // Restore any existing cookie-backed session when the app boots.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMe();
  }, [fetchMe]);

  
  useEffect(() => {
    if (!isPremium) return;
    
    if (window.Spotify) initPlayer();
    else {
      const tag = document.createElement("script");
      tag.src = "https://sdk.scdn.co/spotify-player.js";
      tag.async = true;
      document.body.appendChild(tag);
      window.onSpotifyWebPlaybackSDKReady = initPlayer;
    }

    async function initPlayer() {
      if (playerRef.current) return;
      const token = await refreshAccessToken();
      const player = new window.Spotify.Player({
        name: "Album Finder Player",
        getOAuthToken: cb => cb(token),
      });

      player.addListener("ready", ({ device_id }) => {
        setDeviceId(device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        setDeviceId((currentDeviceId) => (device_id === currentDeviceId ? null : currentDeviceId));
      });

      player.connect();
      playerRef.current = player;
    }
  }, [isPremium, refreshAccessToken]);

  async function logout() {
    await fetch(`${API_BASE}/api/auth/logout`, { credentials: "include" });
    setUser(null);
    setAccessToken(null);
    setIsPremium(false);
    setDeviceId(null);
    recentSearchesStorage.clearAll();
  }

  async function authPost(path, body) {
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      return { ok: res.ok, json };
    } catch {
      return { ok: false, json: { error: "Network error" } };
    }
  }

  async function loginLocal({ email, password }) {
    const { ok, json } = await authPost("/api/auth/local/login", { email, password });
    if (!ok) return { ok: false, error: json.error || "Login failed" };
    setUser(json.profile);
    setAccessToken(null);
    setIsPremium(false);
    setDeviceId(null);
    return { ok: true };
  }

  async function signupLocal({ email, password, displayName }) {
    const { ok, json } = await authPost("/api/auth/local/signup", { email, password, displayName });
    if (!ok) return { ok: false, error: json.error || "Signup failed" };
    setUser(json.profile);
    setAccessToken(null);
    setIsPremium(false);
    setDeviceId(null);
    return { ok: true };
  }

  async function playSpotifyTrack(trackId) {

    if (!deviceId) return { ok: false, reason: "no-device" };
    const token = await refreshAccessToken();
    if (!token) return { ok: false, reason: "no-token" };

    const url = `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`;
    const body = { uris: [`spotify:track:${trackId}`] };
    const res = await fetch(url, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return { ok: res.ok, status: res.status };
  }

  const value = {
    user,
    isPremium,
    deviceId,
    accessToken,
    fetchMe,
    refreshAccessToken,
    playSpotifyTrack,
    login: () => (window.location.href = `${API_BASE}/api/auth/login`),
    loginLocal,
    signupLocal,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

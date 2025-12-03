import React, { createContext, useContext, useEffect, useState, useRef } from "react";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const playerRef = useRef(null);
  // Backend is running on port 5000 in this environment
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  async function fetchMe() {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, { credentials: "include" });
      if (!res.ok) return null;
      const json = await res.json();
      setUser(json.profile);
      setAccessToken(json.access_token);
      setIsPremium(json.profile.product === "premium");
      return json;
    } catch (err) {
      return null;
    }
  }

  async function refreshAccessToken() {
    try {
      const res = await fetch(`${API_BASE}/api/auth/refresh`, { credentials: "include" });
      if (!res.ok) return null;
      const json = await res.json();
      setAccessToken(json.access_token);
      return json.access_token;
    } catch (err) {
      return null;
    }
  }

 
  useEffect(() => {
    fetchMe();
  }, []);

  
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
        if (device_id === deviceId) setDeviceId(null);
      });

      player.connect();
      playerRef.current = player;
    }
  }, [isPremium]);

  async function logout() {
    await fetch(`${API_BASE}/api/auth/logout`, { credentials: "include" });
    setUser(null);
    setAccessToken(null);
    setIsPremium(false);
    setDeviceId(null);
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
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

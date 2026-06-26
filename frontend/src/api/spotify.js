import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export const suggestArtists = async (q) => {
  const res = await API.get(`/api/artist/suggest?query=${encodeURIComponent(q)}`);
  return res.data;
};

export const searchArtist = async (q) => {
  // returns artist object (first match)
  const res = await API.get(`/api/artist/search?artist=${encodeURIComponent(q)}`);
  return res.data;
};

export const getAlbumsByArtist = async (artistId) => {
  const res = await API.get(`/api/album/search?artistId=${encodeURIComponent(artistId)}`);
  return res.data;
};

export const getArtistDetails = async (artistId) => {
  const res = await API.get(`/api/artist/detail?artistId=${encodeURIComponent(artistId)}`);
  return res.data;
};

export const getArtistTopTracks = async (artistId) => {
  const res = await API.get(`/api/artist/top-tracks?artistId=${encodeURIComponent(artistId)}`);
  return res.data;
};

export const getAlbumDetails = async (albumId) => {
  const res = await API.get(`/api/album/detail?albumId=${encodeURIComponent(albumId)}`);
  return res.data;
};

export const saveSearchHistory = async ({ artistId, artistName, artistImage, query }) => {
  const res = await API.post(
    "/api/search/history",
    { artistId, artistName, artistImage, query },
    { withCredentials: true }
  );
  return res.data;
};

export const loadSearchHistory = async () => {
  const res = await API.get("/api/search/history", { withCredentials: true });
  return res.data.history || [];
};

export const deleteSearchHistoryItem = async (historyId) => {
  const res = await API.delete(`/api/search/history/${encodeURIComponent(historyId)}`, {
    withCredentials: true,
  });
  return res.data;
};

export const clearSearchHistory = async () => {
  const res = await API.delete("/api/search/history", { withCredentials: true });
  return res.data;
};

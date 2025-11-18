import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // adjust to your backend
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

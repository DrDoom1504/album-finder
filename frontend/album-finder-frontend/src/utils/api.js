import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export const artistAPI = {
  // Search for artists by name (suggestions)
  suggest: async (query) => {
    try {
      const res = await axios.get(`${API_BASE}/artist/suggest?query=${encodeURIComponent(query)}`);
      return res.data || [];
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      throw new Error("Failed to fetch suggestions");
    }
  },

  // Search for a single artist by name
  search: async (artistName) => {
    try {
      const res = await axios.get(
        `${API_BASE}/artist/search?artist=${encodeURIComponent(artistName)}`
      );
      return res.data;
    } catch (err) {
      console.error("Error fetching artist:", err);
      throw new Error("Failed to fetch artist");
    }
  },
};

export const albumAPI = {
  // Get albums for a specific artist
  getByArtist: async (artistId) => {
    try {
      const res = await axios.get(`${API_BASE}/album/search?artistId=${artistId}`);
      return res.data || [];
    } catch (err) {
      console.error("Error fetching albums:", err);
      throw new Error("Failed to fetch albums");
    }
  },
};

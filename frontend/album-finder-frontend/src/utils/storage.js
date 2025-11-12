// Manage recent searches in localStorage

export const recentSearchesStorage = {
  KEY: "recentSearches",
  MAX_ITEMS: 5,

  // Get all recent searches
  get: () => {
    try {
      const saved = localStorage.getItem(recentSearchesStorage.KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Error reading from localStorage:", err);
      return [];
    }
  },

  // Add or update a recent search
  add: (artistName, artistId) => {
    try {
      const current = recentSearchesStorage.get();
      const updated = [
        { name: artistName, id: artistId },
        ...current.filter((a) => a.id !== artistId),
      ].slice(0, recentSearchesStorage.MAX_ITEMS);

      localStorage.setItem(recentSearchesStorage.KEY, JSON.stringify(updated));
      return updated;
    } catch (err) {
      console.error("Error writing to localStorage:", err);
      return current;
    }
  },

  // Clear all recent searches
  clear: () => {
    try {
      localStorage.removeItem(recentSearchesStorage.KEY);
    } catch (err) {
      console.error("Error clearing localStorage:", err);
    }
  },
};

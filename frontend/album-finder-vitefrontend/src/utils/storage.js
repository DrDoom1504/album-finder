export const recentSearchesStorage = {
  KEY: "recentSearches",
  MAX_ITEMS: 8,
  get: () => {
    try {
      const raw = localStorage.getItem(recentSearchesStorage.KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },
  set: (arr) => localStorage.setItem(recentSearchesStorage.KEY, JSON.stringify(arr)),
  add: (artist) => {
    const current = recentSearchesStorage.get();
    const filtered = current.filter(a => a.id !== artist.id);
    const updated = [artist, ...filtered].slice(0, recentSearchesStorage.MAX_ITEMS);
    recentSearchesStorage.set(updated);
    return updated;
  },
  remove: (id) => {
    const current = recentSearchesStorage.get();
    const updated = current.filter(a => a.id !== id);
    recentSearchesStorage.set(updated);
    return updated;
  },
  clear: () => {
    localStorage.removeItem(recentSearchesStorage.KEY);
  }
};

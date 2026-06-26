export const recentSearchesStorage = {
  KEY: "recentSearches",
  ANONYMOUS_COUNT_KEY: "anonymousSearchCount",
  MAX_ITEMS: 5,
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
    const updated = current.filter((a) => String(a.id) !== String(id));
    recentSearchesStorage.set(updated);
    return updated;
  },
  clear: () => {
    localStorage.removeItem(recentSearchesStorage.KEY);
  },
  getAnonymousSearchCount: () => {
    const raw = localStorage.getItem(recentSearchesStorage.ANONYMOUS_COUNT_KEY);
    const count = raw ? parseInt(raw, 10) : 0;
    return Number.isNaN(count) ? 0 : count;
  },
  incrementAnonymousSearchCount: () => {
    const next = recentSearchesStorage.getAnonymousSearchCount() + 1;
    localStorage.setItem(recentSearchesStorage.ANONYMOUS_COUNT_KEY, String(next));
    return next;
  },
  resetAnonymousSearchCount: () => {
    localStorage.removeItem(recentSearchesStorage.ANONYMOUS_COUNT_KEY);
  },
  clearAll: () => {
    recentSearchesStorage.clear();
    recentSearchesStorage.resetAnonymousSearchCount();
  }
};

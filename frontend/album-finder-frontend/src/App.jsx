import { useEffect, useState } from "react";
import {
    AlbumGrid,
    ArtistModal,
    ErrorBanner,
    Header,
    LoadingOverlay,
    SearchBar,
} from "./components";
import { albumAPI, artistAPI } from "./utils/api";
import { recentSearchesStorage } from "./utils/storage";

function App() {
  // State management
  const [albums, setAlbums] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loadingAlbums, setLoadingAlbums] = useState(false);
  const [error, setError] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);

  // Load recent searches on mount
  useEffect(() => {
    const saved = recentSearchesStorage.get();
    setRecentSearches(saved);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('[data-search-container]')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Fetch suggestions with debounce
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setLoadingSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);
    setError("");

    const fetchSuggestions = async () => {
      try {
        const data = await artistAPI.suggest(query);
        setSuggestions(data);
      } catch (err) {
        setError("Failed to fetch suggestions. Please try again.");
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  // Save artist to recent searches
  const saveRecentSearch = (artistName, artistId,artistFollowers,artistImage) => {
    recentSearchesStorage.add(artistName, artistId,artistFollowers,artistImage);
    setRecentSearches(recentSearchesStorage.get());
  };

  // Handle query change
  const handleQueryChange = (newQuery) => {
    setQuery(newQuery);
    setShowDropdown(true);
  };

  // Handle input focus
  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  // Handle artist selection (show modal)
  const handleSelectArtist = (artistId, artistName) => {
    const artist = suggestions.find((a) => a.id === artistId);
    if (!artist) {
      // Try to find in recent searches
      const recent = recentSearches.find((a) => a.id === artistId);
      if (recent) {
        setSelectedArtist({
          ...recent,
          image: recent.image || null,
          followers: recent.followers || 0,
          genres: recent.genres || [],
        });
      }
    } else {
      setSelectedArtist(artist);
    }
    setShowDropdown(false);
    setSuggestions([]);
    setQuery("");
  };

  // View albums for selected artist
  const handleViewArtistAlbums = async (artistId) => {
    try {
      setLoadingAlbums(true);
      setError("");
      const data = await albumAPI.getByArtist(artistId);

      if (data.length === 0) {
        setError("No albums found for this artist.");
        setAlbums([]);
      } else {
        setAlbums(data);
        if (selectedArtist) {
          saveRecentSearch(selectedArtist.name, artistId,selectedArtist.followers,selectedArtist.image);
        }
      }
      setSelectedArtist(null);
    } catch (err) {
      setError("Failed to fetch albums. Please try again.");
      setAlbums([]);
    } finally {
      setLoadingAlbums(false);
    }
  };

  const handleRemoveRecent = (id) => {
  const updated = recentSearchesStorage.remove(id);
  setRecentSearches(updated);
};

const handleClearAll = () => {
  recentSearchesStorage.clear();
  setRecentSearches([]);
};

  return (
    <div
      style={{
        textAlign: "center",
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <Header />

      {/* Error Message */}
      <ErrorBanner error={error} onClose={() => setError("")} />

      {/* Search Bar */}
      <SearchBar
        query={query}
        suggestions={suggestions}
        recentSearches={recentSearches}
        isLoadingSuggestions={loadingSuggestions}
        isDropdownOpen={showDropdown}
        onQueryChange={handleQueryChange}
        onFocus={handleInputFocus}
        onSelectArtist={handleSelectArtist}
        onRemoveRecent={handleRemoveRecent}
        onClearAll={handleClearAll}
      />

      {/* Loading State */}
      {loadingAlbums && <LoadingOverlay message="Loading albums..." />}

      {/* Album Grid */}
      {!loadingAlbums && <AlbumGrid albums={albums} isLoading={loadingAlbums} />}

      {/* Artist Modal */}
      <ArtistModal
        artist={selectedArtist}
        onViewAlbums={handleViewArtistAlbums}
        onClose={() => setSelectedArtist(null)}
      />
    </div>
  );
}

export default App;

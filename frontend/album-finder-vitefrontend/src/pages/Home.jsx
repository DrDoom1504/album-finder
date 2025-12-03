import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import AlbumCard from "../components/AlbumCard";
import { suggestArtists, getAlbumsByArtist } from "../api/spotify";
import { recentSearchesStorage } from "../utils/storage.js";

export default function Home() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [recent, setRecent] = useState(recentSearchesStorage.get());
  const [albums, setAlbums] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    setRecent(recentSearchesStorage.get());
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    setLoadingSuggestions(true);
    const id = setTimeout(async () => {
      try {
        const res = await suggestArtists(query);
        setSuggestions(res);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [query]);

  const handleSelectArtist = async (artistId, artistName) => {
    // Save to recent searches
    const artistObj =
      suggestions.find((s) => s.id === artistId) ||
      recent.find((r) => r.id === artistId) || {
        id: artistId,
        name: artistName,
        image: null,
        followers: 0,
      };
    recentSearchesStorage.add(artistObj);
    setRecent(recentSearchesStorage.get());

    // Clear search
    setQuery("");
    setSuggestions([]);

    // ✅ Navigate to artist page
    navigate(`/artist/${artistId}`);
  };

  const handleRemoveRecent = (id) => {
    recentSearchesStorage.remove(id);
    setRecent(recentSearchesStorage.get());
  };

  const handleClearAll = () => {
    recentSearchesStorage.clear();
    setRecent([]);
  };

  return (
    <div>
      <div className="mb-8">
        <SearchBar
          query={query}
          setQuery={setQuery}
          suggestions={suggestions}
          recentSearches={recent}
          loadingSuggestions={loadingSuggestions}
          onSelectArtist={handleSelectArtist}
          onRemoveRecent={handleRemoveRecent}
          onClearAll={handleClearAll}
        />
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Top Albums</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {albums.length ? (
            albums.map((a) => <AlbumCard album={a} key={a.id} />)
          ) : (
            <div className="text-muted">Search an artist to load albums</div>
          )}
        </div>
      </section>
    </div>
  );
}
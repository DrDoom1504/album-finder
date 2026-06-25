import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import AlbumCard from "../components/AlbumCard";
import { useAuth } from "../context/useAuth";
import { suggestArtists, getAlbumsByArtist, searchArtist, saveSearchHistory, loadSearchHistory, deleteSearchHistoryItem, clearSearchHistory } from "../api/spotify";
import { recentSearchesStorage } from "../utils/storage.js";

function normalizeAlbumName(name = "") {
  return name
    .toLowerCase()
    .replace(/deluxe|remaster|expanded|edition|clean|explicit/gi, "")
    .replace(/[()[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function mapHistoryToRecent(history) {
  return history.map((item) => ({
    historyId: item.id,
    id: item.artist_id || item.query || item.id,
    name: item.artist_name || item.query || "Recent search",
    image: item.artist_image || null,
    followers: null,
  }));
}

export default function Home() {
  const auth = useAuth();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const MAX_RECENT_SEARCHES = recentSearchesStorage.MAX_ITEMS;
  const [recent, setRecent] = useState(recentSearchesStorage.get());
  const [albums, setAlbums] = useState([]);
  const [anonymousSearchCount, setAnonymousSearchCount] = useState(
    recentSearchesStorage.getAnonymousSearchCount()
  );
  const navigate = useNavigate(); 

  const uniqueAlbums = useMemo(() => {
    const seen = new Map();
    return albums.reduce((acc, album) => {
      const key = normalizeAlbumName(album.name) + "|" + (album.release_date || "");
      if (!seen.has(key)) {
        seen.set(key, true);
        acc.push(album);
      }
      return acc;
    }, []);
  }, [albums]);

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
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [query]);

  const loadRecentHistory = useCallback(async () => {
    if (!auth?.user) return recentSearchesStorage.get();

    const history = await loadSearchHistory();
    return mapHistoryToRecent(history).slice(0, MAX_RECENT_SEARCHES);
  }, [auth?.user]);

  useEffect(() => {
    if (auth?.user) {
      setAnonymousSearchCount(0);
      recentSearchesStorage.clearAll();

      loadRecentHistory()
        .then((items) => {
          setRecent(items);
        })
        .catch(() => {
          setRecent([]);
        });
    } else {
      setAnonymousSearchCount(recentSearchesStorage.getAnonymousSearchCount());
      setRecent(recentSearchesStorage.get());
    }
  }, [auth?.user, loadRecentHistory]);

  const handleSelectArtist = async (artistId, artistName) => {
    if (!auth?.user && anonymousSearchCount >= 1) {
      navigate("/signup");
      return;
    }

    const artistObj =
      suggestions.find((s) => s.id === artistId) ||
      recent.find((r) => r.id === artistId) || {
        id: artistId,
        name: artistName,
        image: null,
        followers: 0,
      };

    if (auth?.user) {
      await saveSearchHistory({
        artistId: artistObj.id,
        artistName: artistObj.name,
        artistImage: artistObj.image,
        query: artistObj.name,
      });
      setRecent(await loadRecentHistory());
    } else {
      recentSearchesStorage.add(artistObj);
      setRecent(recentSearchesStorage.get());
      const nextCount = recentSearchesStorage.incrementAnonymousSearchCount();
      setAnonymousSearchCount(nextCount);
    }

    setQuery("");
    setSuggestions([]);
    navigate(`/artist/${artistId}`);
  };

  const handleRemoveRecent = async (id) => {
    if (auth?.user) {
      await deleteSearchHistoryItem(id);
      setRecent(await loadRecentHistory());
      return;
    }

    recentSearchesStorage.remove(id);
    setRecent(recentSearchesStorage.get());
  };


  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setError("Enter an artist name to search.");
      return;
    }

    if (!auth?.user && anonymousSearchCount >= 1) {
      navigate("/signup");
      return;
    }

    setError("");
    setSearchLoading(true);

    try {
      const artist = await searchArtist(trimmed);
      const artistObj = {
        id: artist.id,
        name: artist.name,
        image: artist.images?.[0]?.url || null,
        followers: artist.followers?.total || 0,
      };

      if (auth?.user) {
        await saveSearchHistory({
          artistId: artistObj.id,
          artistName: artistObj.name,
          artistImage: artistObj.image,
          query: trimmed,
        });
        setRecent(await loadRecentHistory());
      } else {
        recentSearchesStorage.add(artistObj);
        setRecent(recentSearchesStorage.get());
      }

      const albumsData = await getAlbumsByArtist(artist.id);
      setAlbums(albumsData || []);
      setQuery("");
      setSuggestions([]);

      if (!auth?.user) {
        const nextCount = recentSearchesStorage.incrementAnonymousSearchCount();
        setAnonymousSearchCount(nextCount);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setAlbums([]);
      setError(err?.message || "Search failed. Try a different artist name.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (auth?.user) {
      await clearSearchHistory();
      setRecent([]);
      return;
    }

    recentSearchesStorage.clearAll();
    setRecent([]);
  };

  return (
    <div className="relative overflow-hidden">
      <div className="hero-glow" />
      <div className="hero-glow blue" />
      <div className="hero-glow pink" />

      <section className="relative z-30 mb-10 rounded-[40px] bg-[#0e1118]/80 border border-white/10 p-10 shadow-2xl shadow-black/40 backdrop-blur-3xl">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-3 rounded-full bg-white/5 px-4 py-2 text-sm text-white/70 shadow-sm shadow-cyan-500/10">
                <span className="h-9 w-9 rounded-full bg-spotifyGreen flex items-center justify-center text-black font-bold">AF</span>
                Discover albums with polish
              </div>
              <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
                Search artists, explore discographies,
                <span className="text-spotifyGreen"> and preview tracks instantly.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted">
                Find your favorite artists, browse their albums, and listen to previews in a sleek, modern interface.
              </p>
            </div>

            <div className="w-full max-w-2xl">
              <div className="glass-panel rounded-[32px] border-white/10 p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-spotifyGreen/80 mb-4">Search artists</p>
                <SearchBar
                  query={query}
                  setQuery={setQuery}
                  suggestions={suggestions}
                  recentSearches={recent}
                  loadingSuggestions={loadingSuggestions || searchLoading}
                  onSelectArtist={handleSelectArtist}
                  onRemoveRecent={handleRemoveRecent}
                  onClearAll={handleClearAll}
                  onSearch={handleSearch}
                />
                {error && (
                  <div className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                    {error}
                  </div>
                )}
                <div className="mt-6">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-muted">Recent search</p>
                    {recent.length > 0 ? (
                      <p className="mt-2 text-white font-semibold">{recent[0].name}</p>
                    ) : (
                      <p className="mt-2 text-sm text-muted">Search an artist to save your first recent result here.</p>
                    )}
                  </div>
                  {!auth?.user && anonymousSearchCount > 0 && (
                    <div className="mt-4 rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-100">
                      You can search once anonymously. For more searches, please <button onClick={() => navigate("/signup")} className="font-semibold text-spotifyGreen hover:underline">sign up</button>.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-0 max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="section-title text-white">Trending Now</h2>
            <p className="text-sm text-muted mt-1">Explore the latest albums from your search results.</p>
          </div>
          <div className="text-sm text-muted">Swipe through or click any album.</div>
        </div>

        {uniqueAlbums.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {uniqueAlbums.slice(0, 6).map((a) => <AlbumCard album={a} key={a.id} />)}
          </div>
        ) : (
          <div className="glass-panel rounded-[32px] border border-white/10 p-12 text-center text-muted">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-2xl text-white/70">
              🎧
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Search to discover albums</h3>
            <p className="max-w-xl mx-auto text-sm text-gray-400">
              Type an artist name above to populate this section with top albums and previews.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

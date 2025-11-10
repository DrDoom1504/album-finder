import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [albums, setAlbums] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestion] = useState([]);

  // Fetch artist suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim()) {
        setSuggestion([]);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:5000/api/artist/suggest?query=${encodeURIComponent(query)}`
        );
        setSuggestion(res.data);
      } catch (err) {
        console.log("Error fetching suggestions:", err);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300); // debounce
    return () => clearTimeout(timeoutId);
  }, [query]);

  // When user selects an artist from suggestions
  const handleSelectArtist = async (artistId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/album/search?artistId=${artistId}`
      );
      setAlbums(res.data);
      setSuggestion([]);
      setQuery("");
    } catch (err) {
      console.log("Error fetching albums:", err);
    }
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
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          color: "#1DB954",
          marginBottom: "2rem",
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        🎵 Album Finder
      </h1>

      <div
        style={{
          position: "relative",
          width: "400px",
          margin: "0 auto",
          marginBottom: "2rem",
        }}
      >
        <input
          type="text"
          placeholder="Start typing artist name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: "1rem",
            width: "100%",
            borderRadius: "25px",
            border: "2px solid #e0e0e0",
            fontSize: "1rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
            outline: "none",
          }}
        />

        {/* Artist Suggestions */}
        {suggestions.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: "white",
              border: "none",
              borderRadius: "15px",
              marginTop: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              zIndex: 1000,
              maxHeight: "400px",
              overflowY: "auto",
              padding: "8px 0",
            }}
          >
            {suggestions.map((artist) => (
              <div
                key={artist.id}
                onClick={() => handleSelectArtist(artist.id)}
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid #f0f0f0",
                  backgroundColor: "white",
                }}
              >
                {artist.image && (
                  <img
                    src={artist.image}
                    alt={artist.name}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      marginRight: "8px",
                    }}
                  />
                )}
                <div style={{ textAlign: "left" }}>
                  <div>{artist.name}</div>
                  {artist.followers && (
                    <div style={{ fontSize: "0.8em", color: "#666" }}>
                      {artist.followers.toLocaleString()} followers
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Album Display */}
      <div style={{ marginTop: "2rem" }}>
        {albums.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {albums.map((album) => (
              <div
                key={album.id}
                style={{
                  margin: "16px",
                  padding: "16px",
                  borderRadius: "12px",
                  backgroundColor: "white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                }}
              >
                <img
                  src={album.images[0]?.url}
                  alt={album.name}
                  width="200"
                  height="200"
                  style={{ borderRadius: "8px" }}
                />
                <p
                  style={{
                    fontWeight: "600",
                    fontSize: "1.1rem",
                    margin: "12px 0 4px 0",
                    color: "#222",
                  }}
                >
                  {album.name}
                </p>
                <p
                  style={{
                    color: "#666",
                    fontSize: "0.9rem",
                    margin: "0",
                  }}
                >
                  {new Date(album.release_date).getFullYear()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#777" }}>
            Search for an artist to see their albums...
          </p>
        )}
      </div>
    </div>
  );
}

export default App;

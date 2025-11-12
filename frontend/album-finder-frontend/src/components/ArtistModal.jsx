export const ArtistModal = ({ artist, onViewAlbums, onClose }) => {
  if (!artist) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "40px",
          maxWidth: "500px",
          width: "90%",
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
          animation: "slideUp 0.3s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes slideUp {
            from {
              transform: translateY(50px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}</style>

        {/* Artist Image */}
        {artist.image && (
          <img
            src={artist.image}
            alt={artist.name}
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              margin: "0 auto 20px",
              display: "block",
              objectFit: "cover",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          />
        )}

        {/* Artist Name */}
        <h2 style={{ margin: "0 0 20px 0", color: "#222", fontSize: "2rem" }}>
          {artist.name}
        </h2>

        {/* Followers */}
        {artist.followers && (
          <div
            style={{
              backgroundColor: "#f5f5f5",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            <p style={{ margin: "0", color: "#666", fontSize: "0.9rem" }}>
              👥 Followers
            </p>
            <p
              style={{
                margin: "4px 0 0 0",
                color: "#1DB954",
                fontWeight: "600",
                fontSize: "1.3rem",
              }}
            >
              {artist.followers.toLocaleString()}
            </p>
          </div>
        )}

        {/* Genres */}
        {artist.genres && artist.genres.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <p style={{ margin: "0 0 10px 0", color: "#999", fontSize: "0.9rem" }}>
              🎵 GENRES
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {artist.genres.slice(0, 5).map((genre, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: "#1DB954",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    fontWeight: "500",
                  }}
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
          <button
            onClick={() => onViewAlbums(artist.id)}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "#1DB954",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#1ed760")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#1DB954")
            }
          >
            View Albums
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "#f0f0f0",
              color: "#222",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#e0e0e0")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#f0f0f0")
            }
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

import { useEffect, useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

export const SuggestionsDropdown = ({
  suggestions,
  recentSearches,
  isLoading,
  isOpen,
  query,
  onSelectArtist,
  onRemoveRecent,     
  onClearAll,         
}) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [isOpen, suggestions, recentSearches]);

  const getVisibleItems = () => {
    if (isLoading) return [];
    if (suggestions.length > 0) return suggestions;
    if (!query && recentSearches.length > 0) return recentSearches;
    return [];
  };

  const visibleItems = getVisibleItems();

  if (!isOpen) return null;

  return (
    <>
      {/* Spinner */}
      {isLoading && (
        <div style={dropdownBox()}>
          <LoadingSpinner />
          <p style={{ marginTop: "10px", color: "#666" }}>
            Searching artists...
          </p>
        </div>
      )}

      {/* Suggestions */}
      {!isLoading && suggestions.length > 0 && (
        <div style={dropdownBox()}>
          {suggestions.map((artist) => (
            <SuggestionItem
              key={artist.id}
              artist={artist}
              onSelect={onSelectArtist}
            />
          ))}
        </div>
      )}

      {/* Recent searches */}
      {!query && recentSearches.length > 0 && !isLoading && (
        <div style={dropdownBox()}>
          {/* HEADER + CLEAR ALL */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 16px",
              fontWeight: "600",
              fontSize: "0.85rem",
              color: "#555",
              borderBottom: "1px solid #eee",
            }}
          >
            <span>📋 Recent Searches</span>
            <button
              onClick={onClearAll}
              style={{
                fontSize: "0.75rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#e63946",
              }}
            >
              Clear All
            </button>
          </div>

          {recentSearches.map((artist) => (
            <RecentSearchItem
              key={artist.id}
              artist={artist}
              onSelect={onSelectArtist}
              onRemove={onRemoveRecent} // DELETE BUTTON
            />
          ))}
        </div>
      )}
    </>
  );
};

const dropdownBox = () => ({
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  backgroundColor: "white",
  borderRadius: "15px",
  marginTop: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  zIndex: 1000,
  padding: "8px 0",
  maxHeight: "400px",
  overflowY: "auto",
});

// Suggestion Item UI
const SuggestionItem = ({ artist, onSelect }) => (
  <div
    onClick={() => onSelect(artist.id, artist.name)}
    style={{
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      borderBottom: "1px solid #f0f0f0",
    }}
  >
    {artist.image && (
      <img
        src={artist.image}
        alt="img"
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          marginRight: "10px",
        }}
      />
    )}
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 600 }}>{artist.name}</div>
      <div style={{ fontSize: "0.8em", color: "#777" }}>
        {artist.followers?.toLocaleString()} followers
      </div>
    </div>
  </div>
);

// Recent Search Item UI
const RecentSearchItem = ({ artist, onSelect, onRemove }) => (
  <div
    style={{
      padding: "12px 16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      borderBottom: "1px solid #f0f0f0",
    }}
  >
    <span onClick={() => onSelect(artist.id, artist.name)}>
      🕐 {artist.name}
    </span>

    {/* DELETE BUTTON */}
    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevent opening artist when deleting
        onRemove(artist.id);
      }}
      style={{
        background: "none",
        border: "none",
        color: "#ff4d4d",
        fontSize: "1.2rem",
        cursor: "pointer",
      }}
    >
      ❌
    </button>
  </div>
);

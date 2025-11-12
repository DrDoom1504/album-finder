import { useEffect, useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

export const SuggestionsDropdown = ({
  suggestions,
  recentSearches,
  isLoading,
  isOpen,
  query,
  onSelectArtist,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Reset selection when dropdown opens/closes or items change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [isOpen, suggestions, recentSearches]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      const visibleItems = getVisibleItems();

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < visibleItems.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && visibleItems[selectedIndex]) {
            const item = visibleItems[selectedIndex];
            onSelectArtist(item.id, item.name);
          }
          break;
        case "Escape":
          e.preventDefault();
          // Close dropdown by setting selectedIndex to -1
          setSelectedIndex(-1);
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, suggestions, recentSearches, onSelectArtist]);

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
      {/* Loading Spinner */}
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "white",
            borderRadius: "15px",
            marginTop: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 1000,
            padding: "20px",
            textAlign: "center",
          }}
        >
          <LoadingSpinner />
          <p style={{ margin: "10px 0 0", color: "#666" }}>
            Searching artists...
          </p>
        </div>
      )}

      {/* Artist Suggestions */}
      {suggestions.length > 0 && !isLoading && (
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
          {suggestions.map((artist, index) => (
            <SuggestionItem
              key={artist.id}
              artist={artist}
              isSelected={selectedIndex === index}
              onSelect={onSelectArtist}
            />
          ))}
        </div>
      )}

      {/* Recent Searches */}
      {!query && recentSearches.length > 0 && !isLoading && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "white",
            borderRadius: "15px",
            marginTop: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 1000,
            padding: "12px 0",
          }}
        >
          <div
            style={{
              padding: "8px 16px",
              color: "#999",
              fontSize: "0.85rem",
              fontWeight: "600",
              textAlign: "left",
            }}
          >
            📋 Recent Searches
          </div>
          {recentSearches.map((artist, index) => (
            <RecentSearchItem
              key={artist.id}
              artist={artist}
              isSelected={selectedIndex === index}
              onSelect={onSelectArtist}
            />
          ))}
        </div>
      )}
    </>
  );
};

const SuggestionItem = ({ artist, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(artist.id, artist.name)}
      style={{
        padding: "12px 16px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #f0f0f0",
        backgroundColor: isSelected ? "#e8f5e9" : "white",
        transition: "background-color 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f8f8")}
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = isSelected ? "#e8f5e9" : "white")
      }
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
      <div style={{ textAlign: "left", flex: 1 }}>
        <div style={{ fontWeight: "600" }}>{artist.name}</div>
        {artist.followers && (
          <div style={{ fontSize: "0.8em", color: "#666" }}>
            {artist.followers.toLocaleString()} followers
          </div>
        )}
      </div>
      {isSelected && (
        <span style={{ color: "#1DB954", fontWeight: "600" }}>→</span>
      )}
    </div>
  );
};

const RecentSearchItem = ({ artist, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(artist.id, artist.name)}
      style={{
        padding: "10px 16px",
        cursor: "pointer",
        borderBottom: "1px solid #f0f0f0",
        backgroundColor: isSelected ? "#e8f5e9" : "white",
        transition: "background-color 0.2s",
        textAlign: "left",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f8f8")}
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = isSelected ? "#e8f5e9" : "white")
      }
    >
      <span>🕐 {artist.name}</span>
      {isSelected && (
        <span style={{ color: "#1DB954", fontWeight: "600" }}>→</span>
      )}
    </div>
  );
};

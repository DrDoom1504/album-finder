import { SuggestionsDropdown } from "./SuggestionsDropdown";

export const SearchBar = ({
  query,
  suggestions,
  recentSearches,
  isLoadingSuggestions,
  isDropdownOpen,
  onQueryChange,
  onFocus,
  onSelectArtist,
  onRemoveRecent,
  onClearAll,
}) => {
  return (
    <div
      style={{
        position: "relative",
        width: "400px",
        margin: "0 auto",
        marginBottom: "2rem",
      }}
      data-search-container
    >
      <input
        type="text"
        placeholder="Start typing artist name..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onFocus={onFocus}
        style={{
          padding: "1rem",
          width: "100%",
          borderRadius: "25px",
          border: "2px solid #e0e0e0",
          fontSize: "1rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
          outline: "none",
          boxSizing: "border-box",
        }}
      />

      <SuggestionsDropdown
        suggestions={suggestions}
        recentSearches={recentSearches}
        isLoading={isLoadingSuggestions}
        isOpen={isDropdownOpen}
        query={query}
        onSelectArtist={onSelectArtist}
        onRemoveRecent={onRemoveRecent}
        onClearAll={onClearAll}
      />
    </div>
  );
};

const RecentSearches = ({ recentSearches, onSelect }) => {
  if (!recentSearches.length) return null;

  return (
    <div className="mt-6 w-full max-w-lg">
      <h2 className="text-lg font-semibold mb-2">Recent Searches</h2>
      <div className="flex flex-wrap gap-2">
        {recentSearches.map((artist) => (
          <button
            key={artist.id}
            onClick={() => onSelect(artist.id, artist.name)}
            className="bg-gray-800 hover:bg-green-500 hover:text-black transition px-3 py-1 rounded-md"
          >
            {artist.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
import React, { useState } from "react";
import SuggestionsDropdown from "./SuggestionsDropdown";

export default function SearchBar({
  query,
  setQuery,
  suggestions,
  recentSearches,
  loadingSuggestions,
  onSelectArtist,
  onRemoveRecent,
  onClearAll
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectArtist = (id, name) => {
    onSelectArtist(id, name);
    setIsOpen(false);
  };

  return (
    <div className="max-w-2xl mx-auto relative">
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        placeholder="Search artists e.g. Taylor Swift"
        className="w-full p-4 rounded-full bg-[#0e0e0e] border border-white/10
                   focus:outline-none placeholder:text-muted text-white"
      />

      <SuggestionsDropdown
        isOpen={isOpen}
        query={query}
        suggestions={suggestions}
        recentSearches={recentSearches}
        isLoading={loadingSuggestions}
        onSelectArtist={handleSelectArtist}
        onRemoveRecent={onRemoveRecent}
        onClearAll={onClearAll}
      />
    </div>
  );
}


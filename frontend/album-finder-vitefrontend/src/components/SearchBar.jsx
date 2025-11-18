import React from "react";
import SuggestionsDropdown from "./SuggestionsDropdown";

export default function SearchBar({
  query, setQuery, suggestions, recentSearches, loadingSuggestions,
  onSelectArtist, onRemoveRecent, onClearAll
}){

  return (
    <div className="max-w-2xl mx-auto relative" data-search-container>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search artists e.g. Taylor Swift"
        onFocus={() => {}}
        className="w-full p-4 rounded-full bg-[#0e0e0e] border border-white/6 focus:outline-none placeholder:text-muted text-white"
      />
      <SuggestionsDropdown
        suggestions={suggestions}
        recentSearches={recentSearches}
        isLoading={loadingSuggestions}
        query={query}
        onSelectArtist={onSelectArtist}
        onRemoveRecent={onRemoveRecent}
        onClearAll={onClearAll}
      />
    </div>
  );
}

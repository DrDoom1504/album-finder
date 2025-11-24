import React from "react";

export default function SuggestionsDropdown({
  isOpen,
  query,
  suggestions,
  recentSearches,
  isLoading,
  onSelectArtist,
  onRemoveRecent,
  onClearAll
}) {
  if (!isOpen) return null;

  const showSuggestions = query && query.trim().length > 0;
  const showRecent = !query || (!query.trim() && recentSearches.length > 0);

  return (
    <div
      className="
        absolute left-0 top-full mt-2 w-full 
        bg-[#0c0c0c] border border-white/10 
        rounded-xl shadow-2xl overflow-hidden z-50 
        animate-fadeIn
      "
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* Loading Spinner */}
      {isLoading && (
        <div className="p-4 text-center">
          <div className="inline-block w-6 h-6 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
          <div className="text-sm text-muted mt-2">Searching...</div>
        </div>
      )}

      {/* Suggestions */}
      {!isLoading && showSuggestions && suggestions.length > 0 && (
        <div className="divide-y divide-white/5">
          {suggestions.map((s) => (
            <div
              key={s.id}
              onMouseDown={() => onSelectArtist(s.id, s.name)}
              className="px-4 py-3 hover:bg-white/5 cursor-pointer flex items-center gap-3 transition"
            >
              {s.image ? (
                <img src={s.image} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/10" />
              )}

              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-xs text-muted">{s.followers?.toLocaleString()} followers</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Searches */}
      {!isLoading && showRecent && (
        <div>
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
            <div className="text-sm text-muted">Recent searches</div>
            <button onMouseDown={(e) => {
              e.preventDefault();
              onClearAll();
            }} className="text-xs text-rose-500 hover:text-rose-400">
              Clear all
            </button>
          </div>

          {recentSearches.map((r) => (
            <div
              key={r.id}
              className="px-4 py-3 hover:bg-white/5 flex items-center justify-between transition"
            >
              <div
                className="flex items-center gap-3 cursor-pointer"
                onMouseDown={() => onSelectArtist(r.id, r.name)}
              >
                {r.image ? (
                  <img src={r.image} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/10" />
                )}

                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-muted">{r.followers?.toLocaleString()}</div>
                </div>
              </div>

              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemoveRecent(r.id);
                }}
                className="text-sm text-rose-400"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && showSuggestions && suggestions.length === 0 && (
        <div className="p-4 text-center text-muted text-sm">
          No results found.
        </div>
      )}
    </div>
  );
}
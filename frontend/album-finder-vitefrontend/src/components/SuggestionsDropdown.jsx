import React from "react";
import { Link } from "react-router-dom";

export default function SuggestionsDropdown({
  suggestions, recentSearches, isLoading, isOpen=true, query,
  onSelectArtist, onRemoveRecent, onClearAll
}) {

  const visibleSuggestions = () => {
    if (isLoading) return [];
    if (suggestions?.length) return suggestions;
    if (!query && recentSearches?.length) return recentSearches;
    return [];
  }

  const items = visibleSuggestions();

  if ((!items || items.length === 0) && !isLoading) return null;

  return (
    <div className="absolute w-full mt-3 bg-[#0c0c0c] border border-white/6 rounded-xl overflow-hidden shadow-lg z-30">
      {isLoading && (
        <div className="p-4 text-center">
          <div className="inline-block w-8 h-8 border-4 border-white/10 border-t-spotifyGreen rounded-full animate-spin"></div>
          <div className="text-sm text-muted mt-2">Searching...</div>
        </div>
      )}

      {!isLoading && suggestions?.length > 0 && (
        <div>
          {suggestions.map(s => (
            <div key={s.id} className="px-4 py-3 hover:bg-white/3 flex items-center gap-3 cursor-pointer"
              onClick={() => onSelectArtist(s.id, s.name)}>
              {s.image ? <img src={s.image} className="w-10 h-10 rounded-full object-cover" alt="" /> :
                <div className="w-10 h-10 rounded-full bg-white/6"></div>}
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-xs text-muted">{s.followers?.toLocaleString()} followers</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !suggestions?.length && recentSearches?.length > 0 && (
        <div>
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/6">
            <div className="text-sm text-muted">Recent searches</div>
            <button className="text-xs text-rose-500" onClick={onClearAll}>Clear all</button>
          </div>
          {recentSearches.map(r => (
            <div key={r.id} className="px-4 py-3 hover:bg-white/3 flex items-center justify-between">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectArtist(r.id, r.name)}>
                {r.image ? <img src={r.image} className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-white/6" />}
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-muted">{r.followers?.toLocaleString()}</div>
                </div>
              </div>
              <button onClick={(e)=>{ e.stopPropagation(); onRemoveRecent(r.id); }} className="text-sm text-rose-400">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

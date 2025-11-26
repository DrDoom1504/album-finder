import React from "react";

export default function TopTracksDisplay({ tracks, loading }) {
  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Top Tracks</h2>
        <div className="text-center text-gray-400 py-8">Loading tracks...</div>
      </div>
    );
  }

  if (!tracks || tracks.length === 0) {
    return (
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Top Tracks</h2>
        <div className="text-center text-gray-400 py-8">No tracks found</div>
      </div>
    );
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold mb-6 text-white">Top Tracks</h2>
      <div className="space-y-2">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className="bg-white/5 hover:bg-white/10 p-4 rounded-lg transition cursor-pointer group"
            onClick={() => {
              if (track.externalUrl) {
                window.open(track.externalUrl, "_blank");
              }
            }}
          >
            <div className="flex items-center gap-4">
              {/* Rank */}
              <div className="text-gray-400 font-bold text-lg min-w-8">
                {index + 1}
              </div>

              {/* Album Image */}
              {track.img && (
                <img
                  src={track.img}
                  alt={track.album}
                  className="w-14 h-14 rounded object-cover"
                />
              )}

              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate group-hover:text-green-400 transition">
                  {track.name}
                </div>
                <div className="text-sm text-gray-400 truncate">
                  {track.album}
                </div>
              </div>

              {/* Duration */}
              <div className="text-gray-400 text-sm min-w-12 text-right">
                {formatDuration(track.duration)}
              </div>

              {/* Popularity */}
              <div className="text-right min-w-16">
                <div className="text-sm font-medium text-white">
                  {track.popularity}%
                </div>
                <div className="text-xs text-gray-500">popularity</div>
              </div>

              {/* Play Button on Spotify */}
              {track.externalUrl && (
                <button
                  className="ml-4 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-full text-sm font-bold text-black transition transform hover:scale-105"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(track.externalUrl, "_blank");
                  }}
                >
                  ▶ Play
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
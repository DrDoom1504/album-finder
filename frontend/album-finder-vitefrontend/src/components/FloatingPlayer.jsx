import React, { useState, useRef, useEffect } from "react";

export default function FloatingPlayer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    function handlePlayPreview(e) {
      const { previewUrl, track } = e.detail || {};
      if (!previewUrl) return;
      setCurrentTrack({ previewUrl, track });
    
      if (audioRef.current) {
        audioRef.current.src = previewUrl;
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }

    window.addEventListener("playPreview", handlePlayPreview);
    return () => window.removeEventListener("playPreview", handlePlayPreview);
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    if (currentTrack && currentTrack.previewUrl) {
      audioRef.current.src = currentTrack.previewUrl;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [currentTrack]);

  function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }

  function handleEnded() {
    setIsPlaying(false);
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0b0b0b] to-[#1a1a1a] border-t border-white/10 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
          
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg shadow-lg flex-shrink-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v9.28c-.47-.46-1.13-.75-1.9-.75-1.81 0-3.27 1.46-3.27 3.27s1.46 3.27 3.27 3.27 3.27-1.46 3.27-3.27V9h4v4c0 2.87-2.13 5.25-4.9 5.25s-4.9-2.38-4.9-5.25V3h6z" />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <div className="font-semibold text-white truncate">{currentTrack?.track?.name ?? "No track playing"}</div>
                <div className="text-sm text-gray-400 truncate">{currentTrack?.track?.artists?.map(a => a.name).join(", ") ?? "Play a preview to listen"}</div>
              </div>
            </div>

          
            <div className="flex items-center gap-3 ml-4 flex-shrink-0">

              <button className="p-2 hover:bg-white/10 rounded-full transition" onClick={() => { if (currentTrack?.track?.externalUrl) window.open(currentTrack.track.externalUrl, "_blank"); }}>
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>

              <button onClick={togglePlay} className="bg-green-500 hover:bg-green-600 text-black px-6 py-2 rounded-full font-semibold transition transform hover:scale-105">
                {isPlaying ? "Pause" : "Play"}
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 hover:bg-white/10 rounded-full transition"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 6H3v2h13.5zm0 4H3v2h13.5zM3 16h13.5v-2H3z" />
                </svg>
              </button>
            </div>
          </div>

         
          <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full w-0 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>

      <audio ref={audioRef} onEnded={handleEnded} />

      
      {isExpanded && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl w-full max-w-md p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

           
            <div className="w-full aspect-square bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl mb-6 flex items-center justify-center shadow-2xl">
              <svg className="w-24 h-24 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v9.28c-.47-.46-1.13-.75-1.9-.75-1.81 0-3.27 1.46-3.27 3.27s1.46 3.27 3.27 3.27 3.27-1.46 3.27-3.27V9h4v4c0 2.87-2.13 5.25-4.9 5.25s-4.9-2.38-4.9-5.25V3h6z" />
              </svg>
            </div>

            <div className="text-center mb-6">
              <div className="text-2xl font-bold text-white mb-2">No track playing</div>
              <div className="text-gray-400">Play a preview to listen</div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="h-1 bg-gray-700 rounded-full overflow-hidden mb-2">
                <div className="h-full w-0 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>0:00</span>
                <span>0:00</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
              <button className="p-3 hover:bg-white/10 rounded-full transition">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>

              <button className="bg-green-500 hover:bg-green-600 text-black px-8 py-3 rounded-full font-semibold transition transform hover:scale-105">
                Play
              </button>

              <button className="p-3 hover:bg-white/10 rounded-full transition">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 18l2.29-2.29-4.29-4.29v-6l6 6 4.29-4.29L24 6v12z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
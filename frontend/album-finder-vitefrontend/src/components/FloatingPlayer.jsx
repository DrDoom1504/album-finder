import React from "react";

export default function FloatingPlayer(){
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-3xl p-3 rounded-2xl glass flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 bg-gray-800 rounded overflow-hidden" />
        <div>
          <div className="font-semibold">No track playing</div>
          <div className="text-sm text-muted">Play a preview to listen</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="bg-spotifyGreen text-black px-4 py-2 rounded-full font-semibold">Play</button>
      </div>
    </div>
  );
}

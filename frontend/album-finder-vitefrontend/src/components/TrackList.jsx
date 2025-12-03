import React from "react";
import { useAuth } from "../context/AuthContext";

export default function TrackList({ tracks }){
  const auth = useAuth();
  return (
    <div className="mt-4">
      {tracks.map((t, idx) => (
        <div key={t.id || idx} className="py-2 flex items-center justify-between border-b border-white/6">
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted">{idx + 1}.</div>
            <div>
              <div className="font-medium">{t.name}</div>
              <div className="text-xs text-muted">{t.artists?.map(a=>a.name).join(", ")}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-muted">{Math.floor(t.duration_ms/60000)}:{String(Math.floor((t.duration_ms % 60000)/1000)).padStart(2,"0")}</div>
            {(t.preview_url || t.previewUrl) && (
              <button
                className="ml-2 px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  const previewUrl = t.preview_url || t.previewUrl;
                  window.dispatchEvent(new CustomEvent("playPreview", { detail: { previewUrl, track: t } }));
                }}
              >
                ▷ Preview
              </button>
            )}

            {auth?.isPremium && auth?.deviceId && (
              <button
                className="ml-2 px-3 py-1 bg-green-500 text-black rounded text-xs"
                onClick={async (e) => {
                  e.stopPropagation();
                  await auth.playSpotifyTrack(t.id);
                }}
              >
                ▶ Play
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

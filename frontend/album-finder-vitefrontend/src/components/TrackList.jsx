import React from "react";

export default function TrackList({ tracks }){
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
          <div className="text-xs text-muted">{Math.floor(t.duration_ms/60000)}:{String(Math.floor((t.duration_ms % 60000)/1000)).padStart(2,"0")}</div>
        </div>
      ))}
    </div>
  )
}

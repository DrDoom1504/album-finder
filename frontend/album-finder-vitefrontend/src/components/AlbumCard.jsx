import React from "react";
import { Link } from "react-router-dom";

export default function AlbumCard({ album }){
  return (
    <Link to={`/album/${album.id}`} className="block w-48">
      <div className="rounded-lg overflow-hidden shadow-lg bg-[#0b0b0b]">
        <img src={album.images?.[0]?.url} alt={album.name} className="w-full h-48 object-cover" />
        <div className="p-3">
          <div className="font-semibold text-sm">{album.name}</div>
          <div className="text-xs text-muted mt-1">{album.release_date}</div>
        </div>
      </div>
    </Link>
  )
}

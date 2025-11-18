import React from "react";
import { Link } from "react-router-dom";

export default function ArtistCard({ artist }){
  return (
    <Link to={`/artist/${artist.id}`} className="flex gap-4 items-center p-3 hover:bg-white/3 rounded-lg">
      <img src={artist.images?.[0]?.url || artist.image} alt={artist.name} className="w-20 h-20 rounded-lg object-cover" />
      <div>
        <div className="text-lg font-semibold">{artist.name}</div>
        <div className="text-sm text-muted">{artist.followers?.toLocaleString()} followers</div>
      </div>
    </Link>
  )
}

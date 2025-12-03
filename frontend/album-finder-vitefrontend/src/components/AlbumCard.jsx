import React from "react";
import { Link } from "react-router-dom";

export default function AlbumCard({ album }) {
  const placeholder = `data:image/svg+xml;utf8,${encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'><rect fill='%230b0b0b' width='100%' height='100%'/><text fill='%239ca3af' font-family='Arial, Helvetica, sans-serif' font-size='36' x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'>No Image</text></svg>"
  )}`;
  const imgSrc = album.images?.[0]?.url || placeholder;
  return (
    <Link
      to={`/album/${album.id}`}
      className="group flex flex-col cursor-pointer transition-transform duration-300 hover:scale-105 w-full"
    >
      {/* Album Image Container */}
      <div className="relative w-full aspect-square overflow-hidden rounded-lg mb-4 shadow-lg bg-gray-900">
        <img
          src={imgSrc}
          alt={album.name}
          className="w-full h-full object-cover group-hover:brightness-75 transition duration-300"
        />
        
        {/* Play Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black/30">
          <button className="bg-green-500 hover:bg-green-600 rounded-full p-4 shadow-xl transform">
            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>

      
      <div className="w-full">
       
        <h3 className="font-semibold text-white text-sm leading-tight mb-2 line-clamp-2 group-hover:text-green-400 transition duration-200 break-words">
          {album.name}
        </h3>

        
        <p className="text-xs text-gray-400 mb-1">
          {album.release_date ? new Date(album.release_date).getFullYear() : ""}
        </p>

       
        {album.artists && album.artists.length > 0 && (
          <p className="text-xs text-gray-500 line-clamp-1">
            {album.artists.map((a) => a.name).join(", ")}
          </p>
        )}
      </div>
    </Link>
  );
}
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Header(){
  const auth = useAuth();

  return (
    <header className="py-5 border-b border-white/10 bg-[#060607]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-spotifyGreen to-emerald-700 text-black font-black flex items-center justify-center shadow-lg shadow-emerald-500/15">
            AF
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Album Finder</h1>
            <div className="text-sm text-muted">Discover albums with polish and speed</div>
          </div>
        </Link>
        <nav className="flex flex-wrap items-center gap-3 justify-end">
          {!auth?.user ? (
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/login" className="text-sm px-4 py-2 bg-white/10 hover:bg-white/15 rounded-full transition">Login</Link>
              <Link to="/signup" className="text-sm px-4 py-2 rounded-full bg-spotifyGreen text-black transition hover:bg-emerald-500">Sign up</Link>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-sm text-gray-200 truncate max-w-[120px]">{auth.user.display_name}</div>
              <button onClick={auth.logout} className="text-sm px-4 py-2 bg-white/10 hover:bg-white/15 rounded-full transition">Logout</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

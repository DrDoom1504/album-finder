import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header(){
  const auth = useAuth();

  return (
    <header className="py-4 border-b border-white/6">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-spotifyGreen rounded-full flex items-center justify-center text-black font-bold">AF</div>
          <div>
            <h1 className="text-xl font-bold">Album Finder</h1>
            <div className="text-sm text-muted">Discover albums like a pro</div>
          </div>
        </Link>
        <nav className="flex items-center gap-4">
          <a className="text-sm text-muted hover:text-white transition" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          {!auth?.user ? (
            <button onClick={auth?.login} className="text-sm px-3 py-1 bg-white/5 hover:bg-white/10 rounded">Login</button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-300">{auth.user.display_name}</div>
              {auth.isPremium ? (
                <div className="text-xs px-2 py-1 bg-green-600 text-black rounded">Premium</div>
              ) : (
                <div className="text-xs px-2 py-1 bg-white/5 rounded">Free</div>
              )}
              <button onClick={auth.logout} className="text-sm px-3 py-1 bg-white/5 hover:bg-white/10 rounded">Logout</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

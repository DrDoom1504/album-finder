import React from "react";
import { Link } from "react-router-dom";

export default function Header(){
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
        <nav>
          <a className="text-sm text-muted hover:text-white transition" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </div>
    </header>
  );
}

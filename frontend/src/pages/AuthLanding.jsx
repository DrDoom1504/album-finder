import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function AuthLanding() {
  const auth = useAuth();

  return (
    <div className="min-h-[calc(100vh-96px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0f1219]/95 p-10 shadow-2xl shadow-black/40 text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">Account</h1>
        <p className="mb-8 text-gray-400">Log in or sign up to save your artist search history and keep your session.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <button type="button" onClick={auth.login} className="rounded-full bg-spotifyGreen px-6 py-4 text-base font-semibold text-black transition hover:bg-emerald-500">Login with Spotify</button>
          <Link to="/login" className="rounded-full bg-white/10 px-6 py-4 text-base font-semibold text-white transition hover:bg-white/15">Login</Link>
          <Link to="/signup" className="rounded-full border border-white/10 px-6 py-4 text-base font-semibold text-white transition hover:border-spotifyGreen">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

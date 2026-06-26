import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Signup() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await auth.signupLocal({ email, password, displayName });
    setLoading(false);

    if (!result.ok) {
      setError(result.error || "Signup failed. Please try again.");
      return;
    }

    navigate("/");
  };

  return (
    <div className="min-h-[calc(100vh-96px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0f1219]/95 p-8 shadow-2xl shadow-black/40">
        <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
        <p className="text-sm text-muted mb-6">Signup to save your artist searches and keep your sessions.</p>
        {error && <div className="mb-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm text-gray-300">
            Display name
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              type="text"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none focus:border-spotifyGreen"
            />
          </label>
          <label className="block text-sm text-gray-300">
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none focus:border-spotifyGreen"
            />
          </label>
          <label className="block text-sm text-gray-300">
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none focus:border-spotifyGreen"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-spotifyGreen px-4 py-3 text-sm font-semibold text-black transition hover:bg-emerald-500 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => auth.login()}
          className="mt-4 w-full rounded-full border border-white/10 bg-[#1db954] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#1ed760]"
        >
          Continue with Spotify
        </button>
        <p className="mt-6 text-sm text-gray-400">
          Already have an account? <Link className="text-spotifyGreen hover:underline" to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

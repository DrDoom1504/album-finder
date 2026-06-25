import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ArtistPage from "./pages/ArtistPage";
import ArtistAlbumsPage from "./pages/ArtistAlbumPage";
import AlbumPage from "./pages/AlbumPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthLanding from "./pages/AuthLanding";
import Header from "./components/Header";
import { AuthProvider } from "./context/AuthContext";

export default function App(){
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-b from-[#050607] to-[#0b0b0b]">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-8 pb-32">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthLanding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/artist/:id" element={<ArtistPage />} />
            <Route path="/artist/:id/albums" element={<ArtistAlbumsPage />} />
            <Route path="/album/:id" element={<AlbumPage />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

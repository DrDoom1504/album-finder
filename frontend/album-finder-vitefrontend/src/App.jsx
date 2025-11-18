import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ArtistPage from "./pages/ArtistPage";
import ArtistAlbumsPage from "./pages/ArtistAlbumPage";
import AlbumPage from "./pages/AlbumPage";
import Header from "./components/Header";
import FloatingPlayer from "./components/FloatingPlayer";
import "./App.css";
import "./index.css";

export default function App(){
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050607] to-[#0b0b0b]">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
          <Route path="/artist/:id/albums" element={<ArtistAlbumsPage />} />
          <Route path="/album/:id" element={<AlbumPage />} />
        </Routes>
      </main>
      <FloatingPlayer />
    </div>
  )
}

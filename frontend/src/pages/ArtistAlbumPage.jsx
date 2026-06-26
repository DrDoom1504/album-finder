import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAlbumsByArtist } from "../api/spotify";
import AlbumCard from "../components/AlbumCard";

export default function ArtistAlbumsPage() {
  const { id } = useParams();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlbums() {
      try {
        const data = await getAlbumsByArtist(id);
        setAlbums(data || []);
      } catch (error) {
        console.error("Error loading albums:", error);
      } finally {
        setLoading(false);
      }
    }
    loadAlbums();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400">Loading albums...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to={`/artist/${id}`} className="text-green-500 hover:text-green-400">
          ← Back to artist
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">All Albums</h1>
      {albums.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {albums.map((a) => (
            <AlbumCard key={a.id} album={a} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">No albums found</div>
      )}
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getArtistDetails, getAlbumsByArtist, getArtistTopTracks } from "../api/spotify";
import AlbumCard from "../components/AlbumCard";
import TopTracksDisplay from "../components/TopTracksDisplay";

export default function ArtistPage() {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArtistData() {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [artistData, albumsData, tracksData] = await Promise.all([
          getArtistDetails(id),
          getAlbumsByArtist(id),
          getArtistTopTracks(id)
        ]);

        setArtist(artistData);
        setAlbums(albumsData || []);
        setTopTracks(tracksData || []);
      } catch (error) {
        console.error("Error loading artist data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadArtistData();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400">Loading artist...</div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400">Artist not found</div>
      </div>
    );
  }

  return (
    <div>
      {/* Artist Header */}
      <div className="glass-panel rounded-[32px] border border-white/10 p-6 mb-8">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          <img
            src={artist.images?.[0]?.url}
            alt={artist.name}
            className="w-40 h-40 rounded-3xl object-cover shadow-2xl shadow-black/50"
          />
          <div className="flex-1">
            <h1 className="text-5xl font-bold mb-3 tracking-tight">{artist.name}</h1>
            <div className="text-sm text-muted mb-4">
              {artist.followers?.total?.toLocaleString()} followers
              {artist.genres && artist.genres.length > 0 && (
                <> • {artist.genres.join(", ")}</>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/artist/${id}/albums`}
                className="px-6 py-3 rounded-full bg-spotifyGreen text-black font-semibold hover:bg-emerald-500 transition"
              >
                View All Albums
              </Link>
              <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-muted">Top tracks & albums from Spotify</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Tracks Section */}
      <section className="mb-12">
        <TopTracksDisplay tracks={topTracks} loading={loading} />
      </section>

      {/* Recent Albums Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Recent Albums</h2>
        {albums.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {albums.slice(0, 12).map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">No albums found</div>
        )}
      </section>
    </div>
  );
}

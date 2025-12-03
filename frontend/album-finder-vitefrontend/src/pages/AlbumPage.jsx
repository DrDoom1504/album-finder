import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAlbumDetails } from "../api/spotify";
import TrackList from "../components/TrackList";

export default function AlbumPage() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadAlbum() {
      try {
        setLoading(true);
        const data = await getAlbumDetails(id);
        if (!mounted) return;
        setAlbum(data);
      } catch (err) {
        console.error("Error loading album:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAlbum();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400">Loading album...</div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400">Album not found</div>
      </div>
    );
  }

  return (
    <div className="pb-32">
      <div className="flex gap-6 items-start mb-6">
        <img
          src={album.images?.[0]?.url}
          alt={album.name}
          className="w-56 h-56 object-cover rounded-lg"
        />

        <div>
          <h1 className="text-3xl font-bold mb-2">{album.name}</h1>
          <div className="text-sm text-gray-400 mb-2">
            {album.artists?.map((a, idx) => (
              <span key={a.id}>
                <Link to={`/artist/${a.id}`} className="text-green-400 hover:underline">
                  {a.name}
                </Link>
                {idx < album.artists.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
          <div className="text-muted mt-2">Released: {album.release_date}</div>
          <div className="mt-4 text-muted">{album.total_tracks} tracks</div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Tracklist</h2>
        <TrackList tracks={album.tracks?.items || []} />
      </div>
    </div>
  );
}
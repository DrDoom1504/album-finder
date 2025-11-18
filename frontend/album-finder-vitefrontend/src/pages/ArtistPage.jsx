import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getArtistDetails, getArtistTopTracks, getAlbumsByArtist } from "../api/spotify";
import AlbumCard from "../components/AlbumCard";
import TrackList from "../components/TrackList";

export default function ArtistPage(){
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);

  useEffect(()=> {
    async function load(){
      setArtist(await getArtistDetails(id));
      setTopTracks(await getArtistTopTracks(id));
      setAlbums(await getAlbumsByArtist(id));
    }
    load();
  },[id]);

  if (!artist) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center gap-6 mb-6">
        <img src={artist.images?.[0]?.url} alt={artist.name} className="w-36 h-36 rounded-lg object-cover" />
        <div>
          <h1 className="text-3xl font-bold">{artist.name}</h1>
          <div className="text-sm text-muted">{artist.followers?.total?.toLocaleString()} followers • {artist.genres?.join(", ")}</div>
          <div className="mt-4 flex gap-3">
            <Link to={`/artist/${id}/albums`} className="px-4 py-2 rounded-full bg-spotifyGreen text-black font-semibold">View All Albums</Link>
          </div>
        </div>
      </div>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Top Tracks</h2>
        <TrackList tracks={topTracks} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Recent Albums</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {albums.slice(0,8).map(a => <AlbumCard album={a} key={a.id} />)}
        </div>
      </section>
    </div>
  )
}

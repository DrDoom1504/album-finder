import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAlbumDetails } from "../api/spotify";
import TrackList from "../components/TrackList";

export default function AlbumPage(){
  const { id } = useParams();
  const [album, setAlbum] = useState(null);

  useEffect(()=> {
    getAlbumDetails(id).then(setAlbum);
  },[id]);

  if (!album) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex gap-6 items-start mb-6">
        <img src={album.images?.[0]?.url} className="w-56 h-56 object-cover rounded-lg" alt={album.name} />
        <div>
          <h1 className="text-3xl font-bold">{album.name}</h1>
          <div className="text-muted mt-2">Released: {album.release_date}</div>
          <div className="mt-4 text-muted">{album.total_tracks} tracks</div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Tracklist</h2>
        <TrackList tracks={album.tracks.items} />
      </div>
    </div>
  )
}

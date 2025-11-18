import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAlbumsByArtist } from "../api/spotify";
import AlbumCard from "../components/AlbumCard";

export default function ArtistAlbumsPage(){
  const { id } = useParams();
  const [albums, setAlbums] = useState([]);

  useEffect(()=> {
    getAlbumsByArtist(id).then(setAlbums);
  },[id]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All albums</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {albums.map(a => <AlbumCard key={a.id} album={a} />)}
      </div>
    </div>
  )
}

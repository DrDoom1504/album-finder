import { useState,useEffect } from "react";
import React  from "react";


function App() {

  const[albums , setAlbum] = useState([]);

  useEffect(()=>{
    axios.get('http://localhost:5000/api/albums?artist=Arijit%20Singh')
    .then(res => setAlbums(res.data.albums))
    .catch(err => console.log(err));
  });
  return (
   <div className="App">
    <h1>Album Finder</h1>
     <ul>
        {albums.map(album => (
          <li key={album.id}>{album.name}</li>
        ))}
      </ul>
   </div>
  )
}

export default App;

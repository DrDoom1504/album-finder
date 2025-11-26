import axios from "axios";
import { getAccessToken } from "../utils/getAccessToken.js";

export async function getArtist(artistName) {
    const token = await getAccessToken();
    if (!token) throw new Error("Failed to get access token");
    
    try {
        const res = await axios.get(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=10`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        
        if (!res.data.artists.items.length) {
            throw new Error(`Artist "${artistName}" not found`);
        }

        
        const searchQuery = artistName.toLowerCase().trim();
        
        
        let bestMatch = res.data.artists.items.find(
            artist => artist.name.toLowerCase() === searchQuery
        );
        
        
        if (!bestMatch) {
            bestMatch = res.data.artists.items.reduce((closest, current) => {
                return current.popularity > closest.popularity ? current : closest;
            });
        }
        
        return bestMatch;
    } catch (error) {
        console.error("Error fetching artist:", error.message);
        throw error;
    }
}


export async function getArtistById(artistId) {
    const token = await getAccessToken();
    if (!token) throw new Error("Failed to get access token");
    
    try {
        const res = await axios.get(
            `https://api.spotify.com/v1/artists/${artistId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        
        if (!res.data) {
            throw new Error(`Artist with ID "${artistId}" not found`);
        }
        
        return res.data;
    } catch (error) {
        console.error("Error fetching artist by ID:", error.message);
        throw error;
    }
}

export async function getAlbum(artistId) {
    const token = await getAccessToken();
    if (!token) throw new Error("Failed to get access token");

    try {
        const res = await axios.get(
            `https://api.spotify.com/v1/artists/${artistId}/albums?limit=50&include_groups=album`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (!res.data.items || res.data.items.length === 0) {
            return [];
        }

        res.data.items.sort((a, b) => {
            const dateA = new Date(a.release_date);
            const dateB = new Date(b.release_date);
            return dateB - dateA;
        });

        const unique = {};
        res.data.items.forEach(album => {
            const cleanedName = album.name
                .toLowerCase()
                .replace(/deluxe|remaster|expanded|edition|clean|explicit/gi, "")
                .replace(/[\(\[\]\)]/g, "")
                .replace(/\s+/g, " ")
                .trim();

            if (!unique[cleanedName]) {
                unique[cleanedName] = album;
            }
        });

        const cleanedAlbums = Object.values(unique);
        return cleanedAlbums.slice(0, 5);

    } catch (error) {
        console.error("Error fetching albums:", error.message);
        throw error;
    }
}

export async function getSuggestion(query) {
    const token = await getAccessToken();
    if (!token) throw new Error("Failed to get access token");
    
    try {
        const response = await axios.get(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=5`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        
        return response.data.artists.items.map(artist => ({
            name: artist.name,
            id: artist.id,
            image: artist.images?.[0]?.url || null,
            followers: artist.followers?.total,
            genres: artist.genres,
        }));
    } catch (error) {
        console.error("Error fetching suggestions:", error.message);
        throw error;
    }
}

export async function getTopTracks(artistId) {
    const token = await getAccessToken();
    if (!token) throw new Error("Failed to get access token");

    try {
        console.log("Fetching top tracks for artist:", artistId);
        
        const response = await axios.get(
            `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        console.log("Response status:", response.status);
        console.log("Tracks count:", response.data.tracks?.length);

        if (!response.data.tracks || response.data.tracks.length === 0) {
            console.log("No tracks found");
            return [];
        }

        const mappedTracks = response.data.tracks.slice(0, 10).map(track => ({
            id: track.id,
            name: track.name,
            album: track.album?.name || "Unknown Album",
            img: track.album?.images?.[0]?.url || null,
            duration: Math.floor(track.duration_ms / 1000),
            popularity: track.popularity,
            previewUrl: track.preview_url,
            externalUrl: track.external_urls?.spotify,
        }));


        return mappedTracks;

    } catch (err) {
        console.error("Error fetching top tracks:", err.message);
        throw err;
    }
}
import axios from "axios";
import { getAccessToken } from "../utils/getAccessToken.js";

export async function getArtist(artistName) {
    const token = await getAccessToken();
    if (!token) throw new Error("Failed to get access token");
    
    try {
        const res = await axios.get(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        
        if (!res.data.artists.items.length) {
            throw new Error(`Artist "${artistName}" not found`);
        }
        return res.data.artists.items[0];
    } catch (error) {
        console.error("Error fetching artist:", error.message);
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
                .replace(/deluxe|remaster|expanded|edition|clean|explicit/g, "")
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
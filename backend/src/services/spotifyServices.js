import axios, { all } from "axios";
import { getAccessToken } from "../utils/getAccessToken.js";

export async function getArtist(artistName) {
    const token = await getAccessToken();
    try {
        const res = await axios.get(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }
        );
        return res.data.artists.items[0];
    } catch (error) {
        console.error("Error fetching artist:", error.message);
        throw error;
    }
}

export async function getAlbum(artistId) {
    const token = await getAccessToken();

    try {
        const res = await axios.get(
            `https://api.spotify.com/v1/artists/${artistId}/albums?limit=50&include_groups=album`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        // Remove duplicates (clean album names)
        const unique = {};
        res.data.items.forEach(album => {
            const cleanedName = album.name
                .toLowerCase()
                .replace(/deluxe|remaster|expanded|edition|clean|explicit/g, "")
                .trim();

            if (!unique[cleanedName]) {
                unique[cleanedName] = album;
            }
        });

        const cleanedAlbums = Object.values(unique);

       
        cleanedAlbums.sort((a, b) => 
            new Date(b.release_date) - new Date(a.release_date)
        );

        // Return top 5 most recent albums
        return cleanedAlbums.slice(0, 5);

    } catch (error) {
        console.error("Error fetching albums:", error.message);
        throw error;
    }
}

export async function getSuggestion(query) {
    const token = await getAccessToken();
    try {
        const response = await axios.get(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=5`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data.artists.items.map(artist => ({
            name: artist.name,
            id: artist.id,
            image: artist.images?.[0]?.url || null,
            followers: artist.followers?.total,
            genres: artist.genres,
        }));
    } catch (err) {
        console.error("Error fetching suggestions:", err.message);
        throw err;
    }
}


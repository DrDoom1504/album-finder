import axios from "axios";
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
            `https://api.spotify.com/v1/artists/${artistId}/albums?limit=5`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }
        );
        return res.data.items;
    } catch (error) {
        console.error("Error fetching albums:", error.message);
        throw error;
    }
};


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


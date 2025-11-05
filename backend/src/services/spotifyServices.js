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
}


import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

let accessToken = "";
let tokenExpirationTime = 0;

export async function getAccessToken() {
    const now = Date.now();

    // Refresh token if expired
    if (now >= tokenExpirationTime - 60000) {
        try {
            const response = await axios.post(
                "https://accounts.spotify.com/api/token",
                new URLSearchParams({
                    grant_type: "client_credentials",
                }),
                {
                    headers: {
                        Authorization:
                            "Basic " +
                            Buffer.from(
                                process.env.SPOTIFY_CLIENT_ID +
                                ":" +
                                process.env.SPOTIFY_CLIENT_SECRET
                            ).toString("base64"),
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            accessToken = response.data.access_token;
            tokenExpirationTime = now + response.data.expires_in * 1000;

            console.log("🎧 New Spotify Access Token Generated");
        } catch (err) {
            console.error("❌ Error fetching token:", err.message);
            throw err;
        }
    }

    return accessToken;
}

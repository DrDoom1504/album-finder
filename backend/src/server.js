import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";

import albumRoutes from "./routes/albumRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";

import { getAccessToken } from "./utils/getAccessToken.js";
import { initDb } from "./db.js";

console.log("[env] SPOTIFY_REDIRECT_URI=", process.env.SPOTIFY_REDIRECT_URI);

const app = express();
const frontendUrl = process.env.FRONTEND_URL || "http://127.0.0.1:5173";

app.use(cors({
  origin: "http://127.0.0.1:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(cookieParser());

app.use(express.json());


// ROUTES
app.use("/api/artist", artistRoutes);
app.use("/api/album", albumRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);

await initDb();
await getAccessToken();

setInterval(getAccessToken, 55 * 60 * 1000);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Server started on port ${port}`));

import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import albumRoutes from "./routes/albumRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";

import { getAccessToken } from "./utils/getAccessToken.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",  // Vite frontend
    methods: ["GET"],
  })
);

app.use(express.json());

// ROUTES
app.use("/api/artist", artistRoutes);
app.use("/api/album", albumRoutes);

// Fetch token once at startup
await getAccessToken();

// Refresh token every 55 minutes
setInterval(getAccessToken, 55 * 60 * 1000);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Server started on port ${port}`));

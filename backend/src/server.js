import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";

import albumRoutes from "./routes/albumRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import { getAccessToken } from "./utils/getAccessToken.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",  // Vite frontend
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());


// ROUTES
app.use("/api/artist", artistRoutes);
app.use("/api/album", albumRoutes);
app.use("/api/auth", authRoutes);


await getAccessToken();


setInterval(getAccessToken, 55 * 60 * 1000);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Server started on port ${port}`));

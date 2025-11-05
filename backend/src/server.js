import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import albumRoutes from "./routes/albumRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";
import { getAccessToken } from "./utils/getAccessToken.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/album", albumRoutes);
app.use("/api/artist", artistRoutes);

// fetch token once and refresh periodically
await getAccessToken();
setInterval(getAccessToken, 55 * 60 * 1000);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;
const useSsl = process.env.DATABASE_SSL === "true";

if (!connectionString) {
  throw new Error("DATABASE_URL is required in .env for PostgreSQL");
}

export const pool = new Pool({
  connectionString,
  ssl: useSsl
    ? {
        rejectUnauthorized: false,
      }
    : false,
});

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      spotify_id TEXT UNIQUE,
      display_name TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    ALTER TABLE IF EXISTS users ALTER COLUMN password_hash DROP NOT NULL;
    ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS spotify_id TEXT;
    CREATE UNIQUE INDEX IF NOT EXISTS idx_users_spotify_id ON users (spotify_id);

    CREATE TABLE IF NOT EXISTS sessions (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      expires_at TIMESTAMPTZ NOT NULL
    );

    CREATE TABLE IF NOT EXISTS search_history (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      artist_id TEXT,
      artist_name TEXT,
      artist_image TEXT,
      query TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    ALTER TABLE IF EXISTS search_history ADD COLUMN IF NOT EXISTS artist_image TEXT;
  `);
}

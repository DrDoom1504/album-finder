# Album Finder

A full-stack Spotify-powered album discovery project with React + Vite frontend and Node.js + Express backend.

## Repository structure

- `backend/` - Express API server, PostgreSQL persistence, Spotify auth, search history storage
- `frontend/album-finder-vitefrontend/` - React app built with Vite, search UI, album/artist pages, auth flow
- `.env.example` - example environment variables for deployment

## Prerequisites

- Node.js 20+ or compatible
- npm
- PostgreSQL database
- Spotify Developer account for client credentials

## Environment variables

Create a `.env` file at the repo root or set environment variables in your deployment platform. Use `.env.example` as a template.

Required values:

- `DATABASE_URL` - PostgreSQL connection string
- `DATABASE_SSL` - `true` or `false`
- `DATABASE_SSL_REJECT_UNAUTHORIZED` - `true` or `false`
- `SPOTIFY_CLIENT_ID` - Spotify application client ID
- `SPOTIFY_CLIENT_SECRET` - Spotify application client secret
- `SPOTIFY_REDIRECT_URI` - backend redirect URI for Spotify auth
- `FRONTEND_URL` - deployed frontend origin for redirect and CORS
- `COOKIE_SECURE` - `true` in production HTTPS
- `COOKIE_SAME_SITE` - `lax` recommended
- `TRUST_PROXY` - `true` when behind a reverse proxy/load balancer

Frontend-specific variable:

- `VITE_API_URL` - full backend URL used by the frontend in production

## Local development

1. Install dependencies

```bash
cd c:\demo-project\album-finder
npm install
npm install --prefix backend
npm install --prefix frontend/album-finder-vitefrontend
```

2. Start backend and frontend together

```bash
npm start
```

This runs both backend and frontend concurrently.

### Backend only

```bash
cd backend
npm start
```

### Frontend only

```bash
cd frontend/album-finder-vitefrontend
npm run dev
```

## Deployment notes

- Build the frontend with `npm run build` inside `frontend/album-finder-vitefrontend`
- Deploy the backend as a Node/Express service
- Set `VITE_API_URL` in frontend deployment to your backend server URL
- Set `FRONTEND_URL` in backend deployment to your frontend origin for CORS and redirect handling
- Use `COOKIE_SECURE=true` for production over HTTPS
- Use proper PostgreSQL SSL and enable `DATABASE_SSL_REJECT_UNAUTHORIZED=true` if your provider supports a trusted certificate

## Security notes

- No tracked `.env` files were found in the repository
- Keep any sensitive values out of Git
- Use HTTPS and secure cookies in production
- Avoid `DATABASE_SSL_REJECT_UNAUTHORIZED=false` in a production environment if possible

## Useful commands

```bash
# Run both backend and frontend
npm start

# Run backend only
cd backend && npm start

# Run frontend only
cd frontend/album-finder-vitefrontend && npm run dev
```

## Additional resources

- Frontend README is available at `frontend/album-finder-vitefrontend/README.md`
- Use `.env.example` as your deployment template

# CLAUDE.md — Project Context for Claude Code

## Project Summary

A full-stack music discovery and streaming web app. Node.js + Express backend, SQLite database, and a vanilla JS single-page frontend. Serves 6 songs with play/pause, seek, volume, genre filtering, search, and a trending chart.

## Architecture

| Layer        | Location                     | Notes                                              |
|--------------|------------------------------|----------------------------------------------------|
| Server       | `server/index.js`            | Express app; auto-seeds DB on first run            |
| Database     | `server/db.js`               | better-sqlite3; WAL mode; single `songs` table     |
| Seed         | `server/seed.js`             | Exports `seedDatabase()`; safe to re-run           |
| API routes   | `server/routes/songs.js`     | GET /api/songs, GET /api/songs/:id, POST /:id/play |
|              | `server/routes/genres.js`    | GET /api/genres                                    |
| HTML         | `public/index.html`          | Single page: header, hero, catalog, footer, player |
| Styles       | `public/css/app.css`         | CSS custom properties; dark theme; responsive      |
| JS entry     | `public/js/app.js`           | ES module; imports catalog, trending, hero         |
| Player       | `public/js/player.js`        | Bottom bar; queue; seek/volume; exports setQueue, playDirect |
| Catalog      | `public/js/catalog.js`       | Song grid; genre tabs; debounced search            |
| Trending     | `public/js/trending.js`      | Top-5 by play_count                                |
| Hero         | `public/js/hero.js`          | Wires hero icon to #audio-engine; MutationObserver syncs meta label |
| API client   | `public/js/api.js`           | fetch() wrappers for all endpoints                 |
| Audio files  | `uploads/audio/`             | MP3s served at /audio/:filename                    |
| Static assets| `resources/`                 | Original images and media (legacy)                 |

## Key Implementation Details

- **Single audio engine** — `#audio-engine` is the only `<audio>` element. Both the hero icon and the bottom player button drive it via `player.js`.
- **Hero sync** — `hero.js` uses a `MutationObserver` on `#player-title` / `#player-artist` to keep the hero meta label up to date.
- **Auto-seed** — `server/index.js` calls `seedDatabase()` at startup if `songs` table is empty. Safe for fresh Render/Railway deployments.
- **Play count** — incremented via `POST /api/songs/:id/play` after 15 seconds of continuous playback.
- **Genre tabs** — populated dynamically from `GET /api/genres`; clicking re-fetches the song grid.

## API Endpoints

| Method | Path                    | Description                        |
|--------|-------------------------|------------------------------------|
| GET    | /api/songs              | List songs; ?search=, ?genre=, ?sort=trending |
| GET    | /api/songs/:id          | Single song                        |
| POST   | /api/songs/:id/play     | Increment play_count               |
| GET    | /api/genres             | All distinct genres                |

## Conventions

- No JS framework — vanilla ES modules only.
- No CSS preprocessor — edit `public/css/app.css` directly.
- Dark theme via CSS custom properties in `:root`.
- New songs: add MP3 to `uploads/audio/`, add entry to `server/seed.js`, run `node server/seed.js`.
- Author: TanQHoang

## How to Run

```bash
npm install
npm run dev      # nodemon hot-reload
# or
npm start        # production
```

Open http://localhost:3000

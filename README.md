# MusicApp — The Real Sound

A full-stack music discovery and streaming web app built with Node.js, Express, SQLite, and vanilla JavaScript.

**GitHub:** https://github.com/tanhoang0803/simple-music-app
**Live URL:** https://simple-music-app.onrender.com *(deploy via Render — see below)*

---

## Features

- **Hero section** — full-viewport background with "THE REAL SOUND" heading and a featured play/pause button
- **Trending Now** — top 5 songs ranked by play count, updates in real time
- **Song catalog** — responsive grid with genre filter tabs and debounced search
- **Persistent player bar** — fixed bottom bar with cover art, title/artist, previous/play-pause/next, seek bar, and volume slider
- **Unified audio engine** — hero icon and player bar both control the same audio element; always in sync
- **Play count tracking** — incremented after 15 seconds of continuous playback
- **Auto-seed** — database is seeded automatically on first start (fresh deployment friendly)

## Tech Stack

| Layer    | Technology                         |
|----------|------------------------------------|
| Runtime  | Node.js 20                         |
| Server   | Express 4                          |
| Database | SQLite via better-sqlite3          |
| Frontend | Vanilla JS (ES Modules), CSS3      |
| Deploy   | Render (render.yaml included)      |
| CI       | GitHub Actions                     |

## File Structure

```
├── public/
│   ├── index.html          # Single-page app (hero + catalog + player)
│   ├── css/app.css         # Dark theme; CSS custom properties
│   ├── images/             # Logo, play/pause icons, default cover, background
│   └── js/
│       ├── app.js          # Entry point
│       ├── player.js       # Bottom player bar + queue logic
│       ├── catalog.js      # Song grid, genre tabs, search
│       ├── trending.js     # Top-5 trending list
│       ├── hero.js         # Hero icon ↔ audio engine bridge
│       └── api.js          # fetch() wrappers
├── server/
│   ├── index.js            # Express app + auto-seed on startup
│   ├── db.js               # SQLite connection + schema
│   ├── seed.js             # Seed data (exports seedDatabase())
│   └── routes/
│       ├── songs.js        # GET/POST /api/songs
│       └── genres.js       # GET /api/genres
├── uploads/
│   └── audio/              # MP3 files served at /audio/:filename
├── resources/              # Original static assets (legacy)
├── data/                   # SQLite DB lives here (gitignored)
├── render.yaml             # Render deployment config
└── .github/workflows/
    └── ci.yml              # GitHub Actions CI
```

## How to Run Locally

```bash
# Install dependencies
npm install

# Start with hot-reload
npm run dev

# Or production mode
npm start
```

Open **http://localhost:3000**

## Adding Songs

1. Drop the MP3 file into `uploads/audio/`
2. Add an entry to `server/seed.js` (match the exact filename)
3. Run `node server/seed.js` to re-seed

## Deploy to Render

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo — Render detects `render.yaml` automatically
4. Click **Deploy** — the app will be live at `https://simple-music-app.onrender.com`

> **Note:** Render's free tier has an ephemeral filesystem. The SQLite DB is re-seeded automatically on each startup via the auto-seed logic in `server/index.js`. Audio files committed to `uploads/audio/` are served from the deployed instance.

---

**Created by TanQHoang** &nbsp;·&nbsp; &copy; 2024

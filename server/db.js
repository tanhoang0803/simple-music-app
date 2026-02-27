const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'music.db');

const db = new Database(DB_PATH);

// Performance settings
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create songs table
db.exec(`
  CREATE TABLE IF NOT EXISTS songs (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    artist      TEXT    NOT NULL,
    genre       TEXT    NOT NULL,
    duration    INTEGER NOT NULL DEFAULT 0,
    filename    TEXT    NOT NULL,
    cover_url   TEXT,
    play_count  INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_songs_genre      ON songs(genre);
  CREATE INDEX IF NOT EXISTS idx_songs_play_count ON songs(play_count DESC);
`);

module.exports = db;

const express = require('express');
const path    = require('path');
const db      = require('./db');

// Auto-seed if the database has no songs (fresh deploy)
const { seedDatabase } = require('./seed');
if (db.prepare('SELECT COUNT(*) as n FROM songs').get().n === 0) {
  seedDatabase();
}

const app  = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// Static: SPA
app.use(express.static(path.join(__dirname, '..', 'public')));

// Static: audio files
app.use('/audio', express.static(path.join(__dirname, '..', 'uploads', 'audio')));

// Static: cover art
app.use('/covers', express.static(path.join(__dirname, '..', 'uploads', 'covers')));

// API routes
app.use('/api/songs',  require('./routes/songs'));
app.use('/api/genres', require('./routes/genres'));

// SPA fallback — serve index.html for any unmatched GET
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Music app listening at http://localhost:${PORT}`);
});

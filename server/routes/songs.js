const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/songs
// Query params: ?search=, ?genre=, ?sort=trending
router.get('/', (req, res) => {
  const { search, genre, sort } = req.query;

  let query  = 'SELECT * FROM songs WHERE 1=1';
  const params = [];

  if (search) {
    query += ' AND (title LIKE ? OR artist LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (genre) {
    query += ' AND genre = ?';
    params.push(genre);
  }

  if (sort === 'trending') {
    query += ' ORDER BY play_count DESC';
  } else {
    query += ' ORDER BY id ASC';
  }

  const songs = db.prepare(query).all(...params);
  res.json(songs);
});

// GET /api/songs/:id
router.get('/:id', (req, res) => {
  const song = db.prepare('SELECT * FROM songs WHERE id = ?').get(req.params.id);
  if (!song) return res.status(404).json({ error: 'Song not found' });
  res.json(song);
});

// POST /api/songs/:id/play  — increment play_count
router.post('/:id/play', (req, res) => {
  const info = db.prepare('UPDATE songs SET play_count = play_count + 1 WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Song not found' });
  const song = db.prepare('SELECT play_count FROM songs WHERE id = ?').get(req.params.id);
  res.json({ play_count: song.play_count });
});

module.exports = router;

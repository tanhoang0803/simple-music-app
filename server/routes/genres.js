const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/genres
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT DISTINCT genre FROM songs ORDER BY genre ASC').all();
  res.json(rows.map(r => r.genre));
});

module.exports = router;

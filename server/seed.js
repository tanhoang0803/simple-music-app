const db = require('./db');

const songs = [
  {
    title:     'HEARTBREAK ANNIVERSARY',
    artist:    'Giveon',
    genre:     'R&B',
    duration:  218,
    filename:  'giveon-heartbreak.mp3',
    cover_url: null
  },
  {
    title:     'Blinding Lights',
    artist:    'The Weeknd',
    genre:     'Pop',
    duration:  200,
    filename:  'The Weeknd - Blinding Lights (Official Audio).mp3',
    cover_url: null
  },
  {
    title:     'HUMBLE.',
    artist:    'Kendrick Lamar',
    genre:     'Hip-Hop',
    duration:  177,
    filename:  'Kendrik Lamar - Humble.mp3',
    cover_url: null
  },
  {
    title:     'bad guy',
    artist:    'Billie Eilish',
    genre:     'Pop',
    duration:  194,
    filename:  'Billie Eilish - bad guy (Audio).mp3',
    cover_url: null
  },
  {
    title:     'Circles',
    artist:    'Post Malone',
    genre:     'Pop',
    duration:  215,
    filename:  'Post Malone - Circles (Clean - Lyrics).mp3',
    cover_url: null
  },
  {
    title:     'Rockstar',
    artist:    'Post Malone ft. 21 Savage',
    genre:     'Hip-Hop',
    duration:  218,
    filename:  'Rockstar (feat. 21 Savage) - Post Malone.mp3',
    cover_url: null
  }
];

function seedDatabase() {
  db.exec(`DELETE FROM songs`);
  db.exec(`DELETE FROM sqlite_sequence WHERE name='songs'`);

  const insert = db.prepare(`
    INSERT INTO songs (title, artist, genre, duration, filename, cover_url)
    VALUES (@title, @artist, @genre, @duration, @filename, @cover_url)
  `);

  const insertMany = db.transaction((rows) => {
    for (const row of rows) insert.run(row);
  });

  insertMany(songs);
  console.log(`Seeded ${songs.length} songs`);
}

module.exports = { seedDatabase };

// Run directly: node server/seed.js
if (require.main === module) {
  seedDatabase();
  process.exit(0);
}

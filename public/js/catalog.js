/**
 * catalog.js — Song grid, search (debounced), genre filter
 */
import { fetchSongs, fetchGenres } from './api.js';
import { setQueue }                from './player.js';

const grid       = document.getElementById('song-grid');
const genreTabs  = document.getElementById('genre-tabs');
const searchInput = document.getElementById('search-input');

let activeGenre  = '';
let activeSearch = '';
let currentSongs = [];   // last rendered list (for queue)

// ─── Render helpers ──────────────────────────────────────────────────────────
function coverSrc(song) {
  if (song.cover_url) return song.cover_url;
  return '/images/default-cover.png';
}

function renderGrid(songs) {
  currentSongs = songs;

  if (!songs.length) {
    grid.innerHTML = '<p class="empty-text">No songs found.</p>';
    return;
  }

  grid.innerHTML = songs.map((song, i) => `
    <div class="song-card" data-index="${i}" role="button" tabindex="0" aria-label="Play ${song.title}">
      <div class="song-card-cover-wrap">
        <img
          class="song-card-cover"
          src="${coverSrc(song)}"
          alt="${song.title} cover"
          onerror="this.src='/images/default-cover.png'"
        />
        <div class="song-card-play">&#9654;</div>
      </div>
      <div class="song-card-body">
        <div class="song-card-title">${song.title}</div>
        <div class="song-card-artist">${song.artist}</div>
        <div class="song-card-footer">
          <span class="genre-badge">${song.genre}</span>
          <span class="play-count">&#9654; ${song.play_count.toLocaleString()}</span>
        </div>
      </div>
    </div>
  `).join('');

  // Attach click handlers
  grid.querySelectorAll('.song-card').forEach(card => {
    const handler = () => {
      const idx = parseInt(card.dataset.index, 10);
      setQueue(currentSongs, idx);
    };
    card.addEventListener('click', handler);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
    });
  });
}

function renderGenreTabs(genres) {
  const allTab = `<button class="genre-tab active" data-genre="">All</button>`;
  const tabs   = genres.map(g =>
    `<button class="genre-tab" data-genre="${g}">${g}</button>`
  ).join('');
  genreTabs.innerHTML = allTab + tabs;

  genreTabs.querySelectorAll('.genre-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      genreTabs.querySelectorAll('.genre-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeGenre = tab.dataset.genre;
      loadSongs();
    });
  });
}

// ─── Load songs from API ─────────────────────────────────────────────────────
async function loadSongs() {
  grid.innerHTML = '<p class="loading-text">Loading…</p>';
  try {
    const songs = await fetchSongs({ search: activeSearch, genre: activeGenre });
    renderGrid(songs);
  } catch (err) {
    grid.innerHTML = `<p class="empty-text">Error loading songs.</p>`;
    console.error(err);
  }
}

// ─── Search — 300ms debounce ─────────────────────────────────────────────────
let debounceTimer = null;
searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    activeSearch = searchInput.value.trim();
    loadSongs();
  }, 300);
});

// ─── Init ────────────────────────────────────────────────────────────────────
export async function initCatalog() {
  // Fetch songs and genres in parallel
  const [songs, genres] = await Promise.all([
    fetchSongs(),
    fetchGenres()
  ]);
  renderGenreTabs(genres);
  renderGrid(songs);
  currentSongs = songs;
}

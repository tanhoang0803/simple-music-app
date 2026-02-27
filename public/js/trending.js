/**
 * trending.js — Top-5 songs by play_count
 */
import { fetchSongs } from './api.js';
import { setQueue }   from './player.js';

const list = document.getElementById('trending-list');

function coverSrc(song) {
  if (song.cover_url) return song.cover_url;
  return '/images/default-cover.png';
}

function renderTrending(songs) {
  const top5 = songs.slice(0, 5);

  if (!top5.length) {
    list.innerHTML = '<p class="empty-text">No trending songs yet.</p>';
    return;
  }

  list.innerHTML = top5.map((song, i) => `
    <div class="trending-item ${i < 3 ? 'top-3' : ''}" data-index="${i}" role="button" tabindex="0" aria-label="Play ${song.title}">
      <span class="trending-rank">${i + 1}</span>
      <img
        class="trending-cover"
        src="${coverSrc(song)}"
        alt="${song.title} cover"
        onerror="this.src='/images/default-cover.png'"
      />
      <div class="trending-meta">
        <div class="trending-title">${song.title}</div>
        <div class="trending-artist">${song.artist}</div>
      </div>
      <span class="trending-plays">&#9654; ${song.play_count.toLocaleString()}</span>
    </div>
  `).join('');

  list.querySelectorAll('.trending-item').forEach(item => {
    const handler = () => {
      const idx = parseInt(item.dataset.index, 10);
      setQueue(top5, idx);
    };
    item.addEventListener('click', handler);
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
    });
  });
}

export async function initTrending() {
  try {
    const songs = await fetchSongs({ sort: 'trending' });
    renderTrending(songs);
  } catch (err) {
    list.innerHTML = '<p class="empty-text">Error loading trending songs.</p>';
    console.error(err);
  }
}

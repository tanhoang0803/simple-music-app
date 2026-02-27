/**
 * player.js — Persistent bottom player + queue logic
 */
import { recordPlay } from './api.js';

// ─── DOM refs ────────────────────────────────────────────────────────────────
const audio        = document.getElementById('audio-engine');
const playerEl     = document.getElementById('player');
const coverEl      = document.getElementById('player-cover');
const titleEl      = document.getElementById('player-title');
const artistEl     = document.getElementById('player-artist');
const btnPlay      = document.getElementById('btn-play-pause');
const btnPrev      = document.getElementById('btn-prev');
const btnNext      = document.getElementById('btn-next');
const seekBar      = document.getElementById('seek-bar');
const timeCurrent  = document.getElementById('time-current');
const timeTotal    = document.getElementById('time-total');
const volumeSlider = document.getElementById('volume-slider');

// ─── State ───────────────────────────────────────────────────────────────────
let queue        = [];
let currentIndex = 0;
let playTimer    = null;   // 15-second play-count timer

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt(seconds) {
  const s = Math.floor(seconds) || 0;
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function coverSrc(song) {
  if (song.cover_url) return song.cover_url;
  return '/images/default-cover.png';
}

// ─── Load & play current track ───────────────────────────────────────────────
function loadCurrent() {
  const song = queue[currentIndex];
  if (!song) return;

  // Update UI
  coverEl.src     = coverSrc(song);
  titleEl.textContent  = song.title;
  artistEl.textContent = song.artist;
  playerEl.classList.remove('player--idle');

  // Reset seek
  seekBar.value      = 0;
  timeCurrent.textContent = '0:00';
  timeTotal.textContent   = fmt(song.duration);

  // Reset timer
  clearTimeout(playTimer);

  // Set audio source and play
  audio.src = `/audio/${song.filename}`;
  audio.play().catch(() => {
    // Autoplay was blocked — update button to show play state
    updatePlayBtn(false);
  });

  // After 15s of continuous playback, record the play
  playTimer = setTimeout(() => {
    if (!audio.paused) {
      recordPlay(song.id).catch(() => {});
    }
  }, 15000);

  updatePlayBtn(true);
}

function updatePlayBtn(playing) {
  btnPlay.innerHTML = playing ? '&#9646;&#9646;' : '&#9654;';
  btnPlay.setAttribute('aria-label', playing ? 'Pause' : 'Play');
}

// ─── Public API ──────────────────────────────────────────────────────────────
/**
 * Set the queue and start playing at the given index.
 * @param {object[]} songs
 * @param {number}   startIndex
 */
export function setQueue(songs, startIndex = 0) {
  queue        = songs;
  currentIndex = startIndex;
  loadCurrent();
}

/**
 * Play a raw URL directly (no queue entry needed — used by the hero button).
 * @param {string} src
 * @param {string} [title]
 * @param {string} [artist]
 */
export function playDirect(src, title = '—', artist = '—') {
  queue        = [];
  currentIndex = 0;
  coverEl.src            = '/images/default-cover.png';
  titleEl.textContent    = title;
  artistEl.textContent   = artist;
  playerEl.classList.remove('player--idle');
  seekBar.value          = 0;
  timeCurrent.textContent = '0:00';
  audio.src = src;
  audio.play().catch(() => updatePlayBtn(false));
  updatePlayBtn(true);
}

// ─── Controls ────────────────────────────────────────────────────────────────
btnPlay.addEventListener('click', () => {
  if (!queue.length) return;
  if (audio.paused) {
    audio.play();
    updatePlayBtn(true);
    // Restart 15s timer if not yet fired
    if (!playTimer) {
      const song = queue[currentIndex];
      playTimer = setTimeout(() => {
        if (!audio.paused) recordPlay(song.id).catch(() => {});
      }, 15000);
    }
  } else {
    audio.pause();
    updatePlayBtn(false);
    clearTimeout(playTimer);
    playTimer = null;
  }
});

btnPrev.addEventListener('click', () => {
  if (!queue.length) return;
  // If more than 3s in, restart; else go to previous
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
  } else {
    currentIndex = (currentIndex - 1 + queue.length) % queue.length;
    loadCurrent();
  }
});

btnNext.addEventListener('click', () => {
  if (!queue.length) return;
  currentIndex = (currentIndex + 1) % queue.length;
  loadCurrent();
});

// Auto-advance
audio.addEventListener('ended', () => {
  if (!queue.length) return;
  currentIndex = (currentIndex + 1) % queue.length;
  loadCurrent();
});

// Seek bar
audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  seekBar.value = (audio.currentTime / audio.duration) * 100;
  timeCurrent.textContent = fmt(audio.currentTime);
  timeTotal.textContent   = fmt(audio.duration);
});

seekBar.addEventListener('input', () => {
  if (!audio.duration) return;
  audio.currentTime = (seekBar.value / 100) * audio.duration;
});

// Volume
audio.volume = parseFloat(volumeSlider.value);
volumeSlider.addEventListener('input', () => {
  audio.volume = parseFloat(volumeSlider.value);
});

// Sync play button if audio state changes externally
audio.addEventListener('play',  () => updatePlayBtn(true));
audio.addEventListener('pause', () => updatePlayBtn(false));

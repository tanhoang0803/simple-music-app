/**
 * hero.js — Wires the hero play/pause icon to the main audio engine.
 * Both the hero icon and the bottom player button control the same
 * #audio-engine, so they are always in sync.
 */
import { playDirect } from './player.js';

const heroIcon   = document.getElementById('hero-icon');
const heroMeta   = document.getElementById('hero-song-meta');
const audio      = document.getElementById('audio-engine');

const HERO_SRC    = '/audio/giveon-heartbreak.mp3';
const HERO_TITLE  = 'HEARTBREAK ANNIVERSARY';
const HERO_ARTIST = 'Giveon';

heroIcon.addEventListener('click', () => {
  // Nothing loaded yet — load the featured song
  if (!audio.src || audio.src === window.location.href) {
    playDirect(HERO_SRC, HERO_TITLE, HERO_ARTIST);
    return;
  }
  // Toggle play / pause on whatever is currently loaded
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});

// Keep hero icon image in sync with the audio engine
audio.addEventListener('play',  () => { heroIcon.src = '/images/pause.png'; });
audio.addEventListener('pause', () => { heroIcon.src = '/images/play.png'; });

// Update the hero meta label whenever the player title changes
const titleEl  = document.getElementById('player-title');
const artistEl = document.getElementById('player-artist');

const observer = new MutationObserver(() => {
  const t = titleEl.textContent;
  const a = artistEl.textContent;
  if (t && t !== '—') {
    heroMeta.textContent = `${t} \u2014 ${a}`;
  }
});
observer.observe(titleEl,  { childList: true, characterData: true, subtree: true });
observer.observe(artistEl, { childList: true, characterData: true, subtree: true });

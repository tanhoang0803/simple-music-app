/**
 * api.js — fetch() wrappers for every API endpoint
 */

const BASE = '';   // same origin

/**
 * Fetch the songs list with optional filters.
 * @param {{ search?: string, genre?: string, sort?: string }} opts
 */
export async function fetchSongs({ search = '', genre = '', sort = '' } = {}) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (genre)  params.set('genre',  genre);
  if (sort)   params.set('sort',   sort);
  const qs = params.toString();
  const res = await fetch(`${BASE}/api/songs${qs ? '?' + qs : ''}`);
  if (!res.ok) throw new Error(`fetchSongs failed: ${res.status}`);
  return res.json();
}

/**
 * Fetch a single song by id.
 * @param {number} id
 */
export async function fetchSong(id) {
  const res = await fetch(`${BASE}/api/songs/${id}`);
  if (!res.ok) throw new Error(`fetchSong(${id}) failed: ${res.status}`);
  return res.json();
}

/**
 * Fetch all genres.
 * @returns {Promise<string[]>}
 */
export async function fetchGenres() {
  const res = await fetch(`${BASE}/api/genres`);
  if (!res.ok) throw new Error(`fetchGenres failed: ${res.status}`);
  return res.json();
}

/**
 * Increment play count for a song.
 * @param {number} id
 * @returns {Promise<{ play_count: number }>}
 */
export async function recordPlay(id) {
  const res = await fetch(`${BASE}/api/songs/${id}/play`, { method: 'POST' });
  if (!res.ok) throw new Error(`recordPlay(${id}) failed: ${res.status}`);
  return res.json();
}

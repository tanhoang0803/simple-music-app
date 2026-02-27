/**
 * app.js — Entry point: initialise all modules on DOMContentLoaded
 */
import { initCatalog }  from './catalog.js';
import { initTrending } from './trending.js';
import './hero.js';

document.addEventListener('DOMContentLoaded', () => {
  Promise.all([initCatalog(), initTrending()]).catch(err => {
    console.error('App init error:', err);
  });
});

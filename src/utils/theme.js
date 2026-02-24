/**
 * manages light/dark theme switching (default is light)
 */

const THEME_KEY = 'book_theme';

/**
 * load saved theme or default to 'light
 */
export function loadTheme() {
  return localStorage.getItem(THEME_KEY) || 'dark';
}


export function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

/**
 * Toggle between dark and light themes.
 */
export function toggleTheme() {
  const current = document.body.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}

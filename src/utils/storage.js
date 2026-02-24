
const STORAGE_KEY = 'book_favorites';

/**
 * load all favorites from localstorage
 */
export function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * saves current favorites array to localStorage
 */
export function saveFavorites(favorites) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

/**
 * add a book to favorites if it is not there
 */
export function addFavorite(book) {
  const favorites = loadFavorites();
  const exists = favorites.some(b => b.key === book.key);
  if (!exists) {
    favorites.push(book);
    saveFavorites(favorites);
  }
}

/**
 * remove a book from favorites by its  key
 */
export function removeFavorite(bookKey) {
  const favorites = loadFavorites().filter(b => b.key !== bookKey);
  saveFavorites(favorites);
}

/**
 * check if a book is in favorites.
 */
export function isFavorite(bookKey) {
  return loadFavorites().some(b => b.key === bookKey);
}

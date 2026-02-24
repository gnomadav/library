/**
 *сreates a dom element for a book card.
 */

import { getCoverUrl } from '../api/openLibrary.js';
import { isFavorite, addFavorite, removeFavorite } from '../utils/storage.js';

// heart icon svg
const HEART_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
</svg>`;

// book icon svg
const BOOK_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
</svg>`;

/**
 * create a book card element.
 *
 * book - book data from api
 * onFavoriteChange - callback when favorite state changes
 * isInFavoritesView - If true, show "Remove" instead of heart toggle
 * @returns {HTMLElement}
 */
export function createBookCard(book, onFavoriteChange, isInFavoritesView = false) {
  const card = document.createElement('article');
  card.className = 'book-card';
  card.dataset.key = book.key;

  const coverContainer = document.createElement('div');
  coverContainer.style.position = 'relative';

  if (book.cover_i) {
    const img = document.createElement('img');
    img.className = 'book-cover';
    img.src = getCoverUrl(book.cover_i, 'M');
    img.loading = 'lazy'; // loads only when u see it 
    coverContainer.appendChild(img);
  } else {
    coverContainer.appendChild(createPlaceholder()); // if no image 
  }

  card.appendChild(coverContainer);

  const info = document.createElement('div');
  info.className = 'book-info';

  const title = document.createElement('h2');
  title.className = 'book-title';
  title.textContent = book.title || 'No info';

  const author = document.createElement('p');
  author.className = 'book-author';
  const authors = book.author_name;
  author.textContent = Array.isArray(authors) && authors.length ? authors.slice(0, 2).join(', '): 'Unknown Author';
  // check if array is not empty,then slice for max 2 authors, if no authors 'Unknown Author'

  const year = document.createElement('p');
  year.className = 'book-year';
  year.textContent = book.first_publish_year
  ? `${book.first_publish_year}`
  : 'Year unknown';

  info.append(title, author, year);
  card.appendChild(info);

  // show remove btn
  if (isInFavoritesView) {
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'X Remove';
    removeBtn.addEventListener('click', () => {
      removeFavorite(book.key);
      card.remove();
      onFavoriteChange();
    });
    card.appendChild(removeBtn);
  } else {
    // In the search tab: show the heart/favorite toggle
    const favBtn = createFavButton(book, onFavoriteChange);
    card.appendChild(favBtn);
  }

  return card;
}

/**
 * create the favorite  button with heart icon
 */
function createFavButton(book, onFavoriteChange) {
  const btn = document.createElement('button');
  btn.className = 'fav-btn';

  const updateState = () => {
    const saved = isFavorite(book.key);
    btn.classList.toggle('active', saved);
    btn.innerHTML = `${HEART_SVG}`;
    btn.setAttribute('aria-label' , saved ? 'Remove from favorites' : 'Add to favorites');
  };

  updateState();

  btn.addEventListener('click', () => { //checks if already in favorite 
    if (isFavorite(book.key)) {
      removeFavorite(book.key);
    } else {
      addFavorite(book);
    }
    updateState();
    onFavoriteChange && onFavoriteChange();
  });

  return btn;
}

/**
 * creating placeholder
 */
function createPlaceholder() {
  const placeholder = document.createElement('div');
  placeholder.className = 'book-cover-placeholder';
  placeholder.innerHTML = `${BOOK_SVG}`;
  return placeholder;
}

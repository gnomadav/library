import './styles/main.css';
import { searchBooks } from './api/openLibrary.js';
import { loadFavorites } from './utils/storage.js';
import { loadTheme, toggleTheme,applyTheme } from './utils/theme.js';
import { debounce } from './utils/debounce.js';
import { createBookCard } from './components/BookCard.js';
import { showStatus, clearStatus } from './components/StatusMessage.js';

const searchInput   = document.getElementById('searchInput');
const searchBtn     = document.getElementById('searchBtn');
const authorFilter  = document.getElementById('authorFilter');
const resultsGrid   = document.getElementById('resultsGrid');
const statusEl      = document.getElementById('status');
const favoritesGrid = document.getElementById('favoritesGrid');
const favStatusEl   = document.getElementById('favStatus');
const favCountEl    = document.getElementById('favCount');
const themeToggle   = document.getElementById('themeToggle');
const navBtns       = document.querySelectorAll('.nav-btn');
const tabPanels     = document.querySelectorAll('.tab-panel');

let lastResults = [];

function init() {
  applyTheme(loadTheme()); /*
    *if we want instant,we should add in html file this(in react it is much easier)
    <script>
      const theme = localStorage.getItem('book_theme') || 'dark';
      document.documentElement.setAttribute('data-theme', theme);
    </script>
  */ 
  updateFavCount();
  renderFavorites();
}

themeToggle.addEventListener('click', () => {
  toggleTheme();
});

//for ecah bavButt adds list. ,removes active when pressed from all the butt,then adds active to the clicked btn,rerenders if it is Favorite
navBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    var tab = btn.dataset.tab;
    navBtns.forEach(function(b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');
    tabPanels.forEach(function(panel) {
      panel.classList.remove('active');
      if (panel.id === 'tab-' + tab) {
        panel.classList.add('active');
      }
    });

    if (tab === 'favorites') {
      renderFavorites();
    }
  });
});

searchBtn.addEventListener('click', function() {
  handleSearch();
});

searchInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    handleSearch();
  }
});

searchInput.addEventListener('input', debounce(function() { //because of debounce we start the search after 0.5s
  if (searchInput.value.trim().length >= 3) { //here we can choose min letters fo the search 
    handleSearch();
  }
}, 500));

// if empty,shows last results,if not, leaves only where author is the same
authorFilter.addEventListener('input', function() {
  var filterVal = authorFilter.value.trim().toLowerCase();
  if (filterVal === '') {
    renderSearchResults(lastResults);
    return;
  }

  var filtered = [];
  for (var i = 0; i < lastResults.length; i++) {
    var book = lastResults[i];
    if (book.author_name) {
      for (var j = 0; j < book.author_name.length; j++) {
        if (book.author_name[j].toLowerCase().includes(filterVal)) {
          filtered.push(book);
          break;
        }
      }
    }
  }

  clearGrid(resultsGrid);
  if (filtered.length === 0) {
    showStatus(statusEl, 'No results matching "' + authorFilter.value + '".');
  } else {
    renderSearchResults(filtered);
  }
});


//searvhing function 
async function handleSearch() {
  var query = searchInput.value.trim();

  if (query === '') {
    showStatus(statusEl, ' enter a search term', 'info');
    return;
  }

  showStatus(statusEl, 'Searching...', 'loading');
  clearGrid(resultsGrid);
  searchBtn.disabled = true;

  var books = await searchBooks(query);
  lastResults = books;
  searchBtn.disabled = false;
  clearStatus(statusEl);
  renderSearchResults(books);
}

//rendering the searching result 
function renderSearchResults(books) {
  clearGrid(resultsGrid);
  clearStatus(statusEl);

  for (var i = 0; i < books.length; i++) {
    var card = createBookCard(books[i], function() {
      updateFavCount();
    });
    resultsGrid.appendChild(card);
  }
}

// renders fovorites result 
function renderFavorites() {
  clearGrid(favoritesGrid);
  clearStatus(favStatusEl);

  var favorites = loadFavorites();

  if (favorites.length === 0) {
    showStatus(favStatusEl, 'no favorites yet', 'info');
    return;
  }

  for (var i = 0; i < favorites.length; i++) {
    var card = createBookCard(favorites[i], function() {
      updateFavCount();
      renderFavorites();
    }, true);
    favoritesGrid.appendChild(card);
  }
}

//updates the number of liked books 
function updateFavCount() {
  var count = loadFavorites().length;
  favCountEl.textContent = count;
}

function clearGrid(grid) {
  grid.innerHTML = '';
}

init();
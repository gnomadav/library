/**
  in this part we get the data for the future page building 
 */

const URL = 'https://openlibrary.org/search.json';
const IM_URL = 'https://covers.openlibrary.org/b/id';

/**
 *search books by query string.
 *query - search term title/author/keyword)
 *limit - max results to fetch
*/
export async function searchBooks(query, limit = 30) {
  if (!query || !query.trim()) { // no empty search 
    throw new Error('empty');
  }

  const url = `${URL}?q=${encodeURIComponent(query.trim())}&limit=${limit}&fields=key,title,author_name,first_publish_year,cover_i`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.docs || data.docs.length === 0) { //check if it is empty
    throw new Error('noRes');
  }

  return data.docs;
}

/**
 * build the cover image url form id
 * Id - cover_i field from api response
 * size - size of the imge 
 */
export function getCoverUrl(Id, size = 'M') {
  return `${IM_URL}/${Id}-${size}.jpg`; //if we do it without the size here gonna be "slide loading"
}

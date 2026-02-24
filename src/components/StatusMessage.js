/**
 * components/StatusMessage.js
 * Renders status messages (loading, error, empty) in a given container.
 */

/**
 * Show a status message inside the given element.
 * @param {HTMLElement} el - Container element
 * @param {string} message - Text to display
 * @param {'loading'|'error'|'info'|''} type - Modifier class
 */
export function showStatus(el, message, type = '') {
  el.className = `status${type ? ` status--${type}` : ''}`;
  el.textContent = message;
}

/**
 * Clear any status message.
 * @param {HTMLElement} el
 */
export function clearStatus(el) {
  el.className = 'status';
  el.textContent = '';
}

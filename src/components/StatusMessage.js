/**
 * components/StatusMessage.js
 * Renders status messages (loading, error, empty) in a given container.
 */

/**
 * Show a status message inside the given element.
 */
export function showStatus(el, message, type = '') {
  el.className = `status${type ? ` status--${type}` : ''}`;
  el.textContent = message;
}

/**
 * Clear any status message.
 */
export function clearStatus(el) {
  el.className = 'status';
  el.textContent = '';
}

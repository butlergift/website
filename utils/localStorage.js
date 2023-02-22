/* eslint-disable no-undef */
const KEY_PREFIX = 'ButlerGift:Web';
const INTERVAL_CLEAR_KEYS = 1000 * 60; // 1min

/**
 * Sets a key-value pair in localStorage with a TTL (in seconds).
 *
 * @param {string} key The key to set.
 * @param {*} value The value to set.
 * @param {number} ttl The TTL (in seconds) for the key-value pair. Set to 0 to disable TTL.
 */
export function setItem(k, value, ttl) {
  const now = new Date().getTime();
  const expiry = ttl ? now + (ttl * 1000) : 0;
  localStorage.setItem(`${KEY_PREFIX}:${k}`, JSON.stringify({ value, expiry }));
}

/**
 * Gets the value of a key from localStorage.
 *
 * @param {string} key The key to get.
 * @param {*} defaultValue The default value to return if the key does not exist.
 * @returns {*} The value of the key or the defaultValue.
 */
export function getItem(k, defaultValue) {
  const item = JSON.parse(localStorage.getItem(`${KEY_PREFIX}:${k}`));
  if (item) {
    if (item.expiry === 0 || new Date().getTime() <= item.expiry) {
      return item.value;
    }
    localStorage.removeItem(`${KEY_PREFIX}:${k}`);
  }
  return defaultValue;
}

/**
   * Removes a key from localStorage.
   *
   * @param {string} key The key to remove.
   */
export function removeItem(k) {
  localStorage.removeItem(`${KEY_PREFIX}:${k}`);
}

/**
   * Removes all keys and values from localStorage.
   */
export function clear() {
  localStorage.clear();
}

/**
   * Gets the number of keys in localStorage.
   *
   * @returns {number} The number of keys in localStorage.
   */
export function getLength() {
  return localStorage.length;
}

/**
* Gets the key at a given index in localStorage.
*
* @param {number} index The index of the key to get.
* @returns {string} The key at the index.
*/
export function key(index) {
  return localStorage.key(index);
}

/**
 * Gets all keys in localStorage as an array.
 *
 * @returns {string[]} An array of all keys in localStorage.
 */
export function keys() {
  const list = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    list.push(localStorage.key(i));
  }
  return list;
}

/**
 * Gets all keys in localStorage as an array that have prefix.
 *
 * @returns {string[]} An array of all keys in localStorage.
 */
export function keysWithPrefix(prefix) {
  const list = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const k = localStorage.key(i);
    if (k.startsWith(prefix)) {
      list.push(k);
    }
  }
  return list;
}

// Only Client-Side - Proactive remove expired keys
if (typeof window !== 'undefined') {
  setInterval(() => {
    keysWithPrefix(KEY_PREFIX).forEach((k) => getItem(k));
  }, INTERVAL_CLEAR_KEYS);
}

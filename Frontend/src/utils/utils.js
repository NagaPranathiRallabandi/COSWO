// filepath: E:\COSWO\Frontend\src\utils\utils.js
/**
 * A simple utility to combine class names.
 * @param {...(string|undefined|null|false)} inputs - The class names to combine.
 * @returns {string} The combined class names.
 */
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

/**
 * Create a URL for a given page name.
 * @param {string} pageName - The name of the page.
 * @returns {string} The URL of the page.
 */
export function createPageUrl(pageName) {
  return `/${pageName.toLowerCase()}`;
}
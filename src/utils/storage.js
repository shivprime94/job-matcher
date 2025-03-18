const CACHE_PREFIX = 'job_search_';
const DEFAULT_CACHE_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const storage = {
  set: (key, value, expiryMs = DEFAULT_CACHE_TIME) => {
    const item = {
      value,
      timestamp: Date.now(),
      expiry: expiryMs
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
  },

  get: (key) => {
    const item = localStorage.getItem(CACHE_PREFIX + key);
    if (!item) return null;

    const { value, timestamp, expiry } = JSON.parse(item);
    const now = Date.now();

    // Check if the item has expired
    if (now - timestamp > expiry) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    return value;
  },

  remove: (key) => {
    localStorage.removeItem(CACHE_PREFIX + key);
  },

  clear: () => {
    Object.keys(localStorage)
      .filter(key => key.startsWith(CACHE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }
}; 
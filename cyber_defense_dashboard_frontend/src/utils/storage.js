/**
 * Simple namespaced localStorage wrapper with JSON handling and expiry support.
 */

const hasStorage = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

// PUBLIC_INTERFACE
export function setItem(key, value, ttlMs) {
  /** Store a value in localStorage with optional TTL (in ms). */
  if (!hasStorage) return;
  const record = {
    value,
    expiry: typeof ttlMs === 'number' ? Date.now() + ttlMs : null,
  };
  window.localStorage.setItem(key, JSON.stringify(record));
}

// PUBLIC_INTERFACE
export function getItem(key, fallback = null) {
  /** Retrieve a value, respecting TTL if present. Returns fallback on missing/expired. */
  if (!hasStorage) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const record = JSON.parse(raw);
    if (record?.expiry && Date.now() > record.expiry) {
      window.localStorage.removeItem(key);
      return fallback;
    }
    return record?.value ?? fallback;
  } catch {
    return fallback;
  }
}

// PUBLIC_INTERFACE
export function removeItem(key) {
  /** Remove a value from localStorage. */
  if (!hasStorage) return;
  window.localStorage.removeItem(key);
}

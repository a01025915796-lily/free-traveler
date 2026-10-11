/*
 * Destination favorites stored in this browser only (localStorage, REQ-FUNC-068).
 * Only destination slugs are stored — no personal data, no server sync.
 * Every storage access is wrapped in try/catch; on any failure the list is empty.
 */

export const FAVORITES_KEY = "ft:favorites:v1";
const MAX_FAVORITES = 100;
const SLUG_RE = /^[a-z0-9-]{1,40}$/;
const CHANGE_EVENT = "ft:favorites-change";

type StorageLike = Pick<Storage, "getItem" | "setItem">;

function defaultStorage(): StorageLike | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

/** Parses stored JSON into a clean, de-duplicated slug list. Bad data → []. */
export function parseFavorites(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    const unique = new Set<string>();
    for (const item of value) {
      if (typeof item === "string" && SLUG_RE.test(item)) unique.add(item);
    }
    return [...unique].slice(0, MAX_FAVORITES);
  } catch {
    return [];
  }
}

export function readFavorites(storage: StorageLike | null = defaultStorage()): string[] {
  if (!storage) return [];
  try {
    return parseFavorites(storage.getItem(FAVORITES_KEY));
  } catch {
    return [];
  }
}

/** Writes the list. Returns false when storage is unavailable (private mode, quota, disabled). */
export function writeFavorites(slugs: readonly string[], storage: StorageLike | null = defaultStorage()): boolean {
  if (!storage) return false;
  try {
    const clean = parseFavorites(JSON.stringify(slugs));
    storage.setItem(FAVORITES_KEY, JSON.stringify(clean));
    if (typeof window !== "undefined") window.dispatchEvent(new Event(CHANGE_EVENT));
    return true;
  } catch {
    return false;
  }
}

export function isFavorite(slug: string, storage: StorageLike | null = defaultStorage()): boolean {
  return readFavorites(storage).includes(slug);
}

/** Adds without duplicates. Returns the new list (unchanged list when saving fails). */
export function addFavorite(slug: string, storage: StorageLike | null = defaultStorage()): string[] {
  const current = readFavorites(storage);
  if (current.includes(slug) || !SLUG_RE.test(slug)) return current;
  const next = [...current, slug];
  return writeFavorites(next, storage) ? next : current;
}

export function removeFavorite(slug: string, storage: StorageLike | null = defaultStorage()): string[] {
  const current = readFavorites(storage);
  const next = current.filter((s) => s !== slug);
  return writeFavorites(next, storage) ? next : current;
}

/** Toggles and reports the resulting state, so the UI can show a Toast. */
export function toggleFavorite(slug: string, storage: StorageLike | null = defaultStorage()): { favorites: string[]; added: boolean; saved: boolean } {
  const before = readFavorites(storage);
  const wasFavorite = before.includes(slug);
  const favorites = wasFavorite ? removeFavorite(slug, storage) : addFavorite(slug, storage);
  const saved = favorites.includes(slug) !== wasFavorite;
  return { favorites, added: !wasFavorite && saved, saved };
}

/** Subscribe for useSyncExternalStore: same-tab changes and other tabs (storage event). */
export function subscribeFavorites(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === FAVORITES_KEY) onChange();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/**
 * Stable snapshot string for useSyncExternalStore (arrays would change identity every read).
 * Parse it with parseFavorites().
 */
export function favoritesSnapshot(): string {
  return JSON.stringify(readFavorites());
}

export function favoritesServerSnapshot(): string {
  return "[]";
}

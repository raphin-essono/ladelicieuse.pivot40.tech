// Wrappers sécurisés pour localStorage et sessionStorage.
// Safari en navigation privée lève une exception sur toute écriture — ces helpers
// absorbent silencieusement l'erreur pour éviter un crash applicatif.

/**
 * fetch() avec timeout via AbortController.
 * Lance une AbortError si la réponse dépasse `ms` millisecondes (défaut 8 s).
 */
export function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit, ms = 8000): Promise<Response> {
  const ac = new AbortController();
  const tid = setTimeout(() => ac.abort(), ms);
  return fetch(input, { ...init, signal: ac.signal }).finally(() => clearTimeout(tid));
}

export const ls = {
  get: (key: string): string | null => {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set: (key: string, value: string): void => {
    try { localStorage.setItem(key, value); } catch { /* quota / private mode */ }
  },
  remove: (key: string): void => {
    try { localStorage.removeItem(key); } catch { /* quota / private mode */ }
  },
};

export const ss = {
  get: (key: string): string | null => {
    try { return sessionStorage.getItem(key); } catch { return null; }
  },
  set: (key: string, value: string): void => {
    try { sessionStorage.setItem(key, value); } catch { /* quota / private mode */ }
  },
  remove: (key: string): void => {
    try { sessionStorage.removeItem(key); } catch { /* quota / private mode */ }
  },
};

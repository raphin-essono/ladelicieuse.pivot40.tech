// Fetch public (sans authentification) — pour les pages clients
export async function publicFetch<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json().catch(() => null);
    if (!json || !json.success) return null;
    return json.data as T;
  } catch {
    return null;
  }
}

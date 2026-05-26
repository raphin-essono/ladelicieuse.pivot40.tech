// Service API admin — ajoute automatiquement le JWT et gère les 401
import { ls } from '@/lib/storage';

function headers(): HeadersInit {
  const token = ls.get('admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function handle401() {
  ls.remove('admin_token');
  ls.remove('admin_user');
  ls.remove('admin_logged_in');
  window.location.href = '/admin/login';
}

export async function adminGet<T = unknown>(path: string): Promise<T> {
  const res = await fetch(`/api${path}`, { headers: headers() });
  if (res.status === 401) { handle401(); throw new Error('Non authentifié'); }
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Erreur serveur');
  return json as T;
}

export async function adminPost<T = unknown>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method: 'POST',
    headers: headers(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) { handle401(); throw new Error('Non authentifié'); }
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Erreur serveur');
  return json as T;
}

export async function adminPatch<T = unknown>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method: 'PATCH',
    headers: headers(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) { handle401(); throw new Error('Non authentifié'); }
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Erreur serveur');
  return json as T;
}

export async function adminDelete<T = unknown>(path: string): Promise<T> {
  const res = await fetch(`/api${path}`, { method: 'DELETE', headers: headers() });
  if (res.status === 401) { handle401(); throw new Error('Non authentifié'); }
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Erreur serveur');
  return json as T;
}

export async function adminUploadImage(file: File): Promise<string> {
  const token = ls.get('admin_token');
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (res.status === 401) { handle401(); throw new Error('Non authentifié'); }
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Erreur upload');
  return json.url as string;
}

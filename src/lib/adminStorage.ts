export function loadAdminData<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveAdminData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // quota exceeded
  }
}

export function addHistoryEntry(action: string, type: string, user = 'Admin') {
  const key = 'ld_admin_history';
  const ICONS: Record<string, string> = {
    commande: 'ShoppingCart',
    utilisateur: 'User',
    stock: 'Package',
    facture: 'FileText',
    parametre: 'Settings',
  };
  try {
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const now = new Date();
    const date = now.toLocaleDateString('fr-FR') + ' ' + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const entry = { id: Date.now(), action, type, user, date, iconName: ICONS[type] ?? 'Settings' };
    localStorage.setItem(key, JSON.stringify([entry, ...existing].slice(0, 100)));
  } catch {
    // ignore
  }
}

import { useEffect, useRef } from 'react';

async function getVapidKey(): Promise<string | null> {
  try {
    const res = await fetch('/api/notifications/push/vapid-key');
    const json = await res.json();
    return json.success ? json.publicKey : null;
  } catch {
    return null;
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64  = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw     = window.atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

export function usePushNotifications(userId?: string) {
  const subscribed = useRef(false);

  useEffect(() => {
    if (subscribed.current) return;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

    (async () => {
      try {
        const vapidKey = await getVapidKey();
        if (!vapidKey) return;

        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        await navigator.serviceWorker.ready;

        const perm = await Notification.requestPermission();
        if (perm !== 'granted') return;

        const existing = await reg.pushManager.getSubscription();
        const sub = existing ?? await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        });

        await fetch('/api/notifications/push/subscribe', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ subscription: sub.toJSON(), userId, userAgent: navigator.userAgent }),
        });

        subscribed.current = true;
      } catch {
        // Push non critique — erreur silencieuse
      }
    })();
  }, [userId]);
}

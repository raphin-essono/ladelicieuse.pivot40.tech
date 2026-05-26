import { Redis } from '@upstash/redis';

let client: Redis | null = null;

export function getRedis(): Redis | null {
  return client;
}

export async function connectRedis(): Promise<void> {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn('UPSTASH_REDIS_REST_URL/TOKEN non définis — cache Redis désactivé');
    return;
  }

  try {
    client = new Redis({ url, token });
    await client.ping(); // Vérifie la connectivité au démarrage
    console.log('Redis (Upstash) connecté');
  } catch (err) {
    console.warn('Redis non disponible — cache désactivé:', (err as Error).message);
    client = null;
  }
}

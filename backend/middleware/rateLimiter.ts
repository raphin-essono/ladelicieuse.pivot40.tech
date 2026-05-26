import { Request, Response, NextFunction } from 'express';
import { getRedis } from '../config/redis.js';

export function rateLimiter(maxRequests: number, windowSeconds: number, label: string) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const redis = getRedis();
    if (!redis) { next(); return; } // Pas de Redis = pas de rate limiting (fail open)

    const ip =
      (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0].trim()
      ?? req.socket.remoteAddress
      ?? 'unknown';

    const key = `rl:${label}:${ip}`;

    try {
      const count = await redis.incr(key);
      if (count === 1) await redis.expire(key, windowSeconds);

      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - count));

      if (count > maxRequests) {
        const ttl = await redis.ttl(key);
        res.status(429).json({
          success: false,
          message: `Trop de tentatives. Réessayez dans ${ttl} seconde${ttl > 1 ? 's' : ''}.`,
          retryAfter: ttl,
        });
        return;
      }
    } catch {
      // Redis error → laisse passer (fail open)
    }

    next();
  };
}

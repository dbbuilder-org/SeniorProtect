import Redis from 'ioredis';
import { env } from './env.js';

let redis: Redis | null = null;
let fallbackCache = new Map<string, { value: string; expiry: number }>();

function createRedisClient(): Redis | null {
  try {
    const client = new Redis(env.redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) {
          console.warn('Redis unavailable, using in-memory fallback');
          return null;
        }
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
    });

    client.on('error', (err) => {
      if (err.message.includes('ECONNREFUSED')) {
        console.warn('Redis not available, using in-memory cache fallback');
      }
    });

    return client;
  } catch {
    console.warn('Redis init failed, using in-memory fallback');
    return null;
  }
}

export async function initRedis(): Promise<void> {
  redis = createRedisClient();
  if (redis) {
    try {
      await redis.connect();
      console.log('Redis connected');
    } catch {
      console.warn('Redis connection failed, using in-memory fallback');
      redis = null;
    }
  }
}

export const cache = {
  async get(key: string): Promise<string | null> {
    if (redis) {
      try {
        return await redis.get(key);
      } catch {
        // fallthrough to memory cache
      }
    }
    const entry = fallbackCache.get(key);
    if (entry && entry.expiry > Date.now()) {
      return entry.value;
    }
    fallbackCache.delete(key);
    return null;
  },

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    if (redis) {
      try {
        await redis.set(key, value, 'EX', ttlSeconds);
        return;
      } catch {
        // fallthrough to memory cache
      }
    }
    fallbackCache.set(key, { value, expiry: Date.now() + ttlSeconds * 1000 });
  },

  async del(key: string): Promise<void> {
    if (redis) {
      try {
        await redis.del(key);
      } catch {
        // ignore
      }
    }
    fallbackCache.delete(key);
  },
};

import redisClient from '../../config/redis.js';

// In-Memory cache fallback when Redis is unconfigured or unreachable
const memoryCache = new Map();

export const getCache = async (key) => {
  if (redisClient && redisClient.status === 'ready') {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.warn(`Cache GET error for ${key}:`, err.message);
    }
  }

  const cached = memoryCache.get(key);
  if (cached && cached.expiry > Date.now()) {
    return cached.value;
  }
  return null;
};

export const setCache = async (key, value, ttlSeconds = 3600) => {
  const jsonStr = JSON.stringify(value);

  if (redisClient && redisClient.status === 'ready') {
    try {
      await redisClient.set(key, jsonStr, 'EX', ttlSeconds);
      return;
    } catch (err) {
      console.warn(`Cache SET error for ${key}:`, err.message);
    }
  }

  memoryCache.set(key, {
    value,
    expiry: Date.now() + ttlSeconds * 1000,
  });
};

export const deleteCache = async (key) => {
  if (redisClient && redisClient.status === 'ready') {
    try {
      await redisClient.del(key);
      return;
    } catch (err) {
      console.warn(`Cache DEL error for ${key}:`, err.message);
    }
  }

  memoryCache.delete(key);
};

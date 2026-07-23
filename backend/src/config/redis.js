import Redis from 'ioredis';
import config from './index.js';

let redisClient = null;

try {
  redisClient = new Redis(config.redis.url, {
    maxRetriesPerRequest: 3,
    enableOfflineQueue: false,
    retryStrategy(times) {
      if (times > 3) {
        console.warn('⚠️ Redis connection failed. Falling back to in-memory/disabled cache.');
        return null; // stop retrying
      }
      return Math.min(times * 100, 3000);
    },
  });

  redisClient.on('connect', () => {
    console.log('✅ Connected to Redis cache service');
  });

  redisClient.on('error', (err) => {
    console.warn('⚠️ Redis error:', err.message);
  });
} catch (error) {
  console.warn('⚠️ Redis initialization error:', error.message);
  redisClient = null;
}

export { redisClient };
export default redisClient;

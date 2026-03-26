import Redis from 'ioredis';
import config from './index.js';

let redis = null;

if (config.redis.url) {
  redis = new Redis(config.redis.url);
  redis.on('error', (err) => {
    console.warn('[Redis] Connection error — falling back to no-cache mode:', err.message);
    redis = null;
  });
} else {
  console.info('[Redis] No REDIS_URL set — running without cache.');
}

export default redis;

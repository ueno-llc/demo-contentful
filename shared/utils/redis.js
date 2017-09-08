import once from 'lodash/once';
import redis from 'redis';
import redisStreams from 'redis-streams';
import config from 'utils/config';

// Apply streams to redis client
redisStreams(redis);

// Create redis client
const client = redis.createClient(config('redisUrl'), null, { detect_buffers: true });

// prevent redis from throw when no redis server is available
client.on('error', once(() => {
  console.info('Error connecting to redis -- continuing without it');
}));

// Promisify
Object.entries({
  get: null,
  set: undefined,
  keys: [],
  exists: false,
  mget: [],
})
  .forEach(([key, fallbackValue]) => {
    client[`${key}Async`] = (...args) => new Promise((resolve) => {
      if (!client.connected) return resolve(fallbackValue);
      client[key](...args, (err, exists) => {
        if (err) return resolve(fallbackValue);
        resolve(exists);
      });
    });
  });

export default client;

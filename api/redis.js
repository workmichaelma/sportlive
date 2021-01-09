const cacheManager = require('cache-manager')
const redisStore = require('cache-manager-redis')

redisCache = cacheManager.caching({
  store: redisStore,
  redisPort: 6379,
  host: 'redis',
  port: 6379,
  // redisIP: '127.0.0.1',
  expire: 60,
  password: '',
  db: 0,
  ttl: 600
});

redisCache.store.events.on('redisError', function(error) {
  // handle error here
  console.log(error, '123');
});

module.exports = redisCache
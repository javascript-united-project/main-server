const redis = require('redis');

module.exports = redis.createClient({
  port: process.env.REDIS_PORT,
  host: process.env.MAIN_SYSTEM_HOST
});
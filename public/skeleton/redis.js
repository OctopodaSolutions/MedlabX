
const Redis = require('ioredis');
const { logger } = require('../logger');

class RedisClient {
  constructor() {
    if (RedisClient.instance) {
      return RedisClient.instance;
    }
    this.client = null;
    this.initialize();
    RedisClient.instance = this;
  }

  initialize() {
    try {
      this.client = Redis.createClient({
        // Your Redis configuration
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000); // Increase the delay with each attempt but cap at 2000ms
          if (times < process.env.MQTT_MAX_CONNECTIONS) { // Limit the maximum reconnection attempts to 10
            return delay;
          }
          return null; // Return null to stop trying to reconnect
        },
      });

      this.client.on('error', (err) => {
        logger.error(`Redis error: ${err}`);
        this.client = null; // Reset client to null if there's an error
      });

      this.client.on('connect', () => {
        logger.info('Connected to Redis');
      });
    } catch (error) {
      logger.error(`Redis not supported or unable to connect: ${error}`);
    }
  }

  flushAll() {
    if (!this.client) {
      logger.error('Redis client is not initialized');
      return;
    }
    this.client.flushall((err, succeeded) => {
      if (err) {
        logger.error(`Error flushing Redis: ${err}`);
      } else {
        logger.info(succeeded); // will be true if success
      }
    });
  }

  clearAllUserSessions() {
    if (!this.client) {
      logger.error('Redis client is not initialized');
      return;
    }
    const stream = this.client.scanStream({
      match: 'user_session:*',
    });

    stream.on('data', (keys = []) => {
      if (keys.length) {
        const pipeline = this.client.pipeline();
        keys.forEach((key) => pipeline.del(key));
        pipeline.exec()
          .then((result) => {
            logger.info(`Deleted ${result.length} sessions.`);
          })
          .catch((err) => logger.error('Error deleting sessions:', err));
      }
    });

    stream.on('end', () => logger.info('All sessions cleared.'));
  }
}

module.exports = new RedisClient();


// module.exports={ redisClient, flushRedis, clearAllUserSessions }

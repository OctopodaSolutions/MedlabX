
const Redis = require('ioredis');
const {logger} = require('../logger');

// const redisClient = new Redis();
/**
 * Creating a Redis client and handling events
 */
let redisClient;
try {
  redisClient = Redis.createClient({
    // Your Redis configuration
    retryStrategy: function (times) {
      const delay = Math.min(times * 50, 2000); // Increase the delay with each attempt but cap at 2000ms
      if (times < process.env.MQTT_MAX_CONNECTIONS) { // Limit the maximum reconnection attempts to 10
        return delay;
      }
      return null; // Return null to stop trying to reconnect
    }
  });

  redisClient.on('error', (err) => {
    logger.error(`'Redis error :as  ', ${err}`);
    redisClient = null; // Reset client to null if there's an error
  });

  redisClient.on('connect', () => {
    logger.info('Connected to Redis');
  });
} catch (error) {
  // console.log('Redis not supported or unable to connect:', error);
  logger.error(`'Redis not supported or unable to connect:', ${error}`);
}

const flushRedis =()=>{
    redisClient.flushall((err, succeeded) => {
        logger.info(succeeded); // will be true if success
      });
}

/**
 * Clearing all the user sessions present in redis
 */

function clearAllUserSessions() {
  const stream = redisClient.scanStream({
    match: 'user_session:*',
  });
  stream.on('data', (keys = []) => {
    if (keys.length) {
      const pipeline = redisClient.pipeline();
      keys.forEach(key => pipeline.del(key));
      pipeline.exec().then((result) => {
        logger.info(`Deleted ${result.length} sessions.`);
      }).catch(err => logger.error('Error deleting sessions:', err));
    }
  });
  stream.on('end', () => logger.info('All sessions cleared.'));
}


module.exports={
  redisClient,
  flushRedis,
  clearAllUserSessions
}

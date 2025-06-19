/**
 * Cleaned version — No Electron
 */

const path = require('path');
const fs = require('fs');

const envPath = './.env';
require('dotenv').config({ path: envPath });

const configPath = path.join(__dirname, 'config.json');

const { mySqlConnection } = require('./skeleton/database');
mySqlConnection.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
  connection.release();
});

console.log('Env path:', envPath);
console.log(`Directory Path: ${__dirname}`);
console.log('Config Path: ', configPath);

const { logger } = require('./logger');
logger.info(`Get App Path ${__dirname}`);

const Server = require('./skeleton/server');
const demoMode = require(configPath)['DEMO_MODE'];
const numMqtt = require(configPath)['NUM_MQTT'];
const { showErrorDialog } = require('./dialogMessage');
const { closeAppCompletely, refreshMqtt } = require('./actions');
const wss = require('./skeleton/websockets');
const { restoreFiles, checkIfUpdateAvailable } = require('./update');
const userDataPath = path.resolve(__dirname, 'userdata');
const backupDir = path.join(userDataPath, 'backup');
const { MqttManager } = require('./skeleton/mqtt_client');
const redisClient = require('./skeleton/redis');
const { initializeLicenseFile } = require('./licenseCreation');

global.server = new Server();

/**
 * Handles the SIGUSR2 signal for performing cleanup tasks.
 */
const shutdown = async () => {
  logger.info("Shutting down servers...");
  await global.server.stop();
  process.exit(0);
};

// Handle SIGINT and SIGTERM signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

(async () => {
  initializeLicenseFile?.();

  if (fs.existsSync(backupDir)) {
    logger.info('Restoring backup files...');
    await restoreFiles();
    fs.rmdirSync(backupDir, { recursive: true });
    logger.info('Backup files restored and backup directory removed.');
  }

  await server.start();
  setTimeout(() => {}, 5000);

  logger.info("Clearing LocalStorage Sessions");
  logger.info(`Active Sessions ${wss.getActiveSessions().size}`);
  let localWs = wss.getWebSocketServer();
  localWs.broadcast({ type: "Clean", msg: "Logout All Sessions" });
  setTimeout(() => {}, 2000);

  redisClient.clearAllUserSessions();

  global.MqttClient = MqttManager.getInstance(wss.getWebSocketServer());
  refreshMqtt();

  checkIfUpdateAvailable().catch((err) => {
    logger.info("Update not Downloaded");
  });
})().catch((err) => {
  logger.error(`Error caught ${err}`);
  showErrorDialog?.("Error in Creating App", String(err));
  closeAppCompletely();
});

// Additional error handlers
process.on('uncaughtException', (error) => {
  if (error.code === 'EADDRINUSE') {
    logger.error(`Stopping Servers. Address Busy.`);
  } else if (error.code === 'EADDRNOTAVAIL') {
    logger.error(`IP Address not available.`);
    showErrorDialog?.(`IP Address not available. Try restarting router or check router connections.`);
  } else {
    logger.error(`Uncaught Exception: ${error.message}`);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at---: ${promise} reason: ${reason}`);
});

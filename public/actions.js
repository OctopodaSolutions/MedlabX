const { app } = require('electron');
const path = require('path');
const { logger } = require('./logger');
const configPath = app.isPackaged ? path.join(process.resourcesPath, 'resources', 'config.json') : './config.json';
const { exec } = require('child_process');
const wss = require('./skeleton/websockets');
const demoMode = (require(configPath))['DEMO_MODE'];

const { MqttManager } = require('./skeleton/mqtt_client');


/**
 * Restarts the application.
 */
function restartApp() {
  try {
    logger.info(`Restarting App`);
    app.relaunch();
    app.quit();
  } catch (err) {
    logger.error(`Error restarting App: ${err}`);
  }
}

/**
 * Closes the application completely, stopping the servers and quitting the app.
 */
function closeAppCompletely() {
  try {
    logger.info(`<---------------------------Stopping Servers & Closing App Completely --------------------------->`);
    // stopServer();
    app.quit();
  } catch (err) {
    logger.error(`Error closing Servers & DB: ${err}`);
  }
}

/**
 * Sets the demo mode in the configuration.
 * @param {boolean} bool - The demo mode status to set.
 */
function setDemoMode(bool) {
  logger.info('Setting Demo Mode');

  const fs = require('fs');
  const path = require('path');

  // Define the path to the config.json file
  const configPath = path.join(__dirname, 'config.json');

  // Function to update the DEMO property in the config file
  function updateDemoConfig(demoStatus) {
    fs.readFile(configPath, (err, data) => {
      if (err) {
        return logger.error("Failed to read config file:", err);
      }

      // Parse the JSON data from the config file
      let config;
      try {
        config = JSON.parse(data);
      } catch (parseErr) {
        return logger.error("Failed to parse config file:", parseErr);
      }

      // Update the DEMO property
      config.DEMO_MODE = demoStatus;

      // Write the updated config back to the file
      fs.writeFile(configPath, JSON.stringify(config, null, 2), (writeErr) => {
        if (writeErr) {
          logger.error("Failed to write updated config to file:", writeErr);
        } else {
          logger.info(`Config updated successfully. DEMO_MODE SET TO ${demoStatus}`);
        }
      });
    });
  }

  updateDemoConfig(bool);
}

/**
 * Establishes the MQTT connections based on the configuration.
 */
function refreshMqtt() {
  global.MqttClient = MqttManager.getInstance(wss.getWebSocketServer());
  if (!demoMode) {
    // global.MqttClient.subscribe({ name: `hs1`, returnFeed: `ss1` });
    // logger.info(`Setting up connections for ${numMCA} MCA & ${numMqtt} Devices`);
    // let i = 0;
    // for (let i = 1; i <= numMCA; i++) {
    //   if (global.MqttClient) {
    //     // global.MqttClient.subscribe({ name: `xwpae${i}/data`, returnFeed: `xwpae${i}/control` });
    //     // global.MqttClient.subscribe({ name: `xwpae${i}/roi` });
    //     // global.MqttClient.subscribe({ name: `xwpae${i}/calibrate` });
    //     // global.MqttClient.subscribe({ name: `xwpae${i}/settings` });
    //     // global.MqttClient.subscribe({name:`xwpae${i}/peaks`});
    //     // global.MqttClient.subscribe({ name: `xspec${i}/info` });
    //   }
    // }
    // for (i = 1; i <= numAGM; i++) {s
    //   global.MqttClient.subscribe({ name: `hs${i}`, returnFeed: `ss${i}` });
    // }
    // for (i = 1; i <= numAGM; i++) {
    //   global.MqttClient.subscribe({ name: `xcsm/hs${i}`, returnFeed: `xcsm/ss${i}` });
    // }
  } else {
    logger.info(`App running in DEMO_MODE ${demoMode}`);
    logger.info(`MQTT connections not attempted`);
  }
  // MqttClient.onMessage((topic, message) => {
  //   if (topic === 'hs1') {
  //     console.log('Received msg:', message.toString());
  //   }
  // });
}

/**
 * Refreshes the WebSocket servers by stopping and restarting them.
 */
function refreshWSS() {
  try {
    stopServer();
    setTimeout(3000, () => { logger.info(`Restarting HTTP Servers Called. Timeout.`) });

  } catch (err) {
    logger.error(`Error Restarting WSS Server: ${err}`);
  }
}

/**
 * Checks and cleans Redis sessions.
 */
function checkAndCleanRedisSessions() {
  console.log("Clear Redis Sessions");
}

module.exports = {
  restartApp,
  closeAppCompletely,
  setDemoMode,
  refreshMqtt,
  refreshWSS,
  checkAndCleanRedisSessions
}

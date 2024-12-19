const mqtt = require('mqtt');
const { app } = require('electron');
const path = require('path');
const { logger } = require('../logger');
const configPath = app.isPackaged ? path.join(process.resourcesPath, 'resources', 'config.json') : '../config.json';
const demoMode = require(configPath)['DEMO_MODE'];
const mqttURL = (require(configPath))['MQTT_SERVER_ADDR'];
const mqttPort = (require(configPath))['MQTT_SERVER_PORT'];
// const numMqtt = (require(configPath))['NUM_MQTT'];
// const numMCA = (require(configPath))['NUM_MCA'];
// const numAGM = (require(configPath))['NUM_AGM'];
// const shortsaveInterval = (require(configPath))['ACTIVITY_SAVE_INTERVAL_SHORT']
// const longsaveInterval = (require(configPath))['ACTIVITY_SAVE_INTERVAL_LONG']
// const cron = require('node-cron');
// const { updateXspecHistory, fetchCoversionFactors } = require('./database');
// const { format } = require('date-fns');
// const fs = require('fs');
// const { v4: uuidv4 } = require('uuid');

/**
 * Creating a Deque class and creating methods to perform on deque
 */
class Deque {
  constructor() {
    this.data = {};
    this.front = 0;
    this.back = 1;
    this.size = 0;
    this.remainingTime = 0;
    this.currentVal = 0;
  }
  addFront(value) {
    if (this.size >= Number.MAX_SAFE_INTEGER) throw "Deque capacity overflow";
    this.size++;
    this.front = (this.front + 1) % Number.MAX_SAFE_INTEGER;
    this.data[this.front] = value;
    let temp = 0;
    if (String(value).split(',')[0] == '1' || String(value).split(',')[0] == '2')
      temp = String(value).split(',')[4];
    else if (String(value).split(',')[0] == '3')
      temp = String(value).split(',')[3];
    this.remainingTime = this.remainingTime + Number(temp);

  }
  removeFront() {
    if (!this.size) return;
    let value = this.peekFront();
    this.size--;
    let temp = '';
    if (String(value).split(',')[0] == '1' || String(value).split(',')[0] == '2')
      temp = String(value).split(',')[4];
    else if (String(value).split(',')[0] == '3' || String(value).split(',')[0] == '31' || String(value).split(',')[0] == '32')
      temp = String(value).split(',')[5];
    else if (String(value).split(',')[0] == '4')
      temp = String(value).split(',')[7];
    else
      logger.mqtt_debug("Unkown cmd deque", (String(value).split(',')[0]));
    // this.currentVal=temp;

    this.remainingTime = this.remainingTime - Number(temp);
    delete this.data[this.front];
    this.front = (this.front || Number.MAX_SAFE_INTEGER) - 1;
    return value;
  }
  peekFront() {
    if (this.size) return this.data[this.front];
  }
  addBack(value) {
    // console.log("Deque addBack called ",value);
    if (this.size >= Number.MAX_SAFE_INTEGER) throw "Deque capacity overflow";
    this.size++;
    this.back = (this.back || Number.MAX_SAFE_INTEGER) - 1;
    this.data[this.back] = value;
    let temp = '';
    if (String(value).split(',')[0] == '1' || String(value).split(',')[0] == '2')
      temp = String(value).split(',')[4];
    else if (String(value).split(',')[0] == '3' || String(value).split(',')[0] == '31' || String(value).split(',')[0] == '32')
      temp = String(value).split(',')[5];
    else if (String(value).split(',')[0] == '4')
      temp = String(value).split(',')[7];
    else
      logger.mqtt_debug("Unkown cmd deque", (String(value).split(',')[0]));
    if (this.size == 1) {
      this.currentVal = temp;
    }
    this.remainingTime = this.remainingTime + Number(temp);
  }
  removeBack() {
    if (!this.size) return;
    let value = this.peekBack();
    this.size--;
    delete this.data[this.back];
    this.back = (this.back + 1) % Number.MAX_SAFE_INTEGER;
    return value;
  }
  peekBack() {
    if (this.size) return this.data[this.back];
  }
  getRemainingTime() {

  }
}

/**
 * Creating a MqttManger to connect with mqtt and handle the events
 * @param {String} wsClient //websocketserver
 */
class MqttManager {
  constructor(wsClient) {
    if (MqttManager.instance) {
      return MqttManager.instance;
    }
    this.localClient = null;
    this.feedsBuffer = {}; // To store info about feeds
    this.mqttOptions = {
      host: mqttURL,
      port: mqttPort,
      protocol: 'mqtt',
      rejectUnauthorized: false,
      reconnectPeriod: 3000
    };
    this.reconnectDelay = 5000;
    this.reconnectAttempts = 0;
    this.wsClient = wsClient; // Assigning Websocket server to variable
    this.isConnected = false;
    this.feeds = []; // Stores all the feeds
    this.latestMessage = null;
    this.messageTimer = null;
    this.telemetryDelay = 1000;
    this.feedsMsgs = {};
    this.returnMsg = [];
    this.throttleSendDeque = false;
    this.currentShortCronJob = null; // Time length of short cronjob
    this.currentLongCronJob = null; //Time length of long cronjob
    this.connect(this.mqttOptions);
  }

  static getInstance(wsClient) {
    if (wsClient == null) {
      logger.error(("Undefined Websocket Server"));
      // return null;
    }
    if (!MqttManager.instance) {
      MqttManager.instance = new MqttManager(wsClient);
    }
    return MqttManager.instance;
  }

  /**
   * Connect with mqtt
   * @param {object} clientOptions 
   */
  connect(clientOptions = {}) {
    const options = { ...this.mqttOptions, ...clientOptions };
    this.localClient = mqtt.connect(options);

    this.localClient.on('connect', () => {
      logger.mqtt_debug("Connected to MQTT Server");
      this.wsClient.broadcast({ type: 'ConnUpdate', msg: `${JSON.stringify({ service: 'mqtt', status: true })}` });
      this.isConnected = true;
    });

    this.localClient.on('message', this.handleMessage.bind(this));

    this.localClient.on('error', (error) => {
      logger.error(error);
      this.wsClient.broadcast({ type: 'ConnUpdate', msg: `${JSON.stringify({ service: 'mqtt', status: false })}` });
      this.localClient.end();
      this.isConnected = false;
    });

    this.localClient.on('close', this.handleClose.bind(this));
    this.localClient.on('offline', this.handleOffline.bind(this));
  }

  /**
   * Disconnect with mqtt
   * @returns promise of disconnect to mqtt or error in disconnection
   */
  disconnect() {
    return new Promise((resolve) => {
      if (this.localClient) {
        this.localClient.end(true, () => {
          logger.info(`Disconnected Mqtt Feeds`);
          this.localClient = null;
          this.isConnected = false;
          this.wsClient.broadcast({ type: 'ConnUpdate', msg: { service: 'mqtt', status: false } });
          this.reconnectAttempts = 0;
          resolve();

        });
      } else {
        resolve();
      }
    });
  }
  /**
   * Reconnecting to mqtt
   */
  tryReconnect() {
    if (this.reconnectAttempts < process.env.MQTT_MAX_CONNECTIONS) {
      setTimeout(() => {
        if (!this.isConnected) {
          this.reconnectAttempts++;
          this.connect();
        }
      }, this.reconnectDelay);
    } 
    else if(this.reconnectAttempts == process.env.MQTT_MAX_CONNECTIONS){
      logger.error(`Max MQTT Connection Attempts Reached`);
      this.wsClient.broadcast({ type: 'ConnUpdate', msg: JSON.stringify({ service: 'mqtt', status: false }) });
    }
    // else {
    //   logger.error(`Max MQTT Connection Attempts Reached`);
    //   this.wsClient.broadcast({ type: 'ConnUpdate', msg: JSON.stringify({ service: 'mqtt', status: false }) });
    // }
  }

  /**
   * Re-subscribe all the feeds
   * @param {Array} feeds 
   */
  resubscribeAllFeeds(feeds) {
    // console.log("resubscribeAllFeeds called");
    let thisObj = this;
    feeds.forEach(feed => {
      this.subscribe(feed);
    });
  }

  getStatus() {
    let status = this.isConnected
    return status
  }

  

  /**
   * Updating the latest message 
   * @param {String} message 
   */

  updateLatestMessage(message) {
    clearTimeout(this.messageTimer);
    this.latestMessage = message;
    this.messageTimer = setTimeout(() => {
      this.latestMessage = null;
    }, 1000);
  }

  /**
   * Reset and Reconnect to all the feeds
   * @param {Array} feeds 
   * @returns Error or Success
   */
  resetAndReconnect(feeds) {
    return new Promise((resolve, reject) => {
      // console.log("resetAndReconnect Called");
      this.disconnect().then(() => {
        logger.debug("Disconnect Completed Called");
        this.feedsBuffer = {};
        this.connect(this.mqttOptions);
        this.resubscribeAllFeeds(feeds);
        resolve();
      }).catch((err) => {
        logger.error(`Error in Disconnecting MQTT Feeds ${err}`);
        reject();
      });

    });
  }

  /**
   * Handles the messages from telemetry 
   * @param {String} topic 
   * @param {String} message 
   */
  handleMessage(topic, message) {
    this.updateLatestMessage({ topic: topic, msg: message.toString() });
    parseMsgToBuffer(topic, message, this);
    if (topic == 'xwpae1/data') {
      // this.setupCronJob(message);
      this.spectrumDataCalc(message);
    }
    if (topic == 'xcsm/hs1') {
      this.agmDataCalc(message);
    }
  }



  /**
   * Handling the connection close with mqtt
   */
  handleClose() {
    if (this.reconnectAttempts < process.env.MQTT_MAX_CONNECTIONS) {
      setTimeout(() => {
        logger.info(`Attempting to reconnect ${this.reconnectAttempts}`);
        this.wsClient.broadcast({ type: 'ConnUpdate', msg: `${JSON.stringify({ service: 'mqtt', status: false })}` });
        this.tryReconnect();
        this.reconnectAttempts++;
      }, this.reconnectDelay);
    }
    else if(this.reconnectAttempts == process.env.MQTT_MAX_CONNECTIONS){
      logger.error(`Max MQTT Connection Attempts Reached`);
      this.wsClient.broadcast({ type: 'ConnUpdate', msg: `${JSON.stringify({ service: 'mqtt', status: false })}` });
    } 
    // else {
    //   logger.error(`Max MQTT Connection Attempts Reached`);
    //   this.wsClient.broadcast({ type: 'ConnUpdate', msg: `${JSON.stringify({ service: 'mqtt', status: false })}` });
    // }
  }

  handleOffline() {
    logger.mqtt_debug('Offline');
    this.wsClient.broadcast({ type: 'error', msg: 'MQTT Disconnected' });
    this.wsClient.broadcast({ type: 'ConnUpdate', msg: `${JSON.stringify({ service: 'mqtt', status: false })}` });
    this.isConnected = false;
    this.tryReconnect();
  }

  /**
   * Publishing message to topic in telemtry
   * @param {String} topic 
   * @param {String} message 
   */
  publish(topic, message) {
    if (this.localClient.connected) {
      this.localClient.publish(topic, message, {}, (err) => {
        if (err) {
          logger.error(`Publish error: ${err.message}`);
          return;
        }
        logger.mqtt_debug(`Message ${message} sent to topic ${topic}`);
      });
    } else {
      logger.error("Client is not connected.");
    }
  }

  /**
   * Subscribing to topics in the feed array
   * @param {Array} feed 
   */
  subscribe(feed) {
    // Push feed to feeds array if not already present to prevent duplicate subscriptions
    if (!this.feeds.find(existingFeed => existingFeed.name === feed.name)) {
      this.feeds.push(feed);
    }
    this.localClient.subscribe(feed.name, (err, granted) => {
      if (!err) {

        //testing cronjob
        this.setupCronJob('hello');

        logger.mqtt_debug(`"Successfully Connected to Feed -> ", ${feed.name}`);
        let tempName = feed.name;
        logger.info(`FeedsBuffer added ${tempName} ${this.feedsBuffer[feed.name]} `);
        this.wsClient.broadcast({ type: 'ConnUpdate', msg: `${JSON.stringify({ service: 'mqtt', status: true, extra: `Connected to Feed ${tempName}` })}` });
      }
      else {
        logger.mqtt_error(`Error in connecting to feed -> ,${feed.name} ${err}`);
        this.wsClient.broadcast({ type: 'ConnUpdate', msg: `${JSON.stringify({ service: 'mqtt', status: false, extra: `Disconnected to Feed ${feed.name}` })}` });
      }
    })
  }


  getManager() {
    return this;
  }

  /**
   * Setting the telemetry
   * @param {Array} feeds 
   * @param {String} cmd 
   * @returns Success or Error
   */
  setTelemetry(feeds, cmd) {
    return new Promise((resolve, reject) => {
      try {
        // let manager=MqttManager.getInstance();
        logger.mqtt_debug(`Setting Telemetry ${cmd}`);
        this.telemetryDelay = cmd;
        feeds.forEach((feed) => {
          // sendCmd(MqttClient.localClient,cmd,feed.returnFeed);
          this.publish(feed.returnFeed, cmd);
        });
        resolve({ success: true });
      } catch (err) {
        logger.mqtt_debug(`Error in Setting Telemetry ${err}`);
        reject({ success: false, err: err });
      }
    })
  }
}

/**
 * Send data to websocket client (to frontend)
 * @param {Sting} topic 
 * @param {String} msg 
 * @param {Instance} mqttManager 
 */
const parseMsgToBuffer = async (topic, msg, mqttManager) => {
  const messageString = msg.toString('utf8');
  mqttManager.feedsMsgs[topic] = JSON.stringify({ timestamp: Date.now(), msg: msg.toString() });
};

/**
 * Publish data to mqtt
 * @param {String} topic 
 * @param {String} msg 
 * @param {Object} mqttManager 
 */
const sendDataToBuffer = async (topic, msg, mqttManager) => {
  console.log("send data to buffer called", topic, msg);
  await MqttClient.publish(topic, msg);
}

module.exports = {
  MqttManager,
  Deque,
  sendDataToBuffer
};
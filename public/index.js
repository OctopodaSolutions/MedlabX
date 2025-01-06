const {MqttManager} = require('./skeleton/mqtt_client');
const WebSocketServer = require('./skeleton/websockets');
const HttpService = require('./skeleton/server');

// Example usage of the services in the custom folder
// const CustomApiHandler = require('./custom/CustomApiHandler');

class Plugin {
  constructor(hostServices) {
    this.hostServices = hostServices; // To access host's services
    this.mqttService = null;
    this.websocketService = null;
    this.httpService = null;
  }

  initialize() {
    console.log('Initializing Plugin Services...');

    // Initialize MQTT Service
    this.mqttService = new MqttManager();
    this.mqttService.connect();

    // Initialize HTTP Service
    this.httpService = new HttpService();
    this.httpService.start();

    // Initialize WebSocket Service
    this.websocketService = WebSocketServer;
    this.websocketService.createWebSocketServer(this.httpService.httpServer);


    // Use custom APIs
    // CustomApiHandler.setup(this.mqttService, this.websocketService, this.httpService, this.hostServices);
  }

  terminate() {
    console.log('Terminating Plugin Services...');
    if (this.mqttService) this.mqttService.disconnect();
    if (this.websocketService) this.websocketService.closeWebSocketServer();
    if (this.httpService) this.httpService.stop();
  }
}

module.exports = Plugin;

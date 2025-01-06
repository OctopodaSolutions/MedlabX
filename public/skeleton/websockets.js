const WebSocket = require('ws');
const { logger } = require('../logger');

class WebSocketServer {
  constructor() {
    if (WebSocketServer.instance) {
      return WebSocketServer.instance;
    }

    this.wss = null;
    this.activeSessions = new Map();
    WebSocketServer.instance = this;
  }

  createWebSocketServer(server) {
    if (this.wss) {
      logger.warn('WebSocket server is already created.');
      return;
    }

    this.wss = new WebSocket.Server({ server }, () => {
      logger.info(`WebSocket server has started on ${server}`);
    });

    this.wss.on('connection', (ws) => {
      let clientId = "";
      logger.info(`Websocket Client connected: ${clientId}`);

      ws.on('message', (message) => {
        let dataObj = JSON.parse(message);

        switch (dataObj.type) {
          case 'register':
            clientId = dataObj.clientId;
            this.activeSessions.set(clientId, ws);
            break;

          case 'sync':
            clientId = dataObj.clientId;
            this.broadcastToOthers(clientId, dataObj.message);
            break;

          case 'ping':
            if (!MqttClient.getStatus()) {
              MqttClient.connect();
              MqttClient.feeds.forEach(feed => {
                MqttClient.subscribe(feed);
              });
            } else {
              this.sendActiveTopics();
            }
            break;

          default:
            logger.error("Unknown Command Broadcasted");
        }
      });

      ws.on('close', () => {
        this.activeSessions.delete(clientId);
        logger.info('Client disconnected');
      });
    });
  }

  broadcastToOthers(senderId, data) {
    this.activeSessions.forEach((clientWs, clientId) => {
      if (clientWs.readyState === WebSocket.OPEN && clientId !== senderId) {
        logger.debug(`Broadcasting Sync Message for ${clientId}. Msg - ${data}`);
        clientWs.send(JSON.stringify({
          type: 'Sync',
          origin: senderId,
          action: data,
          numSessions: this.activeSessions.size
        }));
      }
    });
  }

  sendActiveTopics() {
    this.broadcast({ type: 'activetopics', msg: MqttClient.feedsMsgs });
  }

  broadcast(data) {
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  closeWebSocketServer() {
    this.broadcast({ type: 'CloseSessions', origin: null, action: null });
    this.wss.close();
  }

  getWebSocketServer() {
    return this;
  }

  getActiveSessions() {
    return this.activeSessions;
  }
}

module.exports = new WebSocketServer();

// module.exports = { createWebSocketServer, getWebSocketServer, closeWebSocketServer,getActiveSessions };

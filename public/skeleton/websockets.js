const WebSocket = require('ws');
const {logger} = require('../logger');
let wss = null;

const activeSessions = new Map();

/**
 * Websoketserver creation and handling events
 * @param {String} server 
 */
function createWebSocketServer(server) {
  // return new Promise((resolve,reject)=>{
    wss = new WebSocket.Server({server},() => {
      logger.info(`WebSocket server has started on ${server}`);
      // resolve();
    });

  wss.on('connection', (ws) => {
      let clientId ="";
      logger.info(`Websocket Client connected: ${clientId}`);
      ws.on('message', (message) => {
          let dataObj=JSON.parse(message);
          if (dataObj.type === 'register') {
            clientId = dataObj.clientId;
            activeSessions.set(clientId, ws);
            return;
          }
          else if(dataObj.type=='sync'){
            clientId=dataObj.clientId;
            broadcastToOthers(dataObj.clientId,dataObj.message);
          }
          else if(dataObj.type == 'ping'){
            // logger.debug(`Ping Recieved`);
            if(!MqttClient.getStatus()){
              MqttClient.connect()
              MqttClient.feeds.forEach(feed => {
                MqttClient.subscribe(feed);
              });
            }else{
              sendActiveTopics()
            }
          }
          else{
            logger.error("Unknown Command Broadcasted");
          }
      
        });

      ws.on('close', () => {
          activeSessions.delete(clientId);
          logger.info('Client disconnected');
      });

      // resolve()
  });

  // Helper function to broadcast messages to all clients except the sender
    function broadcastToOthers(senderId, data) {
      activeSessions.forEach((clientWs,clientId) => {
        // console.log("Broadcast MSG",clientId);
          if (clientWs.readyState === WebSocket.OPEN && clientId !== senderId) {
              // console.log("Broadcast Message - ",clientId);
              logger.debug(`Broadcasting Sync Message for ${clientId}. Msg - ${data}`);
              clientWs.send(JSON.stringify({type:'Sync',origin:senderId,action:data,numSessions:activeSessions.size}));
          }
      });
  }
  // })


    wss.broadcast = function broadcast(data) {
        // logger.info(`Broadcast Message Called`);
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        });
      };
}

/**
 * 
 * @returns websocketserver
 */

function getWebSocketServer() {
  // if(wss==null || wss==undefined){
  //   createWebSocketServer();
  // }
    return wss;
}

function sendActiveTopics() {
  wss.broadcast({ type: 'activetopics', msg: MqttClient.feedsMsgs });
}

/**
 * Close the websocket server
 */

function closeWebSocketServer(){
  wss.broadcast(JSON.stringify({type:'CloseSessions',origin:null,action:null}));
  wss.close();
}

/**
 * 
 * @returns active sessions of websocket clients
 */
function getActiveSessions(){
  return activeSessions;
}

module.exports = { createWebSocketServer, getWebSocketServer, closeWebSocketServer,getActiveSessions };



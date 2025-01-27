import { ErrorMessage, SuccessMessage } from "../components/UI Components/AlertMessage";
import { eventBus } from "../functions/User Access Functions/event_bus";
import { logout } from "../functions/User Access Functions/logout_service";
import { v4 as uuidv4 } from 'uuid';
import { WorkerPool } from "../../WorkerPool";
import { changeConnectionState, setMqtt, setNumConnections } from "../store/connectionSlice";
import { updateDownloadProgress } from "../store/updateSlice";
import { store } from "../store/fallbackStore";
import { addMqtt } from "../store/mqttConnectionSlice";



/**
 * Manages a WebSocket connection and processes messages with a pool of Web Workers.
 */
export class WebSocketClient {
    /**
     * @param {string} url - The URL of the WebSocket server.
     * @param {Function} onDispatch - Function to dispatch actions.
     * @param {object} workerPool - Sends the WorkerPool initialized in index.tsx or parent app
     */
    constructor(url, onDispatch,workerPool) {
        if (WebSocketClient.instance) {
            return WebSocketClient.instance;
        }

        this.clientId = uuidv4();
        this.onDispatch = onDispatch;
        this.NUM_MSGS = 50;
        this.socket = new WebSocket(url);
        this.setupSocket();
        this.isConnected = false;
        this.handleProcessedData = this.handleProcessedData.bind(this);
        this.realTimeState = false;
        this.heartbeatInterval = 30000; // 30 seconds
        console.log("Creating Websocket Session");

        this.workerPool = workerPool;
        this.workerPool.onProcessedData = this.handleProcessedData.bind(this);
        this.startHeartbeat();
        WebSocketClient.instance = this;

        // Default message callback (empty if not set)
        this.messageCallback = null;
    }

    /**
     * Sets up the WebSocket connection and its event handlers.
     */
    setupSocket() {
        this.socket.onopen = () => {
            console.log('Connected to the server');
            //   SuccessMessage('Successfully Connected to MQTT Server');
            this.socket.send(JSON.stringify({ type: 'register', clientId: this.clientId }));
            this.onDispatch(changeConnectionState(true));
            this.isConnected = true;
        };

        this.socket.onmessage = (event) => {
            // Process the message here
            if (this.messageCallback) {
                this.messageCallback(event.data);
            }
            this.workerPool.postMessage(event.data);
        };

        this.socket.onclose = () => {
            //   console.log('Disconnected from the server');
            ErrorMessage("Disconnected from MQTT Server");
            this.isConnected = false;
            this.onDispatch(changeConnectionState(false));
        };
    }

    
    /**
     * Sets the callback function to be invoked when a WebSocket message is received.
     * @param {Function} callback - The callback function to handle incoming WebSocket messages.
    */
    setMessageCallback(callback) {
        this.messageCallback = callback;
    }

    reconnect() {
        this.stopHeartbeat();
        setTimeout(() => {
            if (!this.isConnected) {
                console.log('Reconnecting...');
                this.setupSocket();
            }
        }, 5000); // Attempt reconnection after 5 seconds
    }

    /**
     * Closes the WebSocket connection.
     */
    closeSocket() {
        console.log("Closing Socket Incomplete");
        if (this.socket) {
            this.socket.close();
        }
    }

    startHeartbeat() {
        this.heartbeatTimer = setInterval(() => {
            if (this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({ type: 'ping' }));
                console.log("Heartbeat");
            }
        }, this.heartbeatInterval);
    }

    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }

    /**
     * Sends a message to the WebSocket server.
     * @param {string} message - The message to send.
     */
    sendMsgToServer(message) {
        console.log('message', message);
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type: 'sync', clientId: this.clientId, message: message }));
        } else {
            console.error('WebSocket is not open. Unable to send data.');
            ErrorMessage('WebSocket is not open. Unable to send data.');
        }
    }

    /**
     * Toggles the real-time state.
     */
    changeRealTime() {
        this.realTimeState = !this.realTimeState;
    }

    /**
     * Handles data processed by Web Workers.
     * @param {Object} tempObj - The processed data.
     */
    handleProcessedData(tempObj) {

        switch (tempObj.type) {

            case 'error':
                ErrorMessage(tempObj.msg);
                break;

            
            case 'downloadProgess':
                const parsedMsg = JSON.parse(tempObj.msg);
                const progressData = parsedMsg.msg;
                this.onDispatch(updateDownloadProgress(progressData));
                break;

            case 'ConnUpdate':
                console.log("Connection Update from Server", tempObj.msg);
                let tempObj1 = JSON.parse(tempObj.msg);
                if (tempObj1.service == "mqtt") {
                    if (!tempObj1.status) {
                        // ErrorMessage("Error Connecting MQTT. Restart Service if problem persists.");
                        this.onDispatch(setMqtt(false));
                    }
                    else {
                        console.log("Add Single MQTT");
                        //   this.onDispatch(addSingleMqtt(tempObj1.feed));
                        this.onDispatch(setMqtt(true));
                        SuccessMessage(tempObj1.extra);
                    }
                }
                break;
            
            case 'activetopics':
                this.onDispatch(addMqtt(tempObj.msg))
                break;

            case 'Sync':
                if (this.clientId !== tempObj.origin) {
                    const tempAction = { ...tempObj.action, noProp: true };
                    this.onDispatch(tempAction);
                }
                break;


            case 'Clean':
                console.log("Navigate Called");
                const state = store.getState();
                const user = state.user;
                const dispatch = store.dispatch;
                try {
                    logout(user, dispatch);
                    eventBus.emit('navigate', '/signin');
                } catch (err) {
                    console.log('Failed to logout via WebSocket:', err);
                }
                break;

            case 'User':
                console.log("User Sessions Count", tempObj.msg);
                this.onDispatch(setNumConnections(tempObj.msg));
                break;

            default:
                // console.log("Unhandled WebSocket message type:", tempObj.type);
                break;
        }
    }
}

import { ErrorMessage, SuccessMessage } from "../components/UI Components/AlertMessage";
import { eventBus } from "../functions/User Access Functions/event_bus";
import { logout } from "../functions/User Access Functions/logout_service";
// import { mcaInfo, updateDownloadProgress, resetMQTT, sendDataToRedux, serverConnected, serverDisconnected, setSessions, setVoltage, sendRoiDataToRedux, updateAgmValues, updateSpeedValues, updateAgmControls, mqttConnected, setTelemetryStatus, updateSettings, setPeaks, addMQTT } from "../../../redux_stores/actions";
// import { serverConnected, serverDisconnected, updateDownloadProgress, mqttConnected, setSessions}  from "../../../redux_stores/actions";
import { v4 as uuidv4 } from 'uuid';
// import { store } from "../../../redux_stores/store";

import { WorkerPool } from "./WorkerPool";
import { changeConnectionState, setMqtt, setNumConnections } from "../store/connectionSlice";
import { updateDownloadProgress } from "../store/updateSlice";
import { store } from "../store/store";
// import { ChartData } from "../Program Functions/";


/**
 * Manages a WebSocket connection and processes messages with a pool of Web Workers.
 */
export class WebSocketClient {
    /**
     * @param {string} url - The URL of the WebSocket server.
     * @param {Function} onDispatch - Function to dispatch actions.
     */
    constructor(url, onDispatch) {
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
        console.log("----------------------------CREATED NEW WEBSOCKET SESSION------------------------------");

        this.workerPool = new WorkerPool(10, 'worker.js');
        this.workerPool.onProcessedData = this.handleProcessedData.bind(this);
        this.startHeartbeat();
        WebSocketClient.instance = this;
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
            this.workerPool.postMessage(event.data);
        };

        this.socket.onclose = () => {
            //   console.log('Disconnected from the server');
            ErrorMessage("Disconnected from MQTT Server");
            this.isConnected = false;
            this.onDispatch(changeConnectionState(false));
        };
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
        const agmControls = store.getState().agmControls;

        switch (tempObj.type) {
            // case 'agm':
            //     if (tempObj.msg.split(',')[0] === 'volts') {
            //         this.onDispatch(setVoltage('xagm/hs1', tempObj.msg.split(',')[1]));
            //     } else {
            //         const cpm = tempObj.msg.split(',')[1];
            //         let smoothedCpm = 0;
            //         const alpha = agmControls.alpha;
            //         smoothedCpm = alpha * cpm + (1 - alpha) * smoothedCpm;
            //         const mSv = smoothedCpm * agmControls.uSvhr / (1000 * 60 * 60) + agmControls.mSv;
            //         const mR = smoothedCpm * agmControls.mRhr / (60 * 60) + agmControls.mR;

            //         this.onDispatch(updateAgmControls('mSv', mSv));
            //         this.onDispatch(updateAgmControls('mR', mR));

            //         const agmArr = [smoothedCpm, smoothedCpm * agmControls.mRhr, smoothedCpm * agmControls.uSvhr, smoothedCpm * agmControls.uSvhr / 1000, mSv, mR];
            //         this.onDispatch(updateAgmValues(`xagm/hs1`, agmArr));
            //     }
            //     break;

            // case 'speed':
            //     const speedCpm = tempObj.msg.split(',')[1];
            //     const smoothedSpeedCpm = 0;
            //     const speedAlpha = agmControls.alpha;
            //     const smoothedSpeed = speedAlpha * speedCpm + (1 - speedAlpha) * smoothedSpeedCpm;
            //     const speedArr = tempObj.msg.split(',').slice(1, 7);
            //     speedArr[0] = smoothedSpeed;
            //     this.onDispatch(updateSpeedValues(`xagm/hs1`, speedArr));
            //     break;

            // case 'history':
            //     console.log('------------->', tempObj.msg);
            //     break;

            // case 'info':
                // Handle 'info' type if necessary
                // break;

            case 'error':
                ErrorMessage(tempObj.msg);
                break;

            // case 'spectrum':
            //     const spectrumData = JSON.parse(tempObj.msg);
            //     // console.log('spectrumData', spectrumData);
            //     if (spectrumData && Array.isArray(spectrumData.spectrum)) {
            //         const mappedData = spectrumData.spectrum.map((value, index) => {
            //             const xValue = index + 1;
            //             return {
            //                 x: xValue,
            //                 y: value,
            //             };
            //         });
            //         this.onDispatch(setTelemetryStatus('CONNECTED'));
            //         this.onDispatch(sendDataToRedux(mappedData));

            //         clearTimeout(this.telemetryTimer);
            //         this.telemetryTimer = setTimeout(() => {
            //             this.onDispatch(setTelemetryStatus('NOT CONNECTED'));
            //         }, 15000);
            //     }
            //     break;


            // case 'roiData':
            //     const roiData = JSON.parse(tempObj.msg);
            //     console.log('ROI Data:', roiData);
            //     this.onDispatch(sendRoiDataToRedux(roiData));
            //     break;

            // case 'peaks':
            //     const peaks = JSON.parse(tempObj.msg);
            //     console.log('peaks', peaks);
            //     this.onDispatch(setPeaks(peaks))
            //     break

            // case 'settings':
            //     const settingsCSV = tempObj.msg;
            //     const settingsArray = settingsCSV.split(',');
            //     const settings = {
            //         liveTime: settingsArray[0],
            //         startTime: settingsArray[1],
            //         elapsedTime: settingsArray[2],
            //         deadTime: settingsArray[3],
            //         serialNumber: settingsArray[4],
            //         version: settingsArray[5],
            //         dateMeasurement: settingsArray[6],
            //         endMeasurement: settingsArray[7]
            //     };
            //     this.onDispatch(updateSettings(settings));
            //     break;

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
            
            // case 'activetopics':
            //     this.onDispatch(addMQTT(tempObj.msg))
            //     break;

            case 'Sync':
                if (this.clientId !== tempObj.origin) {
                    const tempAction = { ...tempObj.action, noProp: true };
                    this.onDispatch(tempAction);
                }
                break;

            // case 'xspecInfoHist':
            //     console.log('xspecInfo', tempObj.msg);
            //     this.onDispatch(mcaInfo(tempObj.msg));
            //     break;

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
                console.log("Unhandled WebSocket message type:", tempObj.type);
                break;
        }
    }
}

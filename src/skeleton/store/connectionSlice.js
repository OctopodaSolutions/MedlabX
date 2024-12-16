import { createSlice } from '@reduxjs/toolkit';

// Action type constants (if previously defined elsewhere, import them instead)
const ADD_MQTT = 'ADD_MQTT';
const RESET_MQTT_CONNECTIONS = 'RESET_MQTT_CONNECTIONS';

const initialState = [];

const mqttConnectionSlice = createSlice({
  name: 'mqttConnections',
  initialState,
  reducers: {
    addMqtt(state, action) {
      const getStatus = (timestamp) => {
        const currentTime = Date.now();
        const timeDifference = (currentTime - timestamp) / 1000; // in seconds
        return timeDifference <= 5 ? 'active' : 'inactive';
      };
      
      // Convert payload to the desired array format
      const result = Object.entries(action.payload).map(([key, value]) => {
        const { timestamp } = JSON.parse(value); 
        const status = getStatus(timestamp);
        return [key, status];
      });
      
      // Replace the state with the new result array
      return [...result];
    },
    resetMqttConnections() {
      return [];
    },
  },
});

// Export actions and reducer
export const { addMqtt, resetMqttConnections } = mqttConnectionSlice.actions;
export const mqttConnectionReducer = mqttConnectionSlice.reducer;


// import { createSlice } from '@reduxjs/toolkit';

// Action type constants (import or define these)
const ENABLE_DEMO_MODE = 'ENABLE_DEMO_MODE';
const SET_MQTT = 'SET_MQTT';
const CHANGE_CONNECTION_STATE = 'CHANGE_CONNECTION_STATE';
const SET_HTTP_SERVER_ADDR = 'SET_HTTP_SERVER_ADDR';
const SET_HTTP_SERVER_PORT = 'SET_HTTP_SERVER_PORT';
const SET_NUM_CONNECTIONS = 'SET_NUM_CONNECTIONS';
const SET_COMMS = 'SET_COMMS';

// Ensure Connection_Settings is defined or imported
// Example:
// const Connection_Settings = {
//   DEMO_MODE: false,
//   MQTT_CONNECTED: false,
//   SERVER_CONNECTED: false,
//   HTTP_SERVER_ADDR: '',
//   HTTP_SERVER_PORT: '',
//   // ... include all required fields
// };
// import { Connection_Settings } from './path/to/connectionSettings';

const initialState1 = {
    HTTP_SERVER_ADDR: '',
    HTTP_SERVER_PORT: '',
    MQTT_SERVER_ADDR: '',
    MQTT_SERVER_PORT: '',
    MQTT_CLIENT_NAME: '',
    WEBSOCKET_SERVER_ADDR: '',
    WEBSOCKET_SERVER_PORT: '',
    NUMBER_OF_LINES: '',
    DEMO_MODE: false,
    SERVER_CONNECTED: false,
    NUM_MSGS: 1000,
    TELE_DELAY: 3000,
    MQTT_CONNECTED: false
};

const connectionSlice = createSlice({
  name: 'connection',
  initialState1,
  reducers: {
    enableDemoMode(state, action) {
      state.DEMO_MODE = action.payload;
    },
    setMqtt(state, action) {
      state.MQTT_CONNECTED = action.payload;
    },
    changeConnectionState(state, action) {
      state.SERVER_CONNECTED = action.payload;
    },
    setHttpServerAddr(state, action) {
      state.HTTP_SERVER_ADDR = action.payload;
    },
    setHttpServerPort(state, action) {
      state.HTTP_SERVER_PORT = action.payload;
    },
    setNumConnections(state, action) {
      state.NUM_SESSIONS = action.payload;
    },
    setComms(state, action) {
      const payload = action.payload;
      state.HTTP_SERVER_ADDR = payload.HTTP_SERVER_ADDR || 'Undefined';
      state.HTTP_SERVER_PORT = payload.HTTP_SERVER_PORT || 'Undefined';
      state.MQTT_SERVER_ADDR = payload.MQTT_SERVER_ADDR || 'Undefined';
      state.MQTT_SERVER_PORT = payload.MQTT_SERVER_PORT || 'Undefined';
      state.MQTT_CLIENT_NAME = payload.MQTT_CLIENT_NAME || 'Undefined';
      state.WEBSOCKET_SERVER_ADDR = payload.WEBSOCKET_SERVER_ADDR || 'Undefined';
      state.WEBSOCKET_SERVER_PORT = payload.WEBSOCKET_SERVER_PORT || 'Undefined';
      state.NUM_MSGS = payload.NUM_MSGS || '1000';
      state.TELE_DELAY = payload.TELE_DELAY || '3000';
      state.DEMO_MODE = payload.DEMO_MODE || false;
      state.MCA_MODE = payload.MCA_MODE || false;
      state.NUM_MCA = payload.NUM_MCA || '0';
      state.NUM_AGM = payload.NUM_AGM || '0';
      state.NUM_LINES = payload.NUM_LINES || '0';
      state.NUM_MQTT = payload.NUM_MQTT || '0';
      state.DEBUG_LEVEL = payload.DEBUG_LEVEL || 'info';
      state.REPORT_TEMPLATE = payload.REPORT_TEMPLATE || '';
    },
  },
});

// Export actions and reducer
export const {
  enableDemoMode,
  setMqtt,
  changeConnectionState,
  setHttpServerAddr,
  setHttpServerPort,
  setNumConnections,
  setComms,
} = connectionSlice.actions;

export const connectionReducer = connectionSlice.reducer;
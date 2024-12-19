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
    resetMQTT() {
      return [];
    },
  },
});

// Export actions and reducer
export const { addMqtt, resetMQTT } = mqttConnectionSlice.actions;
export const mqttConnectionReducer = mqttConnectionSlice.reducer;
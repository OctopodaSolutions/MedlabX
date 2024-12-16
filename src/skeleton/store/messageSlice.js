import { createSlice } from '@reduxjs/toolkit';

// If these constants were previously defined elsewhere, import them accordingly.
const ADD_MESSAGE_FROM_HARDWARE = 'ADD_MESSAGE_FROM_HARDWARE';
const ADD_MESSAGE_FROM_SOFTWARE = 'ADD_MESSAGE_FROM_SOFTWARE';
const RESET_MESSAGES = 'RESET_MESSAGES';
const GET_LATEST_MQTT_MESSAGE = 'GET_LATEST_MQTT_MESSAGE';

const initialState = [];

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessageFromHardware: (state, action) => {
      let newMessages = [...state, action.payload];
      if (newMessages.length > (Number(action.payload.maxMsgs) || 5000)) {
        newMessages = newMessages.slice(1);
      }
      return newMessages;
    },
    addMessageFromSoftware: (state, action) => {
      let newMessages = [...state, action.payload];
      if (newMessages.length > (Number(action.payload.maxMsgs) || 5000)) {
        newMessages = newMessages.slice(1);
      }
      return newMessages;
    },
    resetMessages: () => {
      return [];
    },
    getLatestMqttMessage: (state) => {
      // This action does not return a single message. Reducers must return state.
      // Instead, you can create a selector to retrieve the last message from the store.
      return state;
    }
  }
});

// Exporting actions
export const {
  addMessageFromHardware,
  addMessageFromSoftware,
  resetMessages,
  getLatestMqttMessage
} = messagesSlice.actions;

// Exporting reducer
export const messageReducer = messagesSlice.reducer;

// Example selector to get the latest message
// export const selectLatestMessage = (state) =>
//   state.messages.length > 0 ? state.messages[state.messages.length - 1] : null;
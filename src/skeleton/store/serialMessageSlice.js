import { createSlice } from '@reduxjs/toolkit';

// If previously defined constants, import them, or define here:
const ADD_SERIAL_FROM_HARDWARE = 'ADD_SERIAL_FROM_HARDWARE';
const ADD_SERIAL_FROM_SOFTWARE = 'ADD_SERIAL_FROM_SOFTWARE';
const RESET_SERIAL = 'RESET_SERIAL';

const initialState = [];

const serialMessagesSlice = createSlice({
  name: 'serialMessages',
  initialState,
  reducers: {
    addSerialFromHardware(state, action) {
      let newMessages = [...state, action.payload];
      if (newMessages.length > (Number(action.payload.maxMsgs) || 50)) {
        newMessages = newMessages.slice(1);
      }
      return newMessages;
    },
    addSerialFromSoftware(state, action) {
      let newMessages = [...state, action.payload];
      if (newMessages.length > (Number(action.payload.maxMsgs) || 50)) {
        newMessages = newMessages.slice(1);
      }
      return newMessages;
    },
    resetSerial() {
      return [];
    }
  }
});

export const { addSerialFromHardware, addSerialFromSoftware, resetSerial } = serialMessagesSlice.actions;
export const serialMessagesReducer = serialMessagesSlice.reducer;
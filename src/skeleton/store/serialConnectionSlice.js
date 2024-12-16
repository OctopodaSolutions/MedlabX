import { createSlice } from '@reduxjs/toolkit';

// If previously defined constants, import them, or define here:
const ADD_SERIAL = 'ADD_SERIAL';
const RESET_SERIAL_CONNECTIONS = 'RESET_SERIAL_CONNECTIONS';

const initialState = [];

const serialConnectionSlice = createSlice({
  name: 'serialConnections',
  initialState,
  reducers: {
    addSerial(state, action) {
      // action.payload could be a single object or an array
      const itemsToAdd = Array.isArray(action.payload) ? action.payload : [action.payload];
      const newItems = itemsToAdd.filter(newItem =>
        !state.some(existingItem => existingItem.path === newItem.path)
      );
      return [...state, ...newItems];
    },
    resetSerialConnections() {
      return [];
    }
  }
});

export const { addSerial, resetSerialConnections } = serialConnectionSlice.actions;
export const serialConnectionReducer = serialConnectionSlice.reducer;
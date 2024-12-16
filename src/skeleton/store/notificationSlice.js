import { createSlice } from '@reduxjs/toolkit';

// If these constants were previously defined elsewhere, import them:
const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';
const REMOVE_ALL_NOTIFICATION = 'REMOVE_ALL_NOTIFICATION';

const initialState = {
  notifications: [],
  nextId: 0
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action) {
      state.notifications.push({ ...action.payload, id: state.nextId++ });
    },
    removeNotification(state, action) {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    removeAllNotification(state) {
      state.notifications = [];
    }
  }
});

// Export generated actions
export const { addNotification, removeNotification, removeAllNotification } = notificationSlice.actions;

// Export the reducer to use in the store
export const notificationReducer = notificationSlice.reducer;
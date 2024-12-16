import { createSlice } from '@reduxjs/toolkit';

const initialDownloadState = {
  downloadProgress: null,
};

const downloadSlice = createSlice({
  name: 'download',
  initialState: initialDownloadState,
  reducers: {
    updateDownloadProgress(state, action) {
      // The original reducer returned action.payload directly.
      // Here, if action.payload is the entire state object, we can just return it.
      return action.payload;
    },
  },
});

const initialDeviceState = {
  status: [],
};

const deviceSlice = createSlice({
  name: 'device',
  initialState: initialDeviceState,
  reducers: {
    updateDeviceInfo(state, action) {
      return action.payload;
    },
  },
});

// Export actions
export const { updateDownloadProgress } = downloadSlice.actions;
export const { updateDeviceInfo } = deviceSlice.actions;

// Export reducers
export const downloadReducer = downloadSlice.reducer;
export const deviceReducer = deviceSlice.reducer;
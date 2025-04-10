import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  boxPlugins: Array(6).fill(null),
  pluginNames: Array(6).fill("")
};

const dashboardSlice = createSlice({
  name: 'box',
  initialState,
  reducers: {
    setBoxPlugins(state, action) {
      state.boxPlugins = action.payload;
    },
    setPluginNames(state, action) {
        state.pluginNames = action.payload;
    },
  },
});

export const { setBoxPlugins, setPluginNames } = dashboardSlice.actions;

export const dashboardReducer = dashboardSlice.reducer;

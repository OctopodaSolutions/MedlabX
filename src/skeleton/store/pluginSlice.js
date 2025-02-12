import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  group: [],  // Stores plugin UI config [{config: {mqtt: Array(1), route: 'xspec1', pluginType: 'xspecPlugin'},react: "/plugins/plugin1/reactPlugin.js" }]
  plugins: [], // Stores plugin metadata like instanceId,pluginType [{instanceId: 'xspec1', pluginType: 'xspecPlugin', pluginData: ''}]
};

const pluginSlice = createSlice({
  name: 'plugin',
  initialState,
  reducers: {
    // Action to set plugin UI components
    setGroup: (state, action) => {
      state.group = action.payload;
    },
    // Action to set plugin metadata
    setPlugins: (state, action) => {
      state.plugins = action.payload;
    },
    // Action to add a plugin to the plugins list
    addPlugin: (state, action) => {
      const { instanceId, pluginData } = action.payload;
      state.plugins = state.plugins.map((obj)=>obj.instanceId == instanceId ? {...obj, pluginData : pluginData}:obj)
    },
    // Action to update a plugin in the plugins list
    updatePlugin: (state, action) => {
      const { instanceId, pluginData } = action.payload;
      if (state.plugins[instanceId]) {
        state.plugins[instanceId] = {
          ...state.plugins[instanceId],
          ...pluginData,
        };
      }
    },
    // Action to remove a plugin from the plugins list
    removePlugin: (state, action) => {
      const { instanceId } = action.payload;
      delete state.plugins[instanceId];
    },
  },
});

// Export actions
export const { setGroup, setPlugins, addPlugin, updatePlugin, removePlugin } = pluginSlice.actions;

// Export reducer
export const pluginReducer = pluginSlice.reducer;


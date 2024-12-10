// fallbackStore.js
import { configureStore } from '@reduxjs/toolkit';
// Import your plugin reducers here if needed
import pluginReducer from './custom/store/slice';

export function createFallbackStore() {
    return configureStore({
        reducer: {
            pluginData: pluginReducer
        }
    });
}
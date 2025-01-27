import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createFallbackStore, persistor } from './skeleton/store/fallbackStore';
import CustomTab from './custom/CustomTab';
import { Store } from 'redux';
import { WorkerPool } from './WorkerPool';
import { AppRouter } from './AppRouter';
import './index.css';
import { PersistGate } from 'redux-persist/integration/react';


declare global {
    interface Window {
        __APP_CONFIG__?: { isPluginMode: boolean };
    }
}

const isPluginMode = window.__APP_CONFIG__?.isPluginMode === true;

// Initialize accordingly
if (isPluginMode) {
console.log('Running in plugin mode');
} else {
    const workerPool = new WorkerPool(4);
    console.log('Worker pool initialized:', workerPool);
    standaloneRender(workerPool);
    console.log('Running in standalone mode');
}

function standaloneRender(workerPool:WorkerPool) {
    const store = createFallbackStore(workerPool);
    const container = document.getElementById('root');

    if (!container) {
        console.error('No root element found for standalone mode.');
        return;
    }

      // Example: send a message to the first worker
    workerPool.workers[0].postMessage('Hello Worker!');

    workerPool.workers[0].onmessage = (e) => {
        console.log('Response from worker:', e.data);
    };

    const root = ReactDOM.createRoot(container);
    root.render(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <AppRouter/>
            </PersistGate>
        </Provider>
    );  
}



/**
 * Initialize and render the plugin UI within a given container element.
 * @param {object} store - The parent’s Redux store.
 * @param {string} containerId - The DOM element ID where the plugin should mount.
 * @param {function} injectReducer - A function passed from the parent to dynamically add reducers.
 */
export function initializePluginUI(store:Store, containerId:string, injectReducer:any) {
    // Dynamically inject the plugin’s reducers into the parent store
    Object.entries({}).forEach(([key, reducer]) => {
        injectReducer(store, key, reducer);
    });

    // Render the plugin's main component into the specified container
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID "${containerId}" not found.`);
        return;
    }
    console.log("Render UI from Child!!!!!!!");

    const root = ReactDOM.createRoot(container);
    root.render(
        <Provider store={store}>
            <CustomTab />
        </Provider>
    );
}

// Optional: Export metadata or config about the plugin
export const redux = {
    reducers: {}
};
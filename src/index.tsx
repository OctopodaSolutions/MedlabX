import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createFallbackStore } from './skeleton/store/fallbackStore';
import CustomTab from './custom/CustomTab';
import Layout from './skeleton/Layout';
import { Store } from 'redux';



function standaloneRender() {
    const store = createFallbackStore();
    const container = document.getElementById('root');
    if (!container) {
        console.error('No root element found for standalone mode.');
        return;
    }

    const root = ReactDOM.createRoot(container);
    root.render(
        <Provider store={store}>
           <Layout children={<CustomTab/>}/>
        </Provider>
    );
}

// If running as a standalone app (e.g., no parent call to initializePluginUI)
// We can check an environment variable or simply run this code by default:
if (process.env.__PLUGIN_PARENT__) {
    console.log("Rendering in Standalone Mode Child App!!!!!!!!!");
    // Assume standalone mode
    standaloneRender();
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
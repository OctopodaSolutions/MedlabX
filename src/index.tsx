// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import Layout from './skeleton/Layout';
import CustomTab from './custom/CustomTab';
// import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// import { persistor, store } from '../src/skeleton/store/';

// // // Render the plugin
// // ReactDOM.render(
// //     <React.StrictMode>
// //         <Layout>
// //             <CustomTab />
// //         </Layout>
// //     </React.StrictMode>,
// //     document.getElementById('root')
// // );

// const root = document.getElementById('root');
// ReactDOM.createRoot(root).render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         <CustomTab />
//       </PersistGate>
//     </Provider>
//   </React.StrictMode>
// );

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
// Import your main plugin component
// import MainPluginComponent from './custom/components/MainPluginComponent';
// Import (or define) your plugin’s reducers as an object: { reducerKey: reducerFunction }


/**
 * Initialize and render the plugin UI within a given container element.
 * @param {object} store - The parent’s Redux store.
 * @param {string} containerId - The DOM element ID where the plugin should mount.
 * @param {function} injectReducer - A function passed from the parent to dynamically add reducers.
 */
export function initializePluginUI(store, containerId, injectReducer) {
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
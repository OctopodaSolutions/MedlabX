import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createFallbackStore, persistor } from './skeleton/store/fallbackStore';
import CustomTab from './custom/CustomTab';
import { WorkerPool } from './WorkerPool';
import AppRouter from './AppRouter';
import './index.css';
import { PersistGate } from 'redux-persist/integration/react';

if (!window.pluginComponents) {
    window.pluginComponents = {};
}


const workerPool = new WorkerPool(4);
console.log('Worker pool initialized:', workerPool);
standaloneRender(workerPool);
console.log('Running in standalone mode');


function standaloneRender(workerPool) {
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
                <AppRouter />
            </PersistGate>
        </Provider>
    );
}

// fallbackStore.js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import axios from 'axios';
import { WebSocketClient } from '../utils/wss_util';
import { createReducerManager } from './reducerManager'; // Path to your dynamic reducer manager
import rootReducer from './rootReducer';

let store;
let websocketClient;
/** @type {any} */
let persistor;

// WebSocket message handler
const onMessage = (dataFunc) => {
    store.dispatch(dataFunc);
};

// Redux Persist Config
const persistConfig = {
    key: 'root',
    storage,
    timeout: 10000,
};

// Static reducers (initial reducers)
const staticReducers = {
  user: (state = { name: '' }, action) => state, // Example static reducer
};

// Create a reducer manager to handle dynamic reducers
const reducerManager = createReducerManager(rootReducer);

// Create a persisted reducer with dynamic reducers
const persistedReducer = persistReducer(persistConfig, reducerManager.reduce);

// Custom middleware
const actionLoggerMiddleware = store => next => action => {
  return next(action);
};

const syncMiddleware = (store) => (next) => (action) => {
    if (action.sync && action.noProp === false) {
        websocketClient.sendMsgToServer(action);
    }
    if (action.type === 'ACTIVATE' || action.type === 'DEACTIVATE') {
        websocketClient.changeRealTime();
    }
    return next(action);
};

const apiMiddleware = (store) => (next) => (action) => {
    if (action.type === 'API_CALL') {
        const state = store.getState();
        const token = state.auth.token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return next(action);
};

// Create store with dynamic reducer support
export function createFallbackStore(workers) {
    console.log("Creating Fallback Store with dynamic reducer manager");
    websocketClient = new WebSocketClient('wss://localhost:444', onMessage, workers);
    
    // Create store with the persisted reducer and middleware
    store = createStore(
        persistedReducer,
        applyMiddleware(
            thunk,
            apiMiddleware, 
            actionLoggerMiddleware,
            syncMiddleware
        )
    );
    persistor = persistStore(store);
    // Extend store with the reducer manager for dynamic reducer management
    store.reducerManager = reducerManager;
    
    return store;
}

export { store, websocketClient, persistor };

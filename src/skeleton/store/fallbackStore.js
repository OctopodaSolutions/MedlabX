// fallbackStore.js
import { configureStore } from '@reduxjs/toolkit';
import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';
import { WebSocketClient } from '../utils/wss_util';
import axios from 'axios';
let store;
let websocketClient;

const onMessage = (dataFunc) => {
    // console.log("DataFunc",dataFunc)
    store.dispatch(dataFunc);
  };
  

// export const websocketClient = new WebSocketClient('wss://localhost:444',onMessage);

const persistConfig = {
    key: 'root',
    storage,
    timeout: 10000,
  };

const persistedReducer = persistReducer(persistConfig,rootReducer);
const actionLoggerMiddleware = store => next => action => {
  // if(action.type!=='ADD_MESSAGE_FROM_HARDWARE' && action.type!=='ADD_LAST_MESSAGE_TO_RUN'){
  //   console.log('Dispatching action:', action);
  // }
  return next(action);
};

const syncMiddleware=(store) =>( next) => (action) =>{
    if(action.sync && action.noProp==false ){
      console.log("Sync Action Called",action);
      websocketClient.sendMsgToServer((action));
      // return next(null);
    }
  
    if(action.type=='ACTIVATE' || action.type=='DEACTIVATE'){
      websocketClient.changeRealTime();
    }
      // console.log("Non-Sync Action Called",action);
      return next(action);
    
    // if()
  }

  const apiMiddleware = (store) =>( next) => (action) => {
    if (action.type === 'API_CALL') {
      // console.log("ADDING BEARER TOKEN");
      const state = store.getState();
      const token = state.auth.token;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return next(action);
  };
  

export function createFallbackStore(workers) {
    console.log("!!!!!!!!!!!!!!!! Creating Fallback Store !!!!!!!!!!!!!");
    websocketClient = new WebSocketClient('wss://localhost:444',onMessage,workers);
    store = createStore(
        persistedReducer,
        applyMiddleware(
          thunk,
          apiMiddleware, 
          actionLoggerMiddleware,
          syncMiddleware
          )
      );
      return store;
}


export  {store };
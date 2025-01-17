// reducerManager.js

import { combineReducers } from 'redux';

// Create the reducer manager
export const createReducerManager = (initialReducers) => {
  const reducers = { ...initialReducers };
  let combinedReducer = combineReducers(reducers);

  return {
    getReducers: () => reducers,

    // Add a set of reducers under a key
    addSet: (key, reducerSet) => {
      if (!reducers[key]) {
        reducers[key] = combineReducers(reducerSet);
        combinedReducer = combineReducers(reducers);
      }
    },

    removeSet: (key) => {
      if (reducers[key]) {
        delete reducers[key];
        combinedReducer = combineReducers(reducers);
      }
    },

    reduce: (state, action) => combinedReducer(state, action),
  };
};

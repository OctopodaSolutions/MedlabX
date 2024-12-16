// src/utils/eventBus.js
// import { EventEmitter } from 'events';
// //
// export const eventBus = new EventEmitter();
import mitt from 'mitt';

export const eventBus = mitt();

// Usage is similar to the previous example

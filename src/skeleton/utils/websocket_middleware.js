// websocketMiddleware.js
/**
 * Middleware for handling WebSocket connections in Redux.
 * 
 * @function
 * @param {Object} store - The Redux store.
 * @param {Function} store.dispatch - The dispatch function of the Redux store.
 * @param {Function} store.getState - The function to get the current state of the Redux store.
 * 
 * @returns {Function} A middleware function that handles WebSocket actions.
 */
export const websocketMiddleware = (function() {
    let socket = null;

    /**
     * Handles incoming WebSocket messages.
     * 
     * @param {WebSocket} ws - The WebSocket instance.
     * @param {Object} store - The Redux store.
     * @param {Function} store.dispatch - The dispatch function of the Redux store.
     * @param {Function} store.getState - The function to get the current state of the Redux store.
     * 
     * @returns {Function} A function that processes the WebSocket message event.
     */
    const onMessage = (ws, store) => (event) => {
        const { dispatch, getState } = store;
        const state = getState();
        const actionData = JSON.parse(event.data);
        console.log("ActionData from Websocket Middleware", actionData);
        
        // Process the incoming data and dispatch actions as needed
        // Example: dispatch({ type: 'UPDATE_DATA', payload: actionData });
    };

    return store => next => action => {
        switch (action.type) {
            case 'WEBSOCKET_CONNECT':
                if (socket !== null) {
                    socket.close();
                }

                // Initialize a new WebSocket connection and set up event listeners
                socket = new WebSocket(action.payload.url);
                socket.onmessage = onMessage(socket, store);

                break;

            // Handle other WebSocket-related actions here
            // Example: case 'WEBSOCKET_SEND': ...

            default:
                return next(action);
        }
    };
})();

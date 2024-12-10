// preload.js

// Import the ipcRenderer module from Electron and assign it to window.ipcRenderer for renderer process communication
window.ipcRenderer = require('electron').ipcRenderer;

const { contextBridge, ipcRenderer } = require('electron');

/**
 * Exposes an API to the renderer process for secure communication with the main process.
 * The API is available globally in the renderer process under the 'electronAPI' object.
 */
contextBridge.exposeInMainWorld('electronAPI', {
    /**
     * Sends a Redux action to the main process.
     * 
     * @param {Object} action - The Redux action to send to the main process.
     */
    sendReduxAction: (action) => ipcRenderer.send('redux-action', action),
});

contextBridge.exposeInMainWorld('electron', {
    getConfig: () => ipcRenderer.invoke('get-config'),
});

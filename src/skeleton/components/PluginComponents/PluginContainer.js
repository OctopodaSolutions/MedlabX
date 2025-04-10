import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { store, websocketClient } from "../../store/fallbackStore";
import { Server_Addr } from "../../utils/medlab_constants";
import { axiosInstance } from "../../functions/API Calls/auth_interceptor";

const PluginRenderer = ({ plugins }) => {

    const injectReducer = (store, key, reducer) => {
        // Combine the existing reducers with the new one
        let pluginData = store.getState();
        if (!pluginData[key]) {
            console.log('---------before', store.getState());
            store.reducerManager.addSet(key, reducer);
            store.replaceReducer(store.reducerManager.reduce);
            console.log('---------after', store.getState());
        }
    };

    const loadPluginWithRetry = (pluginType, instanceId, index, retries = 3, delay = 3000) => {
        const attemptLoad = (remainingRetries) => {
            if (window.pluginInstances && window.pluginInstances[pluginType]) {
                window.pluginInstances[pluginType].initializePluginUI( store, instanceId, `plugin-container-${index}`, injectReducer, websocketClient, Server_Addr, axiosInstance);
                // window.pluginInstances[instanceId].initializePluginUI(store, instanceId, `plugin-container-${index}`, injectReducer, websocketClient, Server_Addr, axiosInstance)
            } else {
                if (remainingRetries > 0) {
                    console.error(`initializePluginUI not found for ${instanceId}. Retrying in ${delay / 1000} seconds...`);
                    setTimeout(() => attemptLoad(remainingRetries - 1), delay);
                } else {
                    console.error(`Failed to load plugin ${instanceId} after multiple attempts.`);
                }
            }
        };

        attemptLoad(retries);
    };

    useEffect(() => {
        let pluginContainerData;
        try {
            pluginContainerData = document.getElementById('plugin-container-0').textContent;
        } catch (err) {
            console.log('Container not yet created');
        }

        if (plugins.length > 0 && pluginContainerData === 'Loading') {
            plugins.forEach(({ instanceId, pluginType }, index) => {
                loadPluginWithRetry(pluginType, instanceId, index);
            });
        }
    }, [plugins]);

    return (
        <>
            {/* You can return null or some loading UI here if needed */}
        </>
    );
};

export default PluginRenderer;

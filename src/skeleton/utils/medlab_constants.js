// import { useSelector } from "react-redux";



// import { store } from "./store";
let config = null;

export async function fetchConfig() {
  if (config) return config; // Return cached config if already fetched
  try {
    console.log("Running fetchConfig");
    const response = await fetch('/config.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    config = await response.json();
    return config;
  } catch (error) {
    console.error('Error fetching config:', error);
    try {
      console.log("Running fetchConfig from preload");

      // This calls the preload-exposed function
      config = window.configAPI.getConfig();
    } catch (error) {
      console.log('Error reading config from preload:', error);
    }
    throw error; // Re-throw error for handling in caller
  }
}

async function getServerAddr() {
  try {
    const data = await fetchConfig();
    return `${data.HTTP_SERVER_ADDR}`;
  } catch (error) {
    return 'http://development.nokitechnologies.com';
  }
}

export const Server_Addr = await getServerAddr();


export const Connection_Settings = {
    HTTP_SERVER_ADDR: '',
    HTTP_SERVER_PORT: '',
    MQTT_SERVER_ADDR: '',
    MQTT_SERVER_PORT: '',
    MQTT_CLIENT_NAME: '',
    WEBSOCKET_SERVER_ADDR: '',
    WEBSOCKET_SERVER_PORT: '',
    NUMBER_OF_LINES: '',
    DEMO_MODE: false,
    SERVER_CONNECTED: false,
    NUM_MSGS: 1000,
    TELE_DELAY: 3000,
    MQTT_CONNECTED: false
}

export const PrgObjToArduino = {
  cmd: {
      type: "PrgTestAPI",
      feed: {
          name: "hs1",
          returnFeed: "ss1",
          active: false
      },
      prg: {
          steps: []
      }
  }
}

export const ConnectionDetails =
{
    feeds: [
        {
            "name": "hs1",
            "returnFeed": "ss1",
            "active": false
        }

    ],
    cmd: ""
}

export const MqttConnectionObj = {
    feeds: [{
        name: '',
        returnFeed: '',
    }]
}

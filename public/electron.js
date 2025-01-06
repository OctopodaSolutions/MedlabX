// // Entry point for backend logic
// const express = require('express');
// const CustomApi = require('./custom/customApi');

// const app = express();
// const customApi = new CustomApi();

// app.get('/api/custom', (req, res) => customApi.getCustomData(req, res));

// module.exports = app;


const { app, session, BrowserWindow, screen, ipcMain, dialog, nativeTheme } = require('electron');
const path = require('path');

/**
 * Determines the path to the .env file based on whether the app is packaged.
 * @type {string}
 */
const envPath = app.isPackaged ? path.join(process.resourcesPath, 'resources', '.env') : './.env';
require('dotenv').config({ path: envPath });

/**
 * Determines the path to the config file based on whether the app is packaged.
 * @type {string}
 */
const configPath = app.isPackaged ? path.join(process.resourcesPath, 'resources', 'config.json') : path.join(__dirname, 'config.json');

/**
 * Path to the HTML file to be loaded in the BrowserWindow.
 * @type {string}
 */
let htmlFilePath = `file://${path.join(__dirname, '../build/index.html')}`;

const {mySqlConnection} = require('./skeleton/database'); // Ensure correct path
// Test the connection
mySqlConnection.getConnection((err, connection) => {
  if (err) {
      console.error('Error connecting to MySQL:', err.stack);
      return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
  connection.release();
});

// console.log('htmlfilepath', htmlFilePath);
console.log('App isPackaged:', app.isPackaged);
console.log('Env path:', envPath);
console.log(`App Path: ${app.getAppPath()}`);
console.log(`Directory Path: ${__dirname}`);
console.log('Packaged HTML Path', `file://${path.join(app.getAppPath(), 'build/index.html')}`);
console.log('Config Path: ', configPath);

const { logger } = require('./logger');
logger.info(`Get App Path ${app.getAppPath()}`);
const fs = require('fs');
const Server = require('./skeleton/server');
const demoMode = require(configPath)['DEMO_MODE'];
const numMqtt = require(configPath)['NUM_MQTT'];
// const sendMessage = require('./skeleton/Websocket Calls/messageSender');
const { showErrorDialog } = require('./dialogMessage');
// const { clearAllUserSessions } = require('./skeleton/Redis API/redis');
const { closeAppCompletely, refreshMqtt } = require('./actions');
const wss = require('./skeleton/websockets');
const { restoreFiles, checkIfUpdateAvailable } = require('./update');
const userDataPath = app.getPath('userData');
const backupDir = path.join(userDataPath, 'backup');
let mainWindow = null;
const { MqttManager } = require('./skeleton/mqtt_client');
const redisClient = require('./skeleton/redis');
// const { customStart } = require('./custom');

global.server = new Server();

/**
 * Handles the SIGUSR2 signal for performing cleanup tasks.
 */
const shutdown = async () => {
  logger.info("Shutting down servers...");
  await server.stop();
  app.quit();
};


// Handle SIGINT and SIGTERM signals//
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

/**
 * Creates the main application window.
 */
async function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const scaleFactor = primaryDisplay.scaleFactor;
  logger.debug(`ScaleFactor ${scaleFactor}`);
  logger.info(`Running Directory - ${__dirname}`);
  mainWindow = new BrowserWindow({
    width: process.env.DEFAULT_WINDOW_WIDTH * scaleFactor,
    height: process.env.DEFAULT_WINDOW_HEIGHT * scaleFactor,
    useContentSize: true,
    center: true,
    icon: path.join(__dirname, '/logo_X.ico'),
    frame: false,
    autoHideMenuBar: true,
    darkTheme: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
      webSecurity: false,
      experimentalFeatures: true,
      enablePreferredSizeMode: true,
      enableRemoteModule: true,
      zoomFactor: 1,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.on('close', () => {
    mainWindow.webContents.executeJavaScript('localStorage.clear();');
    dialog.showMessageBox({
      type: 'info',
      buttons: ['Ok', 'Exit'],
      cancelId: 1,
      defaultId: 0,
      title: 'Warning',
      detail: 'Hey, wait! There\'s something you should know...'
    }).then(({ response }) => {
      logger.debug(`response: ${response}`);
      if (response) {
        mainWindow.destroy();
        app.quit();
      }
    });
  });

  if (app.isPackaged) {
    console.log('Loading packaged HTML file:', htmlFilePath);
    mainWindow.loadURL(htmlFilePath);
  } else {
    console.log('Opening DevTools and loading:', process.env.DEVELOPMENT_UI_URL);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
    mainWindow.loadURL(process.env.DEVELOPMENT_UI_URL);
  }

  mainWindow.on('resize', () => {
    let { width, height } = mainWindow.getContentSize();
    logger.debug(`Width: ${width}, Height: ${height}`);
  });

  mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      callback({ requestHeaders: { Origin: '*', ...details.requestHeaders } });
    },
  );
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        'Access-Control-Allow-Origin': ['*'],
        ...details.responseHeaders,
      },
    });
  });
}

app.whenReady()
.then(() => {
  if (fs.existsSync(backupDir)) {
      logger.info('Restoring backup files...');
      return restoreFiles()
          .then(() => {
              fs.rmdirSync(backupDir, { recursive: true });
              logger.info('Backup files restored and backup directory removed.');
          });
  }
}).then(async () => {
    await server.start();
    setTimeout(() => { }, 5000);
  })
  .then(() => {
    logger.info("Clearing LocalStorage Sessions");
    logger.info(`Active Sessions ${wss.getActiveSessions().size}`);
    let localWs = wss.getWebSocketServer();
    localWs.broadcast({ type: "Clean", msg: "Logout All Sessions" });
    setTimeout(() => { }, 2000);

    session.defaultSession.clearStorageData({
      storages: ['localstorage']
    }, () => {
      console.log('Local storage cleared');
    });

    session.defaultSession.cookies.get({})
      .then((cookies) => {
        cookies.forEach(cookie => {
          let url = '';
          url += cookie.secure ? 'https://' : 'http://';
          url += cookie.domain.charAt(0) === '.' ? 'www' : '';
          url += cookie.domain;
          url += cookie.path;

          session.defaultSession.cookies.remove(url, cookie.name)
            .then(() => {
              logger.info(`Removed cookie: ${cookie.name}`);
            }, (error) => {
              console.error(`Error removing cookie ${cookie.name}`, error);
            });
        });
      }).catch((error) => {
        console.error('Error getting cookies', error);
      });
      redisClient.clearAllUserSessions();
  })
  .then(() => {
    session.defaultSession.setCertificateVerifyProc((request, callback) => {
      if (request.hostname === 'localhost') {
        callback(0);
      } else {
        callback(-2);
      }
    });
  })
  .then(()=>{
    global.MqttClient=MqttManager.getInstance(wss.getWebSocketServer());
    refreshMqtt();
  })
  .catch((err)=>{
    logger.error(`Error caught ${err}`);
  })
  .catch((err)=>{
    dialog.showErrorBox("Error in Creating App", String(err));
    logger.error(`Error Creating app ${err}`);
    // app.quit();
    closeAppCompletely();
  })
  .finally(()=>{
    createWindow();
    // customStart();
    // checkIfUpdateAvailable().catch((err)=>{
    //   logger.info("Update not Downloaded");
    // });
  });

app.on('before-quit', async (event) => {
  logger.info("-----------------------------------------------Before Quit Called---------------------------------------------------------");
  await server.stop();
  console.log("Servers Stopped in   Before-Quit");
});
app.on('will-quit', (event) => {
  logger.info("-----------------------------------------------Will Quit Called---------------------------------------------------------");
  // server.stop();
});
app.on('quit', (event) => {
  logger.info("-----------------------------------------------Quit Called---------------------------------------------------------");
  // server.stop();
});

app.on('close', e => { 
  logger.info("----------------------------------------------- Close Called---------------------------------------------------------");
  logger.info("App Close Called");
  e.preventDefault();
  dialog.showMessageBox({
    type: 'info',
    buttons: ['Ok', 'Exit'],
    cancelId: 1,
    defaultId: 0,
    title: 'Warning',
    detail: 'Hey, wait! There\'s something you should know...'
  }).then(({ response, checkboxChecked }) => {
    logger.debug(`response: ${response}`)
    if (response) {
      mainWindow.destroy();
      app.quit();
    }
  })
});


app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('window-all-closed', (event) => {
  logger.info("-----------------------------------------------Window ALL Called---------------------------------------------------------");
  logger.info("App window-all-closed Called");
  server.stop();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('get-config', async () => {
  // const configPath = path.join(__dirname, 'config.json');
  const configData = fs.readFileSync(configPath, 'utf-8');
  return JSON.parse(configData)
});

ipcMain.on('requestMqttState', (event, arg) => {
  let state = MqttClient.getState();
  logger.info(`requestMqttState response ${JSON.stringify(state)}`);
  event.reply('replyMqttState', state);
});

ipcMain.on('requestAppQuit', (event, arg) => {
  mainWindow.close();
});

process.on('uncaughtException', (error) => {
  if (error.code === 'EADDRINUSE') {
    logger.error(`Stopping Servers. Address Busy.`);
    showErrorDialog("Server Unavailable. Try Restarting System", 1);
    // sendMessage({ type: 'error', msg: "Servers Running. Try Restart" });
  } else if (error.code === 'EADDRNOTAVAIL') {
    logger.error(`IP Address not available.`);
    showErrorDialog(`IP Address not available. Try restarting router or check router connections.`);
    // sendMessage({ type: 'error', msg: "IP Address not available. Try restarting router or check router connections." });
  } else {
    logger.error(`Uncaught Exception: ${error.message}`);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at---: ${promise} reason: ${reason}`);
});

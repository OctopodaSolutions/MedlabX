const express = require('express');
const { app } = require('electron');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const http = require('http');
const https = require('https');
const fileUpload = require('express-fileupload');

const RedisStore = require('connect-redis').default;
const { redisClient, flushRedis, clearAllUserSessions } = require('./redis.js');

const { createWebSocketServer, closeWebSocketServer, getWebSocketServer } = require('./websockets');
const server_app = express();
const { logger } = require('../logger.js');
const { version } = require('../../package.json');

const { verifyUser, addUser, getUsers, updateUserDetails, updatePasswordDetails, deleteUserAccount, disconnect, updateConversionFactors} = require('./database.js');
const { showErrorDialog } = require('../dialogMessage.js');
const { restartApp, closeAppCompletely, refreshMqtt } = require('../actions.js');
const { check_for_update, check_if_update_downloaded, installUpdate, checkIfUpdateDownloaded, quitandInstallFromLocal, checkIfUpdateAvailable } = require('../update.js');
const { verifyLicense, verifyDeviceId, isLicenseValid, readLicenseFile } = require('./verify.js');
const cssConfig = app.isPackaged ? path.join(process.resourcesPath, 'resources', 'CssConfig.json') : path.join(app.getAppPath(), 'public/skeleton/Config Files/CssConfig.json');


let key = null;
let cert = null;
let ca = null;
const configPath = app.isPackaged ? path.join(process.resourcesPath, 'resources', 'config.json') : path.join(app.getAppPath(), 'public/config.json');
// const numMqtt=require(configPath)['NUM_MQTT'];
const HTTP_PORT = require(configPath)['HTTP_SERVER_PORT'];
const HTTPS_PORT = require(configPath)['HTTPS_SERVER_PORT'];

let httpsServer;
let httpServer;
let userSessions = 0;

let client = null;

const staticPath = path.join(__dirname, '../../build');
server_app.use(express.static(staticPath));

const templatesDir = path.join(app.getPath('userData'), 'templates');
if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true });
}

/**
 * 
 * @returns certificates path
 */
function getCertificatesPath() {
    return path.join(process.resourcesPath, 'resources/certificates');
}

/**
 * Reads file data
 * @param {String} filename 
 * @returns file data
 */
function loadCertificate(filename) {
    const filePath = path.join(getCertificatesPath(), filename);
    return fs.readFileSync(filePath, 'utf8');
}

/**
 * Get the certificates and read
 */
if (app.isPackaged) {
    const basePath = path.join(process.resourcesPath, 'app.asar.unpacked');
    // configPath = path.join(basePath, 'build/config.json');
    key = loadCertificate('server.key');
    cert = loadCertificate('server.pem');
    ca = loadCertificate('rootCA.pem');
} else {
    // configPath = path.join(app.getAppPath(), 'public/config.json');
    key = fs.readFileSync(path.join(app.getAppPath(), 'certificates', 'server.key'));
    cert = fs.readFileSync(path.join(app.getAppPath(), 'certificates', 'server.pem'));
    ca = fs.readFileSync(path.join(app.getAppPath(), 'certificates', 'rootCA.pem'));
}

// winca({store:['root','my'], ondata:injectCertificates});

// function injectCertificates(pem){
//     https.globalAgent.options.ca = (https.globalAgent.options.ca || []).concat(pem);
// }

/**
 * https options
 */
const httpsOptions = {
    key: key,
    cert: cert,
    ca: ca
};

/**
 * cors options
 */
const corsOptions = {
    origin: function (origin, callback) {
        // logger.info(`Origin for call ${origin}`);
        callback(null, true);
        // if (origin === '*') {
        //     callback(null, true);
        // } else {
        //     callback(new Error('Not allowed by CORS'));
        // }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

/**
 * Exit the app if certificates or key not fount
 */
if (!cert || !key) {
    logger.error('Certificate or key file not found!');
    app.exit();
}

/**
 * Adding middlewares for server
 */
// server_app.use(cors());
server_app.use(cors(corsOptions))
server_app.use(express.json());
server_app.use(cookieParser());

server_app.use(session({
    store: redisClient ? new RedisStore({ client: redisClient }) : undefined, // Use RedisStore if client exists, else default to in-memory store
    secret: process.env.JWT_SECRET || 'NokiXtract10',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000
    }
}));

server_app.use(fileUpload({
    createParentPath: true
}));


// verify the license
let isValid = false;
verifyLicense().then((res) => {
    isValid = res;
}).catch((error) => {
    console.error('An error occurred during license verification:', error.message);
});

let isDeviceId = false;
// Call the verifyDeviceId function

verifyDeviceId().then((isValid) => {
    if (isValid) {
        console.log('License is valid for this device.');
        isDeviceId = true;
    } else {
        console.log('License is not valid for this device.');
    }
}).catch((error) => {
    console.error('An error occurred during Device verification:', error.message);
})

let isValidityLive = isLicenseValid()
/**
 * Authentication token verification
 * @param {Object} req 
 * @param {Object} res 
 * @param {Middleware} next 
 * @returns Success or Failure
 */
const authenticateToken = (req, res, next) => {
    if (isValid && isDeviceId && isValidityLive) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            redisClient.get(`user_session:${decoded.username}`, (err, result) => {
                if (err) {
                    logger.error(`Error from Redis ${err}`);
                    return res.status(401).json({ success: false, message: 'Access denied. Invalid session.' });
                }
                req.user = decoded;
                next();
            });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Invalid token.' });
        }
    } else {
        res.status(400).json({ success: false, message: 'Invalid License.' });
    }
};

/*****************************  Login/Signup APIs ********************************/
/**
 * Serves the html file on /
 */
if(app.isPackaged){
    server_app.get('/', (req, res) => {
        res.sendFile(path.join(staticPath, 'index.html'));
    });
}

/**
 * user login
 */
server_app.post('/login', (request, response) => {
    logger.info(`Login Called for User`);
    try {
        verifyUser(request.body.uname, request.body.pass)
            .then((user) => {
                redisClient.get(`user_session:${user.name}`, (err, session) => {
                    if (err) {
                        logger.error("Redis error:", err);
                        return response.status(500).json({ success: false, message: "Error accessing session store." });
                    }
                    if (session) {
                        logger.info(`User Login Error ${JSON.stringify(session)}`);
                        return response.status(401).json({ success: false, message: "User is already logged in from another session." });
                    } else {
                        const token = jwt.sign(user, process.env.JWT_SECRET);
                        redisClient.set(`user_session:${user.name}`, token, 'EX', 30 * 24 * 60 * 60 * 1000);
                        response.cookie('AuthToken', token, {
                            httpOnly: true,
                            secure: app.isPackaged,
                            sameSite: 'strict',
                            maxAge: 1000 * 60 * 60
                        });
                        let localWs = getWebSocketServer();
                        userSessions++;
                        localWs.broadcast({ type: "User", msg: userSessions });
                        logger.info(`Login Successfull for ${user.name}. Sessions ${userSessions}`);
                        let sts = MqttClient.getStatus();
                        // console.log('----',sts)
                        localWs.broadcast({ type: 'ConnUpdate', msg: `${JSON.stringify({ service: 'mqtt', status: sts })}` });
                        response.json({ success: true, data: { user, token } });

                    }
                });
            })
            .catch((err) => {
                logger.error(`Error from verification ${err}`);
                response.status(500).json({ success: false, msg: err });
            });
    } catch (err) {
        logger.error(`Login Route Error ${err}`);
        response.status(500).json({ success: false, msg: err });
    }
});

/**
 * user logout
 */
server_app.post('/logout', authenticateToken, (req, res) => {
    logger.info(`Logout Called for User`);
    const user = req.body.UID;
    redisClient.del(`user_session:${user.name}`, (err, reply) => {
        if (err) {
            logger.error(`Error during logout:, ${err}`);
            return res.status(500).json({ success: false, message: "An error occurred during logout." });
        }
        userSessions--;
        if (userSessions < 0) userSessions = 0;
        let localWs = getWebSocketServer();
        localWs.broadcast({ type: "User", msg: userSessions });
        logger.info(`User ${user.name} has successfully logged out. Sessions ${userSessions}`);
        res.clearCookie('AuthToken');
        res.json({ success: true, message: "You've been logged out successfully." });
    });
});
/**
 * user signup
 */
server_app.post('/signup', (request, response) => {
    logger.debug(`Signup Called for User`);
    try {
        logger.debug("SignUp Called");
        addUser(request.body.name, request.body.pass, request.body.UID, 0, request.body.access_level, request.body.designation, request.body.email).then((res) => {
            logger.debug(res, "response from signup");
            if (res) {
                response.json({ success: true });
            }
            else {
                response.json({ success: false });
            }
        }).catch((err) => {
            console.error(err);
            response.status(500).json({ success: false, msg: err });
        });

    }
    catch (err) {
        console.error(err);
        response.status(500).json({ success: false });
    }
});
/**
 * Fetch active sessions
 */
server_app.get('/active-sessions', (req, res) => {
    logger.debug(`Active Sessions Requested`);
    res.send(req.sessionStore.sessions);
});


/*****************************  User Details APIs ********************************/

/**
 * Fetch user details
 */
server_app.get('/user_details', authenticateToken, (request, response) => {
    try {
        if (request.query.uid == 'NokiXtract') {
            getUsers().then((res) => {
                response.json({ success: true, data: res })
            }).catch((err) => {
                response.status(500).json({ success: false });

            });
        }
    } catch (err) {
        logger.error(err);
    }
});

/**
 * Update user details
 */
server_app.post('/user_details', (request, response) => {
    try {
        if (request.query.action == 'changePassword') {
            logger.debug(`Change Password Called ${request.body.uname}, ${request.body.pass}`);
            updatePasswordDetails(request.body.uname, request.body.pass).then((res) => {
                if (res) {
                    response.json({ success: true });
                }
                else {
                    response.json({ success: false });
                }
            }).catch((err) => {
                response.status(500).json({ success: false });
            });
        }
        else {
            updateUserDetails(request.body).then((res) => {
                response.json({ success: true, data: res });
            }).catch((err) => {
                response.status(500).json({ success: false });
            });
        }
    } catch (err) {
        console.error(err);
        response.status(500).json({ success: false });
    }
});

/**
 * Delete user 
 */
server_app.delete('/user_details', authenticateToken, (request, response) => {
    deleteUserAccount(request.query.uid).then((res) => {
        response.json({ success: true });
    }).catch(() => {
        response.json({ success: false });
    });
})



/*****************************  Config APIs ********************************/

/**
 * Fetch config file
 */
server_app.get('/config', (req, res) => {
    try {
        logger.info(`Getting Config File ${configPath}`);
        res.sendFile(configPath);
    } catch (err) {
        logger.error(`Error getting Config File ${err}`);
    }
});

server_app.get('/getCss', (req, res) => {
    try {
        logger.info(`CSS Config File ${cssConfig}`);
        res.sendFile(cssConfig);
    } catch (err) {
        logger.error(`Error getting Config File ${err}`);
    }
});

/**
 * Update config file
 */
server_app.post('/config', authenticateToken, (req, res) => {
    try {
        logger.debug(`<-_______________CONFIG FILE PATH ___________->" ${configPath}`);
        fs.writeFile(configPath, JSON.stringify(req.body, null, 2), 'utf8', (err) => {
            if (err) {
                res.status(500).send('Error writing to config file');
            }
            res.send('Config updated successfully');
        });

    } catch (err) {
        logger.error(`Error Posting to Config File ${err}`);
    }
});


/*****************************  Arduino APIs ********************************/

/***************************** update APIs ********************************/
server_app.get('/checkIfUpdateAvailable', (request, response) => {
    checkIfUpdateAvailable().then((res) => {
        response.json({ success: true, data: res });
    }).catch((err) => {
        response.status(500).json({ success: false, msg: err.message });
    });
});

server_app.get('/quitandInstallFromLocal', authenticateToken, (request, response) => {
    quitandInstallFromLocal().then((res) => {
        response.json({ success: true, data: res });
    }).catch((err) => {
        response.status(500).json({ success: false, msg: err.message });
    });
});

server_app.get('/checkIfUpdateDownloaded', (request, response) => {
    checkIfUpdateDownloaded().then((res) => {
        response.json({ success: true, data: res });
    }).catch((err) => {
        response.status(500).json({ success: false, msg: err.message });
    });
});

/**
 * Restart the app
 */
server_app.post('/app_actions', authenticateToken, (request, response) => {
    logger.debug(`App Actions called with ${request.body.cmd.type}`);
    if (request.body.cmd.type == 'Reset') {
        logger.debug(`Reset Action Called`);
        restartApp();
        response.json({ success: true });

    }
    else if (request.body.cmd.type == 'Close') {
        logger.debug(`Close Action Called`);
        closeAppCompletely();
        response.json({ success: true });

    }
    else if (request.body.cmd.type == 'ResetMqttBuffer') {
        logger.debug(`Clear Mqtt Buffer`);
        resetMqttBuffer();
        response.json({ success: true });
    }
    else if (request.body.cmd.type == 'RedisClear') {
        logger.debug(`Clear Redis Buffer`);
        flushRedis();
        response.json({ success: true });
    }
    else if (request.body.cmd.type == 'MqttRefresh') {
        logger.debug(`Refresh Mqtt Action Called`);
        refreshMqtt();
        response.json({ success: true });
    }
    else {
        logger.debug(`Unknown Action Called`);
        response.status(500).json({ success: false, msg: "Unknown System Command" });

    }
});


/**
 * Creates http and https server
 * @returns http and https server or error
 */

exports.start = () => {
    return new Promise((resolve, reject) => {
        try {
            logger.info("Starting HTTP Servers");
            const httpServer = http.createServer(server_app).listen(HTTP_PORT, '0.0.0.0', () => {
                logger.info(`HTTP Server running on port ${HTTP_PORT}`);
            });

            const httpsServer = https.createServer(httpsOptions, server_app).listen(HTTPS_PORT, '0.0.0.0', () => {
                logger.info(`HTTPS Server running on port ${HTTPS_PORT}`);
            });

            httpsServer.on('listening', () => {
                // console.log("HTTP SERVER STARTED");
                startOtherComponents(httpsServer)
                    .then(() => {
                        resolve({ httpServer, httpsServer });
                    })
                    .catch(err => {
                        logger.error("Error initializing components", err);
                        reject(err);
                    });
            });
        } catch (err) {
            logger.error(`Error setting up HTTPS Server: ${err}`);
            showErrorDialog("Error connecting HTTPS Server", 1);
            reject(err);
        }
    });
};

/**
 * Creates websocket server
 * @param {String} server 
 * @returns Success or Failure
 */
async function startOtherComponents(server) {
    return new Promise((resolve, reject) => {
        try {
            logger.info("Starting Websocket Servers");
            createWebSocketServer(server);
            resolve();
        } catch (err) {
            logger.error("Error connecting Websocket", err);
            showErrorDialog("Error connecting Websocket", 1);
            reject(err);
        }
    });
}

/**
 * clearing all servers
 */
// exports.stop = async () => {
//     logger.info("Stopping Servers Called");

//     // Create an array to hold promises for the server close operations
//     const closePromises = [];

//     if (httpServer) {
//         logger.info("Stopping HTTP Server");
//         const httpClose = new Promise((resolve, reject) => {
//             httpServer.close((err) => {
//                 if (err) {
//                     logger.error('Error closing HTTP Server', err);
//                     reject(err);
//                 } else {
//                     logger.info('HTTP Server closed');
//                     resolve();
//                 }
//             });
//         });
//         closePromises.push(httpClose);
//     }

//     if (httpsServer) {
//         logger.info("Stopping HTTPS Server");
//         const httpsClose = new Promise((resolve, reject) => {
//             httpsServer.close((err) => {
//                 if (err) {
//                     logger.error('Error closing HTTPS Server', err);
//                     reject(err);
//                 } else {
//                     logger.info('HTTPS Server closed');
//                     resolve();
//                 }
//             });
//         });
//         closePromises.push(httpsClose);
//     }
//     try {
//         await Promise.all(closePromises)
//         closeWebSocketServer();
//         disconnect();
//         clearAllUserSessions();
//     } catch (err) {
//         logger.error('Error during server shutdown', err);
//         throw err;
//     };
// }


exports.stop = () => {
    logger.info("Stopping HTTP Servers");
    if (httpServer) httpServer.close(() => logger.info('HTTP Server closed'));
    if (httpsServer) httpsServer.close(() => logger.info('HTTPS Server closed'));
    closeWebSocketServer();
    disconnect();
    clearAllUserSessions();

}

/**
 * Update converion factors
 */
server_app.post('/setConversionFactors', authenticateToken, (request, response) => {
    try {
        const factors = request.body;
        if (factors) {
            updateConversionFactors(factors)
                .then((result) => {
                    if (result) {
                        response.json({ success: true });
                        MqttClient.fetchAlpha()
                    } else {
                        response.json({ success: false });
                    }
                })
                .catch((error) => {
                    console.error(error);
                    response.status(500).json({ success: false, msg: error });
                });
        } else {
            response.status(400).json({ success: false, msg: 'Invalid request. Missing Factors property in the request body.' });
        }
    } catch (error) {
        console.error(error);
        response.status(500).json({ success: false });
    }
});

server_app.get('/about', (req, res) => {
    try {
        logger.info(`About requested}`);
        let licensedata = readLicenseFile()
        res.send({
            ...licensedata, version: version
        });
    } catch (err) {
        logger.error(`Error getting About details ${err}`);
    }
});

server_app.get('/license', (req, res) => {
    if (isValid && isDeviceId && isValidityLive.val) {
        res.send(isValidityLive);
    } else {
        res.send({ val: false, display: true, message: 'License is not valid' })
    }
});


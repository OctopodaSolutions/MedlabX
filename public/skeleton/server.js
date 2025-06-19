const express = require('express');
const { app } = require('electron');
const session = require('express-session');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const http = require('http');
const https = require('https');
const fileUpload = require('express-fileupload');

const RedisStore = require('connect-redis').default;
const redisClient = require('./redis.js');

const wss = require('./websockets');

const skeletonApis = require('./skeletonApi.js'); 

const { logger } = require('../logger.js');
const { disconnect } = require('./database.js');
const { showErrorDialog } = require('../dialogMessage.js');

const { decryptCertFile } = require('./decrypt-util.js');

class Server {
    constructor() {
        this.serverApp = express();
        this.key = null;
        this.cert = null;
        this.ca = null;
        this.configPath = app?.isPackaged ? path.join(process.resourcesPath, 'resources', 'config.json') : path.join(app.getAppPath(), 'public/config.json');
        this.HTTP_PORT = require(this.configPath)['HTTP_SERVER_PORT'];
        this.HTTPS_PORT = require(this.configPath)['HTTPS_SERVER_PORT'];
        this.httpsServer = null;
        this.httpServer = null;
        this.staticPath = path.join(__dirname, '../../build');
        this.templatesDir = path.join(app.getPath('userData'), 'templates');
        this.setupServer();
    }

    /**
     * Sets up the server and middleware
     */
    setupServer() {
        this.serverApp.use(express.static(this.staticPath));

        if (!fs.existsSync(this.templatesDir)) {
            fs.mkdirSync(this.templatesDir, { recursive: true });
        }

        this.loadCertificates();
        this.setupCors();
        this.setupMiddleware();
        this.setupRoutes();
    }

    /**
     * Loads certificates based on the environment (packaged or not)
     */
    loadCertificates() {
        try{
            if (app?.isPackaged) {
                this.key = this.loadCertificate('server.key.enc').toString('utf8');
                this.cert = this.loadCertificate('server.pem.enc').toString('utf8');
                this.ca = this.loadCertificate('rootCA.pem.enc').toString('utf8');
            } else {
                this.key = fs.readFileSync(path.join(app.getAppPath(), 'certificates', 'server.key'));
                this.cert = fs.readFileSync(path.join(app.getAppPath(), 'certificates', 'server.pem'));
                this.ca = fs.readFileSync(path.join(app.getAppPath(), 'certificates', 'rootCA.pem'));
            }

            if (!this.cert || !this.key) {
                logger.error('Certificate or key file not found!');
                app.exit();
            }
        } catch (err) {
            console.log('certs are not fount at this location',err);
        }
    }

    /**
     * Reads certificate file
     * @param {String} filename 
     * @returns file data
     */
    loadCertificate(filename) {
        const filePath = path.join(this.getCertificatesPath(), filename);
        return decryptCertFile(filePath, 'Noki#2k01');
    }

    /**
     * Returns certificates path
     * @returns {String}
     */
    getCertificatesPath() {
        return path.join(app.getAppPath(), 'certificates-encrypted');
    }

    /**
     * Sets up CORS options
     */
    setupCors() {
        this.corsOptions = {
            origin: function (origin, callback) {
                callback(null, true);
            },
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        };
    }

    /**
     * Sets up the middlewares for the server
     */
    setupMiddleware() {
        this.serverApp.use(cors(this.corsOptions));
        this.serverApp.use(express.json());
        this.serverApp.use(cookieParser());
        this.serverApp.use(session({
            store: redisClient.client ? new RedisStore({ client: redisClient.client }) : undefined,
            secret: process.env.JWT_SECRET || 'NokiXtract10',
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false,
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            }
        }));
        this.serverApp.use(fileUpload({ createParentPath: true }));
    }

    /**
     * Sets up routes for the server
     */
    setupRoutes() {
        if (app?.isPackaged) {
            this.serverApp.get('/', (req, res) => {
                res.sendFile(path.join(this.staticPath, 'index.html'));
            });
        }
        this.serverApp.use('/', skeletonApis);
    }


    /**
     * Sets up routes for the server
     */
    setupCustomRoutes(endpoint,customApi) {
        this.serverApp.use(`${endpoint}`, customApi);
        console.log('custom routes enabled on', endpoint);
    }

    /**
     * Starts the HTTP and HTTPS servers
     * @returns {Promise}
     */
    start() {
        return new Promise((resolve, reject) => {
            try {
            logger.info("Starting HTTP Servers");
            
            // Create HTTP server
            this.httpServer = http.createServer(this.serverApp);
            this.httpServer.on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                logger.error(`HTTP Server Error: Port ${this.HTTP_PORT} is already in use.`);
                showErrorDialog(`HTTP Server failed: Port ${this.HTTP_PORT} is already in use.`, 1);
                } else {
                logger.error(`HTTP Server Error: ${err.message}`);
                }
                reject(err);
            });
        
            this.httpServer.listen(this.HTTP_PORT, '0.0.0.0', () => {
                logger.info(`HTTP Server running on port ${this.HTTP_PORT}`);
            });
        
            // Create HTTPS server
            this.httpsServer = https.createServer(
                { key: this.key, cert: this.cert, ca: this.ca },
                this.serverApp
            );
        
            this.httpsServer.on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                logger.error(`HTTPS Server Error: Port ${this.HTTPS_PORT} is already in use.`);
                showErrorDialog(`HTTPS Server failed: Port ${this.HTTPS_PORT} is already in use.`, 1);
                } else {
                logger.error(`HTTPS Server Error: ${err.message}`);
                }
                reject(err);
            });
        
            this.httpsServer.listen(this.HTTPS_PORT, '0.0.0.0', () => {
                logger.info(`HTTPS Server running on port ${this.HTTPS_PORT}`);
            });
        
            // Start WebSocket + other components only after HTTPS is listening
            this.httpsServer.on('listening', () => {
                this.startOtherComponents(this.httpsServer)
                .then(() => resolve({ httpServer: this.httpServer, httpsServer: this.httpsServer }))
                .catch((err) => {
                    logger.error("Error initializing components", err);
                    reject(err);
                });
            });
        
            } catch (err) {
            logger.error(`Unexpected error during server startup: ${err.message}`);
            showErrorDialog("Error starting servers", 1);
            reject(err);
            }
        });
    }

    /**
     * Starts WebSocket server and other components
     * @param {String} server 
     * @returns {Promise}
     */
    startOtherComponents(server) {
        return new Promise((resolve, reject) => {
            try {
                logger.info("Starting WebSocket Servers");
                wss.createWebSocketServer(server);
                resolve();
            } catch (err) {
                logger.error("Error connecting WebSocket", err);
                showErrorDialog("Error connecting WebSocket", 1);
                reject(err);
            }
        });
    }

    /**
     * Stops all servers and components
     */
    stop() {
        logger.info("Stopping HTTP Servers");
        if (this.httpServer) this.httpServer.close(() => logger.info('HTTP Server closed'));
        if (this.httpsServer) this.httpsServer.close(() => logger.info('HTTPS Server closed'));
        wss.closeWebSocketServer();
        disconnect();
        redisClient.clearAllUserSessions();
    }
}

module.exports = Server;

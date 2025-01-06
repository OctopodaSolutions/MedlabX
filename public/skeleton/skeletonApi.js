const express = require('express');
const redisClient = require('./redis.js');
const { app } = require('electron');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const wss = require('./websockets');
const { logger } = require('../logger.js');
const { version } = require('../../package.json');
const { verifyUser, addUser, getUsers, updateUserDetails, updatePasswordDetails, deleteUserAccount } = require('./database.js');
const { restartApp, closeAppCompletely, refreshMqtt } = require('../actions.js');
const { checkIfUpdateDownloaded, quitandInstallFromLocal, checkIfUpdateAvailable } = require('../update.js');
const { readLicenseFile } = require('./verify.js');
const { authenticateToken, isValid, isDeviceId, isValidityLive } = require('./authToken.js');
const multer = require('multer');
const cssConfig = app.isPackaged ? path.join(process.resourcesPath, 'resources', 'CssConfig.json') : path.join(app.getAppPath(), 'public/skeleton/Config Files/CssConfig.json');
const configPath = app.isPackaged ? path.join(process.resourcesPath, 'resources', 'config.json') : path.join(app.getAppPath(), 'public/config.json');

let userSessions = 0;

const server_app = express.Router();

/*****************************  Login/Signup APIs ********************************/
/**
 * user login
 */
server_app.post('/login', (request, response) => {
    logger.info(`Login Called for User`);
    try {
        verifyUser(request.body.uname, request.body.pass)
            .then((user) => {
                redisClient.client.get(`user_session:${user.name}`, (err, session) => {
                    if (err) {
                        logger.error("Redis error:", err);
                        return response.status(500).json({ success: false, message: "Error accessing session store." });
                    }
                    if (session) {
                        logger.info(`User Login Error ${JSON.stringify(session)}`);
                        return response.status(401).json({ success: false, message: "User is already logged in from another session." });
                    } else {
                        const token = jwt.sign(user, process.env.JWT_SECRET);
                        redisClient.client.set(`user_session:${user.name}`, token, 'EX', 30 * 24 * 60 * 60 * 1000);
                        response.cookie('AuthToken', token, {
                            httpOnly: true,
                            secure: app.isPackaged,
                            sameSite: 'strict',
                            maxAge: 1000 * 60 * 60
                        });
                        userSessions++;
                        wss.broadcast({ type: "User", msg: userSessions });
                        logger.info(`Login Successfull for ${user.name}. Sessions ${userSessions}`);
                        let sts = MqttClient.getStatus();
                        // console.log('----',sts)
                        wss.broadcast({ type: 'ConnUpdate', msg: `${JSON.stringify({ service: 'mqtt', status: sts })}` });
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
    redisClient.client.del(`user_session:${user.name}`, (err, reply) => {
        if (err) {
            logger.error(`Error during logout:, ${err}`);
            return res.status(500).json({ success: false, message: "An error occurred during logout." });
        }
        userSessions--;
        if (userSessions < 0) userSessions = 0;
        wss.broadcast({ type: "User", msg: userSessions });
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
        redisClient.flushAll();
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

// Create an uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// File upload endpoint
server_app.post("/uploadPlugin", (req, res) => {
    console.log("Upload endpoint hit");

  // Check if a file was uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log("No files were uploaded.");
    return res.status(400).send("No files were uploaded.");
  }

  // Access the uploaded file
  const uploadedFile = req.files.file;
  console.log("Uploaded file received:", uploadedFile.name);

  // Save the file
  const uploadDir = path.join(__dirname, "uploads");
  const filePath = path.join(uploadDir, uploadedFile.name);

  // Ensure the uploads directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  uploadedFile.mv(filePath, (err) => {
    if (err) {
      console.error("Error saving file:", err);
      return res.status(500).send("Failed to save file.");
    }
    res.status(200).send("File uploaded successfully.");
  });
});
  
// Endpoint to run the uploaded file
server_app.post("/runPlugin", (req, res) => {
    const filePath = path.join(__dirname, "uploads", "customBundle.js");

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(400).send("File not found.");
    }
  
    try {
      // Dynamically load the file
      const customPlugin = require(filePath);
  
      // Run the customStart function from the uploaded file
      if (customPlugin.customStart) {
        customPlugin.customStart();
        res.status(200).json({ message: "File executed successfully." });
      } else {
        res.status(400).json({ message: "customStart function not found in file." });
      }
    } catch (error) {
      console.error("Error running the file:", error);
      res.status(500).json({ message: "Failed to execute file." });
    }
});
  

module.exports = server_app;
const express = require('express');
const redisClient = require('./redis.js');
const { app } = require('electron');
const jwt = require('jsonwebtoken');
const fs = require('fs-extra');
const unzipper = require('unzipper');
const path = require('path');
const wss = require('./websockets');
const { logger } = require('../logger.js');
const { version } = require('../../package.json');
const { verifyUser, addUser, getUsers, updateUserDetails, updatePasswordDetails, deleteUserAccount } = require('./database.js');
const { restartApp, closeAppCompletely, refreshMqtt } = require('../actions.js');
const { checkIfUpdateDownloaded, quitandInstallFromLocal, checkIfUpdateAvailable } = require('../update.js');
const { readLicenseFile } = require('./verify.js');
const { authenticateToken, getLicenseInfo } = require('./authToken.js');
const { getDataFromBuffer } = require('./mqtt_client.js');
const cssConfig = app?.isPackaged ? path.join(process.resourcesPath, 'resources', 'CssConfig.json') : path.join(app.getAppPath(), 'public/skeleton/Config Files/CssConfig.json');
const configPath = app?.isPackaged ? path.join(process.resourcesPath, 'resources', 'config.json') : path.join(app.getAppPath(), 'public/config.json');

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
                            secure: app?.isPackaged,
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
server_app.get('/config.json', (req, res) => {
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

server_app.get('/arduino_get_status', (request, response) => {
    try {
        let res = getDataFromBuffer(request.query.feed);
        response.json({ success: true, data: res });
    }
    catch (err) {
        console.error(err);
        response.status(500).json({ success: false });
    }
});

server_app.post('/arduino_send_command', (request, response) => {
    logger.debug("Command  to Arduino", request.body.cmd.type);
    if (request.body.cmd.type == "TelemetryToggle") {
        toggleTelemetry(client, request.body.cmd.feed).then((res) => {
            response.json({ success: true, data: res });
        }).catch((err) => {
            response.status(500).json({ success: false });
        });
    }
    else if (request.body.cmd.type == "SingleCmd") {
        logger.debug(`Single Command called (server.js) ${JSON.stringify(request.body, null, 2)}`);

        // console.log('request.body.cmd.feed.returnFeed',request.body.cmd.feed.returnFeed);
        console.log('request.body.cmd.prg.steps[0]', request.body.cmd.prg.steps);


        sendSingleCommand(request.body.cmd.feed.name, request.body.cmd.prg.steps)
            .then((res) => {
                response.json({ success: true, data: res });
            })
            .catch((err) => {
                response.status(500).json({ success: false, error: err });
            });

    } else if (request.body.cmd.type === "sendChartDetails") {
        console.log('request.body', request.body);

        // Extract command and regions
        const command = request.body.cmd.messageType;
        const selectedRanges = request.body.selectedRanges;

        // Format the command and regions
        const data = {
            command: command,
            regions: selectedRanges
        };

        console.log('data', data);

        sendSingleCommandWithFormatting(request.body.cmd.feed, data)
            .then((res) => {
                response.json({ success: true, data: res });
            }).catch((err) => {
                response.status(500).json({ success: false, error: err });
            });
    }
    else if (request.body.cmd.type === "sendCalibrate") {
        console.log('request.body', request.body);

        // Extract command and regions
        const command = request.body.cmd.messageType;
        const selectedRanges = request.body.selectedRanges;

        // Transform selectedRanges to the desired format
        const dataPoints = selectedRanges.map(range => {
            const [key, value] = Object.entries(range)[0];  // Get the first key-value pair
            return [parseInt(key), parseInt(value)];        // Convert both key and value to integers
        });

        // Format the command and dataPoints
        const data = {
            command: command,
            dataPoints: dataPoints
        };

        console.log('Formatted data for calibration:', data);

        sendSingleCommandWithFormatting(request.body.cmd.feed, data)
            .then((res) => {
                response.json({ success: true, data: res });
            }).catch((err) => {
                response.status(500).json({ success: false, error: err });
            });
    }
    else if (request.body.cmd.type === "getPeaks") {
        const formattedData = {
            "type": request.body.cmd.messageType,
            "data": request.body.ChartData
        };

        console.log('Formatted peak data:', formattedData);

        sendSingleCommandWithFormatting(request.body.cmd.feed, formattedData)
            .then((res) => {
                response.jsonp({ success: true, data: res });
            })
            .catch((err) => {
                response.status(500).json({ success: false, error: err });
            });
    }


    else if (request.body.cmd.type === "identifyPeaks") {
        console.log('request.body.cmd.type',request.body.cmd.type );
        const formattedData = {
            "type": request.body.cmd.messageType,
            "data": request.body.ChartData
        };

        console.log('Formatted peak data:', formattedData);

        sendSingleCommandWithFormatting(request.body.cmd.feed, formattedData)
            .then((res) => {
                response.jsonp({ success: true, data: res });
            })
            .catch((err) => {
                response.status(500).json({ success: false, error: err });
            });
    }

    else if (request.body.cmd.type == "CloseConnections") {
        ``
        logger.debug("Close Connections called");
        disconnectMQTTClient(client, request.body).then((res) => {
            response.json({ success: true, data: res });
        }).catch((err) => {
            response.status(500).json({ success: false, data: err });
        });
    }
    else {
        logger.debug("Command Not Found");
        response.status(500).json({ success: false });

    }

});

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
server_app.post('/app_actions', (request, response) => {
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


/******************* Report Generation API's **********************/

const chromePath = {
    win32: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', // Path to Chrome on Windows
    darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // Path to Chrome on macOS
    linux: '/usr/bin/google-chrome' // Path to Chrome on Linux
};

server_app.post('/generateReport', authenticateToken, async (request, response) => {
    const { chartData, data } = request.body;
    console.log('request', request.body);
    logger.info(`Generate Report called with data---------: ${chartData.length}`);

    try {
        // Generate the HTML content using the EJS template
        const htmlContent = await generateHtmlFromJson({ chartData, data }, templateDir);

        // Use Puppeteer to generate PDF from HTML content
        const browser = await puppeteer.launch({
            headless: "new",
            executablePath: chromePath[process.platform] // Use system Chrome/Chromium
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();

        // Set headers to indicate content type and disposition
        response.setHeader('Content-Type', 'application/pdf');
        response.setHeader('Content-Disposition', 'inline; filename=report.pdf');

        // Stream the PDF buffer to the response
        response.send(pdfBuffer);
    } catch (error) {
        logger.error('Error generating PDF:', error);
        response.status(500).send({ success: false, msg: 'Error generating PDF' });
    }
});


server_app.post('/uploadReportTemplate', authenticateToken, (req, res) => {
    console.log('Upload endpoint hit');

    if (!req.files || Object.keys(req.files).length === 0) {
        console.log('No files were uploaded.');
        return res.status(400).send('No files were uploaded.');
    }

    // Access the uploaded file
    const uploadedFile = req.files.file;
    console.log('Uploaded file received:', uploadedFile.name);

    updateReportTemplate(uploadedFile)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            res.status(500).send({ success: false, message: error.message });
        });


});


/********** App Specific API's  **********/

// about details
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

// license details
server_app.get('/license', (req, res) => {
    const { isValid, isDeviceId, isValidityLive } = getLicenseInfo();
    if (isValid && isDeviceId && isValidityLive.val) {
        res.send(isValidityLive);
    } else {
        res.send({ val: false, display: true, message: 'License is not valid' })
    }
});

// get the license file to frontend
server_app.get('/getLicenseFile',(req, res) => {
    try{
        let filePath = path.join(app.getAppPath(), 'license/license.txt');
        if(app?.isPackaged){
            filePath = path.join(app.getPath('userData'), 'license/license.txt');
        }
        res.download(filePath, 'license.txt', (err) => {
        if (err) {
            res.status(500).send('Error downloading file.');
        }
        });
    }catch(err){
        res.status(500).send('Error downloading file due to file path.');
    }
})

server_app.post('/uploadLicense',(req,res) =>{
    
    try {
        let licenseDir = path.join(app.getAppPath(), 'license');
        if(app?.isPackaged){
            licenseDir = path.join(app.getPath('userData'), 'license');
        }
        const tempDir = path.join(licenseDir, 'temp');
        const tempZipPath = path.join(tempDir, 'license-upload.zip');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
  
      const writeStream = fs.createWriteStream(tempZipPath);
      req.pipe(writeStream);
  
      writeStream.on('finish', async () => {
        try {
          const allowedFiles = ['license.txt', 'license.sig.b64'];
  
          const zipEntries = [];
          const directory = await unzipper.Open.file(tempZipPath);
          directory.files.forEach((file) => {
            if (!file.path.endsWith('/')) { // Ignore folders
              zipEntries.push(file.path);
            }
          });
  
          const invalidEntries = zipEntries.filter(
            (entry) => !allowedFiles.includes(entry)
          );
  
          if (invalidEntries.length > 0) {
            fs.unlinkSync(tempZipPath); // Clean up
            return res.status(400).json({
              message: 'Invalid zip file. Only license.txt and license.sig.b64 are allowed.',
              invalidEntries,
            });
          }
  
          if (!fs.existsSync(licenseDir)) {
            fs.mkdirSync(licenseDir, { recursive: true });
          }
  
          // Extract to license directory
          fs.createReadStream(tempZipPath)
            .pipe(unzipper.Extract({ path: licenseDir }))
            .on('close', () => {
              fs.unlinkSync(tempZipPath); // Clean up
              res.json({ message: 'License uploaded and extracted successfully' });
            })
            .on('error', (err) => {
              console.error('Unzip error:', err);
              res.status(500).send('Failed to extract license zip');
            });
        } catch (validationError) {
          console.error('Validation error:', validationError);
          res.status(500).send('Failed to validate zip content');
        }
      });
  
      writeStream.on('error', (err) => {
        console.error('Stream error:', err);
        res.status(500).send('File upload failed');
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      res.status(500).send('Server error');
    }
})

/*********** Plugin upload API's ***********/


// File upload endpoint
server_app.post("/uploadPlugin", async (req, res) => {
    console.log("Upload endpoint hit");

    if (!req.files || !req.files.zipFile) {
        return res.status(400).send('No file uploaded.');
    }

    const zipFile = req.files.zipFile;
    const pluginFolderPath = path.join(__dirname, '..', 'Plugin'); // Path to Plugin folder
    let pluginIndex = 1;

    // Find the next available plugin index by counting the current folders in the Plugin folder
    const folders = await fs.readdir(pluginFolderPath);
    const pluginFolders = folders.filter((folder) =>
        folder.startsWith('plugin') && !isNaN(folder.slice(6))
    );

    // Get the next plugin number (plugin{i})
    if (pluginFolders.length > 0) {
        const maxIndex = pluginFolders
            .map((folder) => parseInt(folder.slice(6)))
            .reduce((max, current) => Math.max(max, current), 0);
        pluginIndex = maxIndex + 1;
    }

    // Create the new plugin folder
    const newPluginFolder = path.join(pluginFolderPath, `plugin${pluginIndex}`);
    await fs.ensureDir(newPluginFolder); // Create the directory if it doesn't exist

    // Save the uploaded zip file temporarily
    const tempZipPath = path.join(__dirname, 'temp.zip');
    await zipFile.mv(tempZipPath);

    // Unzip the file into the new plugin folder
    fs.createReadStream(tempZipPath)
        .pipe(unzipper.Extract({ path: newPluginFolder }))
        .on('close', async () => {
            // Delete the temporary zip file after extraction
            fs.removeSync(tempZipPath);

            // Check if the required files are in the extracted folder
            const requiredFiles = ['nodePlugin.js', 'config.json', 'reactPlugin.js'];
            const extractedFiles = await fs.readdir(newPluginFolder);
            const missingFiles = requiredFiles.filter(
                (file) => !extractedFiles.includes(file)
            );

            if (missingFiles.length > 0) {
                return res.status(400).send(`Invalid folder. Missing files: ${missingFiles.join(', ')}`);
            }

            // If all required files are present
            res.send(`Plugin ${pluginIndex} uploaded and extracted successfully.`);
        })
        .on('error', (err) => {
            fs.removeSync(tempZipPath); // Clean up the temp file if something goes wrong
            res.status(500).send('Error during extraction: ' + err.message);
        });
});

// Endpoint to run the uploaded file
server_app.post("/runPlugin", (req, res) => {
    const pluginsDirectory = path.join(__dirname, '..', 'Plugin');
    // Read the plugins directory
    let group = [];
    let failedPlugins = [];
    let processedCount = 0;
    let totalPlugins = 0;

    fs.readdir(pluginsDirectory, (err, pluginDirs) => {
        if (err) {
            console.error('Unable to read Plugin directory:');
            return res.status(500).json({ error: 'Unable to read Plugin directory' });
        }

        totalPlugins = pluginDirs.length;

        // If there are no plugins, respond immediately
        if (totalPlugins === 0) {
            return res.json({ group, failedPlugins });
        }

        // Iterate through each plugin directory (plugin1, plugin2, etc.)
        pluginDirs.forEach(pluginDir => {
            const pluginPath = path.join(pluginsDirectory, pluginDir);

            //serve plugin path to access react file in frontend
            server_app.use(`/plugins/${pluginDir}`, express.static(pluginPath));

            // Check if the plugin is a directory
            fs.stat(pluginPath, (err, stats) => {
                if (err || !stats.isDirectory()) {
                    console.error('Error reading plugin path or not a directory:', err);
                    failedPlugins.push({ pluginDir, error: 'Not a directory or stat error' });
                    processedCount++;
                    checkDone();
                    return;
                }

                // Construct the path to config.json and backend.js
                const configFilePath = path.join(pluginPath, 'config.json');
                const backendFilePath = path.join(pluginPath, 'nodePlugin.js');
                const frontendFilePath = path.join(pluginPath, 'reactPlugin.js');

                // Read the config.json to get the MQTT object
                fs.readFile(configFilePath, 'utf8', (err, data) => {
                    if (err) {
                        console.error(`Error reading config.json for ${pluginDir}:`, err);
                        failedPlugins.push({ pluginDir, error: `Error reading config.json: ${err.message}` });
                        processedCount++;
                        checkDone();
                        return;
                    }

                    try {
                        const config = JSON.parse(data);
                        const mqttConfig = config.mqtt; // Assuming the structure has mqtt object
                        // console.log('mqtt feeds', mqttConfig);

                        // Import the backend.js dynamically (require it)
                        const backend = require(backendFilePath);

                        // Call the start function and pass the mqttConfig
                        if (backend && typeof backend.customStart === 'function') {
                            console.log(`Starting plugin: ${pluginDir}`);
                            backend.customStart(`/${config.route}`, mqttConfig, config.schema);
                            group.push({ config: config, react: `/plugins/${pluginDir}/reactPlugin.js`, reactChunk: `/plugins/${pluginDir}/269reactPlugin.js` });
                        } else {
                            console.error(`No start function in backend.js for ${pluginDir}`);
                            failedPlugins.push({ pluginDir, error: 'No customStart function found in backend.js' });
                        }
                    } catch (e) {
                        console.error(`Error parsing JSON for ${pluginDir}:`, e);
                        failedPlugins.push({ pluginDir, error: `JSON parsing error: ${e.message}` });
                    }

                    processedCount++;
                    checkDone();
                });
            });
        });

        // Check if all plugins have been processed and send the response
        function checkDone() {
            if (processedCount === totalPlugins) {
                res.json({
                    group,
                    failedPlugins
                });
            }
        }
    });
});


module.exports = server_app;
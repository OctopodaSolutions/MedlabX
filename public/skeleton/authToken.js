const redisClient = require("./redis");
const { verifyDeviceId, isLicenseValid, verifyLicense } = require("./verify");
const jwt = require('jsonwebtoken');
const { app } = require('electron');
const path = require('path');
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
const packageJson = require(path.join(app.getAppPath(), 'package.json'));
const isDev = packageJson.isDevBuild === true;
/**
 * Authentication token verification
 * @param {Object} req 
 * @param {Object} res 
 * @param {Middleware} next 
 * @returns Success or Failure
 */
global.authenticateToken = (req, res, next) => {
    if ((!app.isPackaged)|| (isDev)||(isValid && isDeviceId && isValidityLive)) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            redisClient.client.get(`user_session:${decoded.username}`, (err, result) => {
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

function getLicenseInfo(){
    return{ isValid, isDeviceId, isValidityLive }
}

module.exports = {authenticateToken, isDeviceId , isValid, isValidityLive, getLicenseInfo};
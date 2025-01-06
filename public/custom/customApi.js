const express = require('express')
const { fetchXspecHistory, fetchXspecCalibration, updateXspecCalibration } = require('./customDatabase');
const { logger } = require('./customlogger');

const server_app = express.Router();
const authenticateToken = global.authenticateToken;

/** Get calibration values */

server_app.get('/getXspecCalibration', (request, response) => {
    logger.info('conversion factors called')
    try {
        fetchXspecCalibration()
            .then((CF) => {
                // logger.info('conversion factors success')
                if (CF) {
                    response.json({ success: true, data: CF });
                } else {
                    response.json({ success: false, msg: 'Calibration Factors not found.' });
                }
            })
            .catch((error) => {
                // logger.error('conversion factors failed')
                console.error(error);
                response.status(500).json({ success: false, msg: error });
            });
    } catch (error) {
        console.error(error);
        response.status(500).json({ success: false });
    }
});

/**
 * Update converion factors
 */
server_app.post('/setXspecCalibration', authenticateToken, (request, response) => {
    try {
        const factors = request.body;
        if (factors) {
            updateXspecCalibration(factors)
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

server_app.get('/getXspecHistory', authenticateToken, (request, response) => {
    try {
        fetchXspecHistory()
            .then((historyData) => {
                if (historyData) {
                    response.json({ success: true, data: historyData });
                } else {
                    response.json({ success: false, msg: 'History data not found.' });
                }
            })
            .catch((error) => {
                console.error(error);
                response.status(500).json({ success: false, msg: error });
            });
    } catch (error) {
        console.error(error);
        response.status(500).json({ success: false });
    }
});


module.exports = { server_app };
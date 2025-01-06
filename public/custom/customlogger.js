const winston = require('winston'); // Import winston for logging
require('winston-daily-rotate-file'); // Import winston daily rotate file for log rotation
require('colors'); // Import colors for colored console output
const { app } = require('electron'); // Import the Electron app module
const path = require('path'); // Import path module for handling file paths

/**
 * Determines the path to the config file based on whether the app is packaged.
 * @type {string}
 */
const configPath = app.isPackaged ? path.join(process.resourcesPath, 'resources', 'config.json') : path.join(app.getAppPath(), 'public/config.json');

/**
 * Loads the log level from the config file or uses 'mqtt_debug' as the default.
 * @type {string}
 */
const log_level = require(configPath)['LOG_LEVEL'] || 'mqtt_debug';

/**
 * Sets the log file path with date pattern for log rotation.
 * @type {string}
 */
const log_path = path.join(app.getPath('userData'), 'logs', 'application-%DATE%.log');

console.log(`Logging Setup for ${log_path} ${log_level}`);

/**
 * Defines custom log levels for different types of logs.
 * @type {Object}
 * @property {number} error - Standard error level.
 * @property {number} mqtt_error - Custom error level for MQTT.
 * @property {number} warn - Standard warning level.
 * @property {number} mqtt_warn - Custom warning level for MQTT.
 * @property {number} info - Standard info level.
 * @property {number} mqtt_info - Custom info level for MQTT.
 * @property {number} debug - Standard debug level.
 * @property {number} mqtt_debug - Custom debug level for MQTT.
 */
const customLevels = {
    levels: {
        error: 0,
        mqtt_error: 1,
        warn: 2,
        mqtt_warn: 3,
        info: 4,
        mqtt_info: 5,
        debug: 6,
        mqtt_debug: 7
    }
};

/**
 * Defines custom colors for log levels for console output.
 * @type {Object}
 * @property {string} error - Color for error level.
 * @property {string} mqtt_error - Color for MQTT error level.
 * @property {string} warn - Color for warning level.
 * @property {string} mqtt_warn - Color for MQTT warning level.
 * @property {string} info - Color for info level.
 * @property {string} mqtt_info - Color for MQTT info level.
 * @property {string} debug - Color for debug level.
 * @property {string} mqtt_debug - Color for MQTT debug level.
 */
const customColors = {
    error: 'red',
    mqtt_error: 'magenta',
    warn: 'yellow',
    mqtt_warn: 'yellow',
    info: 'green',
    mqtt_info: 'green',
    debug: 'blue',
    mqtt_debug: 'cyan'
};

/**
 * Custom format to truncate long log messages.
 * @param {Object} info - The log information object.
 * @param {Object} opts - The options object.
 * @param {number} opts.maxLen - The maximum length of the log message.
 * @returns {Object} The modified log information object.
 */
const truncateFormat = winston.format((info, opts) => {
    const maxLen = opts.maxLen || 1000; // Default maximum length of 1000 characters
    if (String(info.message).length > maxLen) {
        info.message = info.message.substring(0, maxLen) + '...[TRUNCATED]';
    }
    return info;
});

/**
 * Combines various formats for log messages.
 * @type {Function}
 */
const logFormat = winston.format.combine(
    winston.format.colorize({ all: true }), // Apply colors to all log levels
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss' // Set timestamp format
    }),
    winston.format.printf(info => {
        let message = `${info.timestamp} [${info.level}]: ${info.message}`;
        if (info.stack) {
            message += `\nStack Trace:\n${info.stack}`;
        }
        return message;
    })
);

// Add custom colors to winston
winston.addColors(customColors);

/**
 * Transports for logging in the development environment.
 * @type {Array}
 */
const developmentTransports = [
    new winston.transports.Console({
        level: log_level,
        format: winston.format.combine(
            winston.format.errors({ stack: true }), // Include stack traces in development
            logFormat
        )
    }),
    new winston.transports.DailyRotateFile({
        level: log_level,
        filename: log_path,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d'
    })
];

/**
 * Transports for logging in the production environment.
 * @type {Array}
 */
const productionTransports = [
    new winston.transports.Console({
        level: log_level
    }),
    new winston.transports.DailyRotateFile({
        level: log_level,
        filename: log_path,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d'
    })
];

/**
 * Chooses the appropriate transports based on the app environment.
 * @type {Array}
 */
let transports = null;
if (!app.isPackaged) {
    transports = developmentTransports;
} else {
    transports = productionTransports;
}

/**
 * Creates the logger instance with custom levels, format, and transports.
 * @type {winston.Logger}
 */
const logger = winston.createLogger({
    levels: customLevels.levels,
    format: winston.format.combine(
        winston.format.errors({ stack: true }), // Include stack traces in logs
        logFormat
    ),
    transports: transports
});

// Export the logger instance
module.exports = { logger };

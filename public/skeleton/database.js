

const mysql = require('mysql2');
const { logger } = require("../logger");
const path = require('path');
const { app } = require('electron');
const configPath = app.isPackaged ? path.join(process.resourcesPath, 'resources', 'config.json') : '../../config.json';


/**
 * Connection to Mysql
 */
const mySqlConnection = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_ROOT_USERNAME,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_SCHEMA_NAME,
    waitForConnections: true,
    queueLimit: 0
});

/*****************************  User Functions ********************************/

/**
 * Verify the user details for login
 * @param {Email} uname 
 * @param {String} pass 
 * @returns Success or Failure
 */
const verifyUser = (uname, pass) => {
    const query = `SELECT * FROM users_list WHERE (UID = '${uname}' OR email='${uname}' OR name='${uname}') AND password = '${pass}' AND membership = true`;
    return new Promise((resolve, reject) => {
        mySqlConnection.query(query, (error, results) => {
            if (error) {
                logger.debug(error);
                reject(error);
            }
            else {
                if (results.length === 1) {
                    resolve(results[0]);
                }
                else {
                    reject(false);
                }
            }
        });
    });

};

/**
 * Adds new user
 * @param {String} name 
 * @param {String} pass 
 * @param {String} UID 
 * @param {Number} membership 
 * @param {Number} access_level 
 * @param {String} designation 
 * @param {String} email 
 * @returns Success or Failure
 */
const addUser = (name, pass, UID, membership, access_level, designation, email) => {
    let query = `INSERT INTO users_list (name, password, UID, access_level, membership, designation,email) VALUES ('${name}', '${pass}', '${UID}', '${access_level}', '0','${designation}','${email}')`;
    return new Promise((resolve, reject) => {
        mySqlConnection.query(query, (error, results) => {
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    reject("Duplicate Entry");
                }
                else {
                    logger.debug("Unidentified Error");
                    reject(error);
                }
            }
            else {
                if (results.affectedRows === 1) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            }
        });
    });
};

/**
 * 
 * @returns user list or Failure
 */
const getUsers = () => {
    return new Promise((resolve, reject) => {
        let query = `Select * from users_list`;
        mySqlConnection.query(query, (error, results) => {
            if (error) {
                reject();
            }
            else {
                resolve(results);
            }
        })
    });
};

/**
 * Updates user details
 * @param {Object} user 
 * @returns Success or Failure
 */
const updateUserDetails = (user) => {
    return new Promise((resolve, reject) => {
        let query = `Update users_list set membership='${user.membership}' where UID = '${user.UID}'`;
        mySqlConnection.query(query, (error, results) => {
            if (error) {
                reject();
            } else {
                resolve(results);
            }
        })
    });
};

/**
 * 
 * @param {String} uname //email
 * @param {String} pass 
 * @returns Success of Failure
 */
const updatePasswordDetails = (uname, pass) => {
    return new Promise((resolve, reject) => {
        let query = `Update users_list set password='${pass}', membership=0 where email='${uname}'`;
        mySqlConnection.query(query, (error, results) => {
            if (error) {
                reject(false);
            }
            else {
                if (results.affectedRows == 1) {
                    resolve(true);
                }
                else {
                    reject(false);
                }
            }
        })
    });
};

/**
 * Deletes user of UID
 * @param {String} uid 
 * @returns Success or Failure
 */
const deleteUserAccount = (uid) => {
    return new Promise((resolve, reject) => {
        let query = `Delete from users_list where UID='${uid}'`;
        mySqlConnection.query(query, (error, results) => {
            if (error) {
                reject(false);
            }
            else {
                logger.debug(results);
                if (results.affectedRows > 0) {
                    logger.debug("User does exist");
                    resolve(true);
                }
                else {
                    logger.debug("User does not exist");
                    resolve(false);
                }
            }
        })
    })
};

/*****************************  Arduino Functions ********************************/

/**
 * 
 * @param {date} date 
 * @returns formatted date
 */
function toMysqlFormat(date) {
    if (!date) {
        return 'NULL'; // Return 'NULL' if date is undefined or null
    } else if (typeof date === 'string') {
        // Assume date is already in the correct format
        return date.slice(0, 19).replace('T', ' ');
    } else if (date instanceof Date) {
        // Convert date object to the correct format
        return date.toISOString().slice(0, 19).replace('T', ' ');
    } else {
        throw new Error("Invalid date format: " + date);
    }
}

const connect = () => {
    logger.info(`MySQL Connect Called`);
    // connection.connect((err) => {
    //     if (err) {
    //         logger.error(`Error connecting to the database: ${err}`);
    //         sendMessage({type:'error',msg:'Error in MySQL Database'});
    //         showErrorDialog(`Error in MySQL Database. Restart Service.`,3);
    //         return;
    //     }
    //     logger.info('Connected to the MySQL server.');
    // });
}

/**
 * Disconects mysql connection
 */
const disconnect = () => {
    mySqlConnection.end((err) => {
        if (err) {
            return logger.error(`Error in Disconnecting Database`);
        }
        logger.info(`Successfully Disconnected Database`);
    })
}


module.exports = {
    verifyUser,
    addUser,
    getUsers,
    updateUserDetails,
    updatePasswordDetails,
    deleteUserAccount,
    connect,
    disconnect,
    mySqlConnection
}



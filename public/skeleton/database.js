const mysql = require('mysql2');
const { logger } = require("../logger");

class MySQLConnection {
    constructor() {
      if (MySQLConnection.instance) {
        return MySQLConnection.instance;
      }
      this.pools = {};
      MySQLConnection.instance = this;
    }
  
    addDatabase(alias, config) {
      if (this.pools[alias]) {
        throw new Error(`Database alias \"${alias}\" already exists.`);
      }
      this.pools[alias] = mysql.createPool({
        host: config.MYSQL_HOST || 'localhost',
        user: config.MYSQL_ROOT_USERNAME || 'root',
        password: config.MYSQL_ROOT_PASSWORD || '',
        database: config.MYSQL_SCHEMA_NAME || '',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    }
  
  //   async query(alias, sql, params) {
  //     const pool = this.pools[alias];
  //     if (!pool) {
  //       throw new Error(`No database connection found for alias \"${alias}\".`);
  //     }
  //     try {
  //       const [rows] = await pool.query(sql, params);
  //       return rows;
  //     } catch (error) {
  //       console.error(`Database query error on alias \"${alias}\":`, error);
  //       throw error;
  //     }
  //   }
  
    async close(alias) {
      if (alias) {
        const pool = this.pools[alias];
        if (!pool) {
          throw new Error(`No database connection found for alias \"${alias}\".`);
        }
        try {
          await pool.end();
          delete this.pools[alias];
          console.log(`Database connection pool closed for alias \"${alias}\".`);
        } catch (error) {
          console.error(`Error closing the database connection pool for alias \"${alias}\":`, error);
          throw error;
        }
      } else {
        for (const key in this.pools) {
          await this.close(key);
        }
      }
    }
  
    async transaction(alias, callback) {
      const pool = this.pools[alias];
      if (!pool) {
        throw new Error(`No database connection found for alias \"${alias}\".`);
      }
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();
        const result = await callback(connection);
        await connection.commit();
        return result;
      } catch (error) {
        await connection.rollback();
        console.error(`Transaction error on alias \"${alias}\":`, error);
        throw error;
      } finally {
        connection.release();
      }
    }
  }
  

const db = new MySQLConnection();

db.addDatabase(process.env.MYSQL_SCHEMA_NAME, process.env);

global.mySqlConnection = db.pools[process.env.MYSQL_SCHEMA_NAME];
  
  

/*****************************  User Functions ********************************/

/**
 * Verify the user details for login
 * @param {Email} uname 
 * @param {String} pass 
 * @returns Success or Failure
 */
const verifyUser = (uname, pass) => {
    const query = `SELECT * FROM users_list WHERE (UID = '${uname}' OR email='${uname}' OR name='${uname}') AND password = '${pass}' `;
    return new Promise((resolve, reject) => {
        mySqlConnection.query(query, (error, results) => {
            if (error) {
                logger.debug(error);
                reject("Login Denied");
            }
            else {
                if (results.length === 1) {
                    if(results[0].membership==1){

                        resolve(results[0]);
                    }else {
                        reject('Login failed due to Membership not Accepted');
                    }
                }
                else {
                    reject('Invalid Email Id or Password');
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


module.exports = {
    verifyUser,
    addUser,
    getUsers,
    updateUserDetails,
    updatePasswordDetails,
    deleteUserAccount,
    mySqlConnection
}



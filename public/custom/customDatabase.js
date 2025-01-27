const mySqlConnection = global.mySqlConnection;

const fetchXspecHistory = () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM history ORDER BY id_no DESC LIMIT ${historyLimit}`;

        mySqlConnection.execute(query, (error, results) => {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

/**
 * 
 * @returns Calibration values
 */
const fetchXspecCalibration = () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM calibration_factors`;

        mySqlConnection.execute(query, (error, results) => {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

/**
 * Updates the calibration values
 * @param {Object} factors 
 * @returns Success or Failure
 */
const updateXspecCalibration = (factors) => {
    const { constant, slope } = factors;
    const query = 'UPDATE calibration_factors SET constant = ?, slope = ? WHERE id = 1';
    const values = [constant, slope];
    return new Promise((resolve, reject) => {
        mySqlConnection.query(query, values, (err, result) => {
            if (err) {
                console.error('Error inserting data into the database:', err);
                // logger.error('Calibration factor Error inserting data into the database');
                // return res.status(500).send('Error inserting data into the database');
                reject(err)
            } else {
                console.log('Data inserted successfully:', result);
                // logger.info('Calibration factor Data inserted successfully');
                resolve(result);
            }
            // res.send('Data received and processed successfully');

        });
    });
}

module.exports = {
    fetchXspecHistory,
    fetchXspecCalibration,
    updateXspecCalibration
}
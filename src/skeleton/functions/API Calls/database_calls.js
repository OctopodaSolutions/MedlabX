import { axiosInstance as axios, axiosInstance} from './auth_interceptor.js';
import { Server_Addr } from '../../utils/medlab_constants.js';




/********************** User API Calls *****************************/

/**
 * Verify user login credentials.
 * 
 * @param {string} uname - The username of the user.
 * @param {string} pass - The password of the user.
 * @returns {Promise<Object>} - A promise that resolves with the server response.
 */
export function verifyUserLogin(uname, pass) {
    return new Promise((resolve, reject) => {
        const fetchURL = `${Server_Addr}/login`;
        axios.post(fetchURL, { uname, pass })
            .then(res => {
                console.log(`Result from Fetch ${res}`);
                resolve(res.data);
            })
            .catch(err => {
                 // Accessing more detailed error information
                 if (err.response) {
                    // Server responded with a status code outside the 2xx range
                    console.log(`Error Status: ${err.response.status}`);
                    console.log(`Error Data: ${JSON.stringify(err.response.data)}`);
                    // Assuming 'msg' is in the response data
                    console.log(`Error Message: ${err.response.data.msg}`);

                    reject(err.response.data.msg);  // Reject with the message sent in the response
                } else if (err.request) {
                    // Request was made but no response received
                    console.log(`No response received: ${err.request}`);
                    reject('No response from server');
                } else {
                    // Something went wrong setting up the request
                    console.log(`Error: ${err.message}`);
                    reject(err.message);
                }
            });
    });
}

/**
 * Add a new user to the server.
 * 
 * @param {string} name - The name of the user.
 * @param {string} pass - The password of the user.
 * @param {string} UID - The unique identifier of the user.
 * @param {string} membership - The membership status of the user.
 * @param {string} access_level - The access level of the user.
 * @param {string} designation - The designation of the user.
 * @param {string} email - The email of the user.
 * @returns {Promise<Object>} - A promise that resolves with the server response.
 */
export function addNewUser(name, pass, UID, membership, access_level, designation, email) {
    return new Promise((resolve, reject) => {
        const fetchURL = `${Server_Addr}/signup`;
        axiosInstance.post(fetchURL, { name, pass, UID, designation, access_level, email })
            .then(res => {
                console.log("result from SignIn", res);
                resolve(res.data);
            })
            .catch(err => {
                console.log("error while pinging Signup", err.message);
                reject(err.message);
            });
    });
}

/**
 * Get user details from the server.
 * 
 * @returns {Promise<Object[]>} - A promise that resolves with the list of users.
 */
export function get_users() {
    return new Promise((resolve, reject) => {
        const fetchURL = `${Server_Addr}/user_details?${new URLSearchParams({ uid: 'NokiXtract' })}`;
        axiosInstance.get(fetchURL)
            .then(res => {
                console.log("Response from User Details", res);
                resolve(res.data);
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

/**
 * Change the membership details of a user.
 * 
 * @param {Object} user - The user data with updated membership details.
 * @returns {Promise<Object>} - A promise that resolves with the server response.
 */
export function change_membership(user) {
    return new Promise((resolve, reject) => {
        const fetchURL = `${Server_Addr}/user_details?${new URLSearchParams({ uid: user.user_id })}`;
        axiosInstance.post(fetchURL, user)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
            });
    });
}

/**
 * Change the password of a user.
 * 
 * @param {string} uname - The username of the user.
 * @param {string} pass - The new password of the user.
 * @returns {Promise<Object>} - A promise that resolves with the server response.
 */
export function change_password(uname, pass) {
    return new Promise((resolve, reject) => {
        const user = { uname, pass };
        const fetchURL = `${Server_Addr}/user_details?${new URLSearchParams({ action: 'changePassword' })}`;
        axiosInstance.post(fetchURL, user)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
            });
    });
}

/**
 * Delete a user from the server.
 * 
 * @param {string} uid - The unique identifier of the user.
 * @returns {Promise<Object>} - A promise that resolves with the server response.
 */
export function delete_user(uid) {
    return new Promise((resolve, reject) => {
        const fetchURL = `${Server_Addr}/user_details?${new URLSearchParams({ uid })}`;
        axiosInstance.delete(fetchURL)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
            });
    });
}

/**
 * Get batch details from the server using batch UID.
 * 
 * @param {string} batch_uid - The unique identifier of the batch.
 * @returns {Promise<Object>} - A promise that resolves with the batch data.
 */
export function get_batch_from_uid(batch_uid) {
    return new Promise((resolve, reject) => {
        const fetchURL = `${Server_Addr}/batch_details?${new URLSearchParams({ uid: batch_uid })}`;
        fetch(fetchURL, { method: 'GET' })
            .then(res => res.json())
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

/**
 * Log out a user from the server.
 * 
 * @param {string} uid - The unique identifier of the user.
 * @returns {Promise<Object>} - A promise that resolves with the server response.
 */
export function logout_user(uid) {
    return new Promise((resolve, reject) => {
        const fetchURL = `${Server_Addr}/logout`;
        axiosInstance.post(fetchURL, { UID: uid })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
}


/********************** Report  API Calls *****************************/


/**
 * Generate a report based on the provided chart data and other data.
 * 
 * @param {Object} chartData - The chart data to be included in the report.
 * @param {Object} data - Additional data for the report.
 * @returns {Promise<void>} - A promise that resolves when the report is generated and downloaded.
 */
export function generate_report_run(chartData, data) {
    return new Promise((resolve, reject) => {
        const fetchURL = `${Server_Addr}/generateReport`;
        const payload = { chartData, data };
        
        axios.post(fetchURL, payload, { responseType: 'blob' })
            .then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'report.pdf');
                document.body.appendChild(link);
                link.click();
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
    });
}

/**
 * Update a template with the provided form data.
 * 
 * @param {FormData} formData - The form data to be uploaded.
 * @returns {Promise<Object>} - A promise that resolves with the server response.
 */
export function update_template(formData) {
    return new Promise((resolve, reject) => {
        const fetchURL = `${Server_Addr}/uploadReportTemplate`;

        axios.post(fetchURL, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
        })
        .then((response) => {
            if (response.data.success) {
                console.log('File uploaded successfully');
                resolve(response.data);
            } else {
                console.error('Error uploading file:', response.data.msg);
                reject(new Error(response.data.msg));
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            reject(error);
        });
    });
}

/********************** Config Settings API Calls *****************************/

/**
 * Get configuration settings from the server.
 * 
 * @returns {Promise<Object>} - A promise that resolves with the configuration settings.
 */
export function get_config() {
    console.log("Server Address", Server_Addr);
    return new Promise((resolve, reject) => {
        const fetchURL = `${Server_Addr}/config.json`;
        axiosInstance.get(fetchURL)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
            });
    });
}

export function get_css(){
    return new Promise((resolve,reject)=>{
        let fetchURL=Server_Addr+'/getCss';
        axiosInstance.get(fetchURL).then((res)=>{
            resolve(res.data);
        }).catch((err)=>{reject(err)});
    })
}

/**
 * Upload configuration settings to the server.
 * 
 * @param {Object} configObj - The configuration object to be uploaded.
 * @returns {Promise<Object>} - A promise that resolves with the server response.
 */
export function upload_config_settings(configObj) {
    return new Promise((resolve, reject) => {
        const fetchURL = `${Server_Addr}/config`;
        axiosInstance.post(fetchURL, configObj)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
            });
    });
}

/**
 * Send an action command to the server.
 * 
 * @param {string} act - The action command to be sent.
 * @returns {Promise<Object>} - A promise that resolves with the server response.
 */
export function sendAction(act) {
    return new Promise((resolve, reject) => {
        const fetchURL = `${Server_Addr}/app_actions`;
        axiosInstance.post(fetchURL, { cmd: { type: act } })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.message || 'Error fetching calibration values');
            });
    });
}

/********************** Calibration API Calls *****************************/

/**
 * Save calibration values to the server.
 * 
 * @param {string} lineId - The line identifier for the calibration.
 * @param {Object} calibObj - The calibration data to be saved.
 * @returns {Promise<Object>} - A promise that resolves with the server response.
 */
export function saveCalibrationValues(lineId, calibObj) {
    console.log('Data received by saveCalibrationValues:', calibObj);
    const fetchURL = `${Server_Addr}/saveCalibrationValues`;
    return new Promise((resolve, reject) => {
        axiosInstance.post(fetchURL, { lineId, cal: calibObj })
            .then(res => {
                console.log("Result from saving calibration values", res);
                resolve(res.data);
            })
            .catch(err => {
                console.log("Error while saving calibration values", err.message);
                reject(err.message);
            });
    });
}

/**
 * Fetch calibration values from the server.
 * 
 * @returns {Promise<Object>} - A promise that resolves with the calibration values.
 */
export function fetchCalibrationValues() {
    const fetchURL = `${Server_Addr}/fetchCalibrationValues`;
    return new Promise((resolve, reject) => {
        axiosInstance.get(fetchURL)
            .then(res => {
                console.log('res.data', res);
                resolve(res.data);
            })
            .catch(err => {
                reject(err.message || 'Error fetching calibration values');
            });
    });
}

/********************** Update API Calls *****************************/


export function checkIfUpdateAvailable(){
    return new Promise((resolve, reject)=>{
        let fetchURL = Server_Addr+'/checkIfUpdateAvailable';
        axios.get(fetchURL).then((res)=>{
            resolve(res.data);
            console.log('result from checkIfUpdateAvailable', res.data)
        }).catch((err)=>{
            reject(err);
        })
    })
}

export function checkIfUpdateDownloaded(){
    return new Promise((resolve,reject)=>{
        let fetchURL=Server_Addr+'/checkIfUpdateDownloaded';
        axios.get(fetchURL).then((res)=>{
            resolve(res.data);
            console.log('checkIfUpdateDownloaded',res.data);
        }).catch((err)=>{
            reject(err);
        })
    })
}


export function quitandInstallFromLocal(){
    return new Promise((resolve,reject)=>{
        let fetchURL=Server_Addr+'/quitandInstallFromLocal';
        axios.get(fetchURL).then((res)=>{
            resolve(res.data)
        }).catch((err)=>{
            reject(err);
        })
    })
}

/************ App Specific API Calls ***********/

export function getAbout(){
    return new Promise((resolve,reject)=>{
        let fetchURL=Server_Addr+'/about';
        axios.get(fetchURL).then((res)=>{
            resolve(res.data)
        }).catch((err)=>{
            reject(err);
        })
    })
}

export function getLicense(){
    return new Promise((resolve,reject)=>{
        let fetchURL=Server_Addr+'/license';
        axiosInstance.get(fetchURL).then((res)=>{
            resolve(res.data);
        }).catch((err)=>{reject(err)});
    })
}

/************* Plugin API Calls *************/

export function startPlugin(){
    return new Promise((resolve,reject)=>{
        let fetchURL=Server_Addr+'/runPlugin';
        axiosInstance.post(fetchURL).then((res)=>{
            resolve(res.data)
        }).catch((err)=>{
            reject(err);
        })
    })
}

/************* License API CALLS *************/

export function downloadLicense(){
    return new Promise((resolve,reject)=>{
        let fetchURL=Server_Addr+'/getLicenseFile';
        axiosInstance.get(fetchURL,{ responseType: 'blob', }).then((res)=>{
            resolve(res.data);
        }).catch((err)=>{reject(err)});
    })
}

export function uploadLicenseZip(file){
    return new Promise((resolve,reject)=>{
        let fetchURL=Server_Addr+'/uploadLicense';
        axiosInstance.post(fetchURL,file, {
            headers: {
              "Content-Type": "application/octet-stream", // Raw binary upload
              "File-Name": file.name, // Optional: send file name as header
            },
        }).then((res)=>{
            resolve(res.data);
        }).catch((err)=>{reject(err)});
    })
}
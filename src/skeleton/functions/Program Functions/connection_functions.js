import { get_config, get_css, upload_config_settings } from "../API Calls/database_calls";

/**
 * Retrieves the connection details by fetching the configuration.
 * 
 * @returns {Promise<Object>} A promise that resolves with the configuration details if the fetch is successful.
 */
export function ConnectionDetails() {
    return new Promise((resolve, reject) => {
        get_config()
            .then((res) => resolve(res))
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });
}

/**
 * Uploads the connection settings to the server.
 * 
 * @param {Object} connObj - The connection settings object to be uploaded.
 * @returns {Promise<Object>} A promise that resolves with the server's response if the upload is successful.
 */
export function UploadConnectionSettings(connObj) {
    return new Promise((resolve, reject) => {
        upload_config_settings(connObj)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    });
}


export function UploadCssProperties(){
    return new Promise((resolve,reject)=>{
        get_css().then((res)=> {
            // console.log('css properties',res);
            resolve(res)
        })
        .catch((err)=>{reject(err)})
    })
}
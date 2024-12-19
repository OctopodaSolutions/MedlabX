import { ConnectionDetails, PrgObjToArduino, Server_Addr ,ObjFrmArduino , deleteFrmArduino ,scanQRCode } from "../../utils/xtract_constants";
import { axiosInstance as axios, axiosInstance} from '../API Calls/auth_interceptor';




/**
 * Retrieves the Arduino connections setup.
 * 
 * @returns {Promise<string>} A promise that resolves with the path of the Arduino port settings if the connection is successful.
 */
export function getArduinoConnections() {
    return new Promise((resolve, reject) => {
        let fetchURL = `${Server_Addr}/arduino_setup_connection`;
        fetch(fetchURL, {
            method: 'GET'
        }).then((res) => res.json())
          .then((data) => {
            if (data.success) {
                console.log(data.data.port.settings.path);
                resolve(data.data.port.settings.path);
            } else {
                reject(data);
            }
        }).catch((err) => {
            reject(err);
        });
    });
}

/**
 * Ends the current Arduino connection.
 * 
 * @returns {Promise<Object>} A promise that resolves with the server's response when the connection is closed.
 */
export function endArduinoConnection() {
    return new Promise((resolve, reject) => {  
        let fetchURL = `${Server_Addr}/arduino_close_connection`;
        fetch(fetchURL, {
            method: 'GET'
        }).then((res) => res.json())
          .then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
}

/**
 * Establishes a connection with the Arduino broker.
 * 
 * @returns {Promise<Object>} A promise that resolves with the server's response after attempting to establish a connection.
 */
export function establishConnectionWithBroker() {
    return new Promise((resolve, reject) => {
        console.log("Current Server Addr, ", Server_Addr, localStorage.getItem('server_addr'));
        let fetchURL = `${String(localStorage.getItem('server_addr')).replaceAll('"', '')}/establish_arduino_connection`;
        fetch(fetchURL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ConnectionDetails)
        }).then((res) => res.json())
          .then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
}

/**
 * Sets the telemetry delay and log level for the Arduino connection.
 * 
 * @param {number} numLines - The number of lines for telemetry.
 * @param {number} delay - The delay in milliseconds for telemetry.
 * @returns {Promise<Object>} A promise that resolves with the server's response after setting the telemetry delay and log level.
 */
export function setTelemetryDelayAndLogLevel(numLines, delay) {
    return new Promise((resolve, reject) => {
        console.log("setTelemetryDelayAndLogLevel");
        let tempURL = `${Server_Addr}/arduino_connection`;
        let requestObj = ConnectionDetails;
        requestObj.cmd = "Telemetry";
        requestObj.type = delay;
        axiosInstance.post(tempURL, requestObj).then((res) => {
            console.log("Result from Send Command", res);
            resolve(res);
        }).catch((err) => {
            console.log(err);
            reject(err);
        });
    });
}

export function disconnectConnectionWithBroker(feedsObj){
    
    return new Promise((resolve,reject)=>{
        let fetchURL = ""+Server_Addr+'/arduino_connection';
        axiosInstance.post(fetchURL,feedsObj)
        .then((res)=>{
            resolve(res.data);
        }).catch((err)=>{
            reject(err);
        });

    });
}

export function changeConnectionBroker(broker){
    let tempObj = {
        cmd:{
            type:'ChangeMQTTBroker',
            broker:broker
        }
    }
    return new Promise((resolve,reject)=>{
        let fetchURL=Server_Addr+'/arduino_send_command';
        fetch(fetchURL,{
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body:JSON.stringify(tempObj)
        }).then((res)=>{
            resolve(res.json());
        }).catch((err)=>{
            reject(err);
        });
    })
}

export function checkConnectionStatus(){
    return new Promise((resolve,reject)=>{
        let fetchURL=Server_Addr+'/arduino_get_status';
        fetch(fetchURL,{
            method:'GET'
        }).then((res)=>{
            resolve(res.json());
        }).catch((err)=>{
            reject(err);
        })
    })
}

export function getConnectedArduinos(){
    return new Promise((resolve,reject)=>{
        let fetchURL=Server_Addr+'/arduino_get_status';
        fetch(fetchURL,{
            method:'GET'
        }).then((res)=>{
            resolve(res.json());
        }).catch((err)=>{
            reject(err);
        });
    })
}

// export function getCmdFrmArduino(prg){
//     return new Promise ((resolve , reject)=> {
//         console.log("Getting commands from Arduino");
//         let fetchURL = Server_Addr+'/arduino_send_command';
//         let requestObj = ObjFrmArduino;
//         requestObj.cmd.prg_id = prg.UID;
//         requestObj.cmd.type="SendPrg";
//         requestObj.cmd.feeds=ConnectionDetails.feeds;
//         requestObj.cmd.steps= prg.steps;
//         fetch(fetchURL , {
//             method:"POST",
//             headers:{
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//               },
//               body:JSON.stringify(requestObj)
//         }).then((res)=>{
//             console.log( "Res from aurdino cmg to react", res);
//             resolve(res);
//         }).catch((err)=>{
//             console.log(err);
//             reject(err);
//         });
//     })
// }

// export function deleteCmdFrmAruino(prg){
//     return new Promise((resolve , reject) => {
//         console.log("deleting command from arduino");

//         let fetchURL = Server_Addr+'/arduino_send_command';
//         let requestObj = deleteFrmArduino;
//         requestObj.cmd.prg_id = prg.UID;
//         requestObj.cmd.type="DeletePrgStep";
//         requestObj.cmd.feeds=ConnectionDetails.feeds;
//         fetch(fetchURL , {
//             method:"POST",
//             headers:{
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//               },
//               body:JSON.stringify(requestObj)
//         }).then((res)=>{
//             console.log("DEl res from aurdino to react" , res);
//             resolve(res);
//         }).catch((err) => {
//             console.log(err);
//             reject(err);
//         });

//     })
// }

export function sendSingleCommandToArduino(msg,feed){
    console.log('msg',msg);
    return new Promise((resolve,reject)=>{
        let tempURL = Server_Addr+'/arduino_send_command';
        let requestObj = PrgObjToArduino;
        requestObj.cmd.type="SingleCmd";
        requestObj.cmd.feed=feed;
        requestObj.cmd.prg.steps=msg;
        console.log('sendsinglecommand',requestObj.cmd.prg.steps)
        axiosInstance.post(tempURL,requestObj).then((res)=>{
            console.log("Result from Send Command",res);
        }).catch((err)=>{
            console.log(err);
        })
    });
}

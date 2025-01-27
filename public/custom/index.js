const { subscribeAndListenToTopic } = require("./customMqtt");
const { server_app } = require("./customApi");
const { fetchXspecHistory, fetchXspecCalibration, updateXspecCalibration } = require('./customDatabase');

const customStart = () =>{
    try{
        const server = global.server;
        server.setupCustomRoutes('/',server_app);
        subscribeAndListenToTopic('hs1','ss1');
        // logger.info('custom functions started');
    }catch(err){
        console.log('error in starting the custom functions',err);
    }
}

module.exports = { customStart };
import { combineReducers } from '@reduxjs/toolkit';
import { authReducer, userReducer } from './userSlice';
import { updateDownloadProgress } from './updateSlice';
import { connectionReducer, mqttConnectionReducer } from './connectionSlice';
import { themeReducer } from './themeSlice';
import { messageReducer } from './messageSlice';
import { serialMessagesReducer } from './serialMessageSlice';
import { serialConnectionReducer } from './serialConnectionSlice';
import { notificationReducer } from './notificationSlice';
import customRootReducer from '../../custom/store/customReducer';


const rootReducerList = {
    auth: authReducer,
    user: userReducer ,
    notifications: notificationReducer,
    DownloadProgress: updateDownloadProgress ,
    connection_settings: connectionReducer,
    theme: themeReducer,
    mqttMessages: messageReducer,
    mqttConnections: mqttConnectionReducer,
    messages: messageReducer,
    serialMessages: serialMessagesReducer,
    serialConnections: serialConnectionReducer,

};

const rootReducer = combineReducers([rootReducerList,customRootReducer])

export default rootReducer;
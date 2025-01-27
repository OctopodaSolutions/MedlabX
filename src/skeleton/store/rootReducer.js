import { combineReducers } from '@reduxjs/toolkit';
import { authReducer, userReducer } from './userSlice';
import { downloadReducer } from './updateSlice';
import { connectionReducer } from './connectionSlice';
import { themeReducer } from './themeSlice';
import { messageReducer } from './messageSlice';
import { serialMessagesReducer } from './serialMessageSlice';
import { serialConnectionReducer } from './serialConnectionSlice';
import { notificationReducer } from './notificationSlice';
import customRootReducer from '../../custom/store/customReducer';
import { realTimeReducer } from './realTimeSlice';
import { mqttConnectionReducer } from './mqttConnectionSlice';
import { aboutReducer } from './aboutSlice';

const rootReducerList = {
    auth: authReducer,
    user: userReducer ,
    notifications: notificationReducer,
    DownloadProgress: downloadReducer ,
    connection_settings: connectionReducer,
    theme: themeReducer,
    mqttMessages: messageReducer,
    mqttConnections: mqttConnectionReducer,
    messages: messageReducer,
    serialMessages: serialMessagesReducer,
    serialConnections: serialConnectionReducer,
    realTime: realTimeReducer,
    about: aboutReducer

};

const rootReducer = rootReducerList;

export default rootReducer;
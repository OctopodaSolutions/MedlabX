import { createSlice } from '@reduxjs/toolkit';

const ACTIVATE = 'ACTIVATE';
const DEACTIVATE = 'DEACTIVATE';

const realTimeSlice = createSlice({
    name:'realTime',
    initialState:[],
    reducers:{
        activateRealTime:(state,action)=>{
            return true;
        },
        deactivateRealTime:()=>{
            return false;
        }
    }
});

export const {
    activateRealTime,
    deactivateRealTime
}=realTimeSlice.actions;

export const realTimeReducer = realTimeSlice.reducer;
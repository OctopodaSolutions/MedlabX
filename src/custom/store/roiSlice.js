import {createSlice} from '@reduxjs/toolkit';

const initialROIState = {
  roiData: [],
};

const SEND_ROI_DATA = 'SEND_ROI_DATA';

const roiSlice = createSlice({
    name:'roi',
    initialROIState,
    reducers:{
        sendRoiDataToRedux:(state,action)=>{
            return {
            ...state,
            roiData: action.payload,
            };
        }
    }
});

export const {
    sendRoiDataToRedux
} = roiSlice.actions;

export const roiReducer = roiSlice.reducer; 


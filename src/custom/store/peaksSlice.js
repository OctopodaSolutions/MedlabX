import {createSlice} from '@reduxjs/toolkit';

const SET_PEAKS='SET_PEAKS';

const initialPeakState = {
  peaks: [],
};

const peakSlice=createSlice({
    name:'peaks',
    initialPeakState,
    reducers:{
        setPeaks:(state,action)=>{
                  return {
        ...state,
        peaks: action.payload,
      };
        }
    }
});

export const {
    setPeaks
}=peakSlice.actions;

export const peakReducer = peakSlice.reducer;

// export const settingsReducer = (state = initialDevice, action) => {
//   switch (action.type) {
//     case UPDATE_DEVICE_SETTINGS:
//       return {
//         ...state,
//         settings: action.payload, 
//       };
//     default:
//       return state;
//   }
// };

import {createSlice} from '@reduxjs/toolkit';

const initialDevice = {
  settings: {},
  status: 'idle',
};

export const settingsSlice=createSlice({
    name:'settings',
    initialDevice,
    reducers:{
        updateSettings:(state,action)=>{
                  return {
                ...state,
                settings: action.payload, 
            };
        }
    }
})

export const {
    updateSettings
}=settingsSlice.actions;

export const settingsReducer=settingsSlice.reducer;
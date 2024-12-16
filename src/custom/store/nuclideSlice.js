

import {createSlice} from '@reduxjs/toolkit';

const initialnuclidelibrary = [];

export const nuclideLibSlice = createSlice({
    name:'nuclide',
    initialnuclidelibrary,
    reducers:{
        addIntoNL:(state,action)=>{
            return [...state,action.payload]
        }
    }
});

export const {
    addIntoNL
} = nuclideLibSlice.actions;

export const nuclideLibReducer=nuclideLibSlice.reducer;
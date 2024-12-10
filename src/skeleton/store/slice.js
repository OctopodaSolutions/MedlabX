import { createSlice } from '@reduxjs/toolkit';

const skeletonSlice = createSlice({
    name: 'skeleton',
    initialState: {
        layoutSettings: { theme: 'light', language: 'en' },
    },
    reducers: {
        updateLayoutSettings(state, action) {
            state.layoutSettings = { ...state.layoutSettings, ...action.payload };
        },
    },
});

export const { updateLayoutSettings } = skeletonSlice.actions;
export default skeletonSlice.reducer;
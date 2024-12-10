import { createSlice } from '@reduxjs/toolkit';

const customSlice = createSlice({
    name: 'customPluginA',
    initialState: {
        data: [],
        isLoading: false,
    },
    reducers: {
        setData(state, action) {
            state.data = action.payload;
        },
        setLoading(state, action) {
            state.isLoading = action.payload;
        },
    },
});

export const { setData, setLoading } = customSlice.actions;
export default customSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

// Initial state
const aboutInitialState = {};

// Create slice
const aboutSlice = createSlice({
  name: 'about',
  initialState: aboutInitialState,
  reducers: {
    setAbout: (state, action) => {
      // Update state with the provided payload
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

// Export actions and reducer
export const { setAbout } = aboutSlice.actions;
export const aboutReducer = aboutSlice.reducer;

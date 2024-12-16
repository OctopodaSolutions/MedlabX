import { createSlice } from '@reduxjs/toolkit';

// Action type constants (if previously defined elsewhere, import them)
const RESET_TAB = 'RESET_TAB';
const SET_TAB = 'SET_TAB';

const initTabValue = {
  tab_value: 0,
};

const tabSlice = createSlice({
  name: 'tab',
  initialState: initTabValue,
  reducers: {
    resetTab(state) {
      // returning state as-is for RESET_TAB
      return state;
    },
    setTab(state, action) {
      state.tab_value = action.payload;
    },
  },
});

// Export the generated actions
export const { resetTab, setTab } = tabSlice.actions;

// Export the reducer
export const tabReducer = tabSlice.reducer;
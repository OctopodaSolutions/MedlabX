import { createSlice } from '@reduxjs/toolkit';
import { createTheme } from '@mui/material/styles';

// Action type constants (if defined elsewhere, import them)
const ENABLE_LIGHT_THEME = 'ENABLE_LIGHT_THEME';
const ENABLE_DARK_THEME = 'ENABLE_DARK_THEME';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const themeSlice = createSlice({
  name: 'theme',
  initialState: lightTheme,
  reducers: {
    enableLightTheme() {
      console.log("enabling theme light");
      return lightTheme;
    },
    enableDarkTheme() {
      console.log("enabling theme dark");
      return darkTheme;
    }
  }
});

// Export the generated actions
export const { enableLightTheme, enableDarkTheme } = themeSlice.actions;

// Export the reducer
export const themeReducer = themeSlice.reducer;
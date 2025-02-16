import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { defaultTheme, blueTheme, greenTheme } from '../themes/theme';

export type ThemeType = 'blue' | 'green' | 'default';

interface ThemeState {
  currentTheme: ThemeType;
}

const initialState: ThemeState = {
  currentTheme: 'blue',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeType>) => {
      state.currentTheme = action.payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;

export const getThemeObject = (themeType: ThemeType) => {
  switch (themeType) {
    case 'blue':
      return blueTheme;
    case 'green':
      return greenTheme;
    default:
      return defaultTheme;
  }
};

export default themeSlice.reducer; 
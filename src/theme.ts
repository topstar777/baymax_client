import { createTheme } from '@mui/material';

export const darkTheme = createTheme({
  typography: {
    fontFamily: `'Inter', serif`,
  },

  palette: {
    mode: 'dark',
  },
});

export const lightTheme = createTheme({
  typography: {
    fontFamily: `'Inter', serif`,
  },
  palette: {
    mode: 'light',
  },
});
// lib/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#544AC4', // destaque 1
    },
    secondary: {
      main: '#FFFFFF', // destaque 2
    },
    background: {
      default: '#101018', // layer 1
      paper: '#101018', // layer 2
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

export default theme;

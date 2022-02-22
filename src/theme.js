import { createMuiTheme } from '@material-ui/core/styles';
import { blue, lightBlue, grey } from '@material-ui/core/colors';

const initialCustomTheme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: lightBlue,
    active: '#eee',
    boxShadow:
      'rgba(0, 0, 0, 0.42) 0px 10px 30px -12px, rgba(0, 0, 0, 0.12) 0px 4px 25px 0px, rgba(0, 0, 0, 0.2) 0px 8px 10px -5px',
    boxShadow_l1:
      '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    black: grey[900],
    greyWhile: '#f5f5f5',
  },
  border: {
    l1: 'solid 1px #ccc',
  },

  typography: {
    fontFamily: 'Muli',
  },
  overrides: {
    MuiDrawer: {
      paper: {
        position: 'inherit',
        overflowY: 'inherit',
      },
    },
  },
  zIndex: {
    drawer: 10,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default initialCustomTheme;

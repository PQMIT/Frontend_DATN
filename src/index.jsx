import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Highcharts from 'highcharts';
import './index.css';
import { SnackbarProvider } from 'notistack';
// import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import * as serviceWorker from './serviceWorker';

import './languages';
import Router from './router';
import store from './redux/store';
import html2canvass from 'html2canvas';
import { GoogleOAuthProvider } from '@react-oauth/google';

window.Highcharts = Highcharts;

ReactDOM.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="108546913060-gdier6c25mddr862bvqg57b60cil467h.apps.googleusercontent.com">
      <MuiThemeProvider theme={theme}>
        <Provider store={store()}>
          <SnackbarProvider>
            <Router />
          </SnackbarProvider>
        </Provider>
      </MuiThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

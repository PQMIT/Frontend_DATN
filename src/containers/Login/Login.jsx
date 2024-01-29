/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-plusplus */
/* eslint-disable no-useless-return */
/* eslint-disable react/no-unescaped-entities */
// eslint-disable-next-line
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Paper,
  Link,
  Grid,
  Typography,
  Box,
} from '@material-ui/core';
import { LockOutlined as LockOutlinedIcon } from '@material-ui/icons';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import actions from '../../redux/actions';
import useStyles from './index.style';
import loginType from '../../constants/loginType';
import { validateEmail } from '../../utils/string';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { googleLogout } from '@react-oauth/google';

const Login2 = ({ isLogin, handleLoginOrRegister }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const dispatch = useDispatch();
  const { isLoggingIn, message } = useSelector((state) => state.auth);
  useEffect(() => {
    if (isLoggingIn) return;
    if (message) {
      enqueueSnackbar(message, { variant: 'error' });
    }
  }, [isLoggingIn]);

  const handleLoginFailureGoogle = (res) => {
    console.log(res);
    enqueueSnackbar(res, { variant: 'error' });
  };

  const handleLoginSuccessGoogle = async (res) => {
    console.log(res);
    const { tokenId } = res;
    dispatch(actions.auth.login(loginType.LOGIN_GOOGLE, { tokenId }));
  };

  const handleLoginFacebook = async (res) => {
    const { accessToken, userID } = res;
    dispatch(
      actions.auth.login(loginType.LOGIN_FACEBOOK, { accessToken, userID }),
    );
  };

  const validateLogin = () => {
    let countError = 0;
    if (email.length === 0) {
      setEmailError('Email là bắt buộc');
      countError++;
    } else if (!validateEmail(email)) {
      setEmailError('Email không hợp lệ');
      countError++;
    }
    if (password.length === 0) {
      setPasswordError('Password là bắt buộc');
      countError++;
    }
    if (countError > 0) return false;
    return true;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;
    dispatch(actions.auth.login(loginType.LOGIN, { email, password }));
  };

  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };
  googleLogout();

  return (
    <Grid item xs={12} sm={12} md={12} component={Paper} elevation={6} square>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Đăng nhập
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onKeyPress={onKeyPress}
            value={email}
            onChange={(e) => {
              setEmailError('');
              setEmail(e.target.value);
            }}
            error={emailError}
            helperText={emailError}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mật khẩu"
            type="password"
            id="password"
            autoComplete="current-password"
            onKeyPress={onKeyPress}
            value={password}
            onChange={(e) => {
              setPasswordError('');
              setPassword(e.target.value);
            }}
            error={passwordError}
            helperText={passwordError}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            Đăng nhập
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              {/* <Link href="/register" variant="body2">
                Tạo tài khoản
              </Link> */}
              <Button onClick={handleLoginOrRegister}>Tạo tài khoản</Button>
            </Grid>
          </Grid>
          <Box display="flex" mt={1} alignItems="center">
            <div className={classes.divider} />
            <Typography gutterBottom align="center" variant="subtitle1">
              Hoặc
            </Typography>
            <div className={classes.divider} />
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              {/*  <GoogleLogin
                clientId="108546913060-gdier6c25mddr862bvqg57b60cil467h.apps.googleusercontent.com"
                render={(renderProps) => (
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    className={classes.submit}
                    startIcon={
                      <Avatar
                        style={{
                          height: '20px',
                          width: '20px',
                        }}
                        variant="square"
                        src="https://res.cloudinary.com/dfbongzx0/image/upload/v1621771943/m33izryay4mzslavxmyk.png"
                      />
                    }
                    onClick={renderProps.onClick}
                  >
                    Google
                  </Button>
                )}
                buttonText="Login"
                onSuccess={handleLoginSuccessGoogle}
                onFailure={handleLoginFailureGoogle}
                cookiePolicy="single_host_origin"
              /> */}
              {/* <GoogleOAuthProvider clientId="108546913060-gdier6c25mddr862bvqg57b60cil467h.apps.googleusercontent.com"> */}
              {/* <GoogleLogin
                clientId="108546913060-gdier6c25mddr862bvqg57b60cil467h.apps.googleusercontent.com"
                onSuccess={handleLoginSuccessGoogle}
                onError={handleLoginFailureGoogle}
                cookiePolicy="single_host_origin"
              /> */}
              {/* </GoogleOAuthProvider> */}
            </Grid>
            <Grid item xs={6}>
              <FacebookLogin
                appId="1335197703825731"
                // eslint-disable-next-line react/jsx-boolean-value
                autoLoad={false}
                callback={handleLoginFacebook}
                render={(renderProps) => (
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    className={classes.submit}
                    startIcon={
                      <Avatar
                        style={{
                          height: '20px',
                          width: '20px',
                        }}
                        variant="square"
                        src="https://res.cloudinary.com/dfbongzx0/image/upload/v1621771959/idn7xi1tw5blhrj8zoxk.png"
                      />
                    }
                    onClick={renderProps.onClick}
                  >
                    Facebook
                  </Button>
                )}
              />
            </Grid>
          </Grid>
        </form>
      </div>
    </Grid>
  );
};

export default Login2;

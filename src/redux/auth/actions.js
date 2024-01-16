export const actionTypes = {
  LOGIN: 'LOGIN',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  VERIFY_TOKEN: 'VERIFY_TOKEN',
  VERIFY_TOKEN_SUCCESS: 'VERIFY_TOKEN_SUCCESS',
  VERIFY_TOKEN_FAILURE: 'VERIFY_TOKEN_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
};

export function login(loginType, data) {
  return {
    type: actionTypes.LOGIN,
    loginType,
    ...data,
  };
}

export function loginSuccess(accessToken, user) {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    accessToken,
    user,
  };
}

export function loginFailure(code, message) {
  return {
    type: actionTypes.LOGIN_FAILURE,
    code,
    message,
  };
}

export function verifyToken(accessToken) {
  return {
    type: actionTypes.VERIFY_TOKEN,
    accessToken,
  };
}

export function verifyTokenSuccess(accessToken, user) {
  return {
    type: actionTypes.VERIFY_TOKEN_SUCCESS,
    accessToken,
    user,
  };
}

export function verifyTokenFailure() {
  return {
    type: actionTypes.VERIFY_TOKEN_FAILURE,
  };
}

export function logout() {
  return {
    type: actionTypes.LOGOUT,
  };
}

export function updateUser(user) {
  return {
    type: actionTypes.UPDATE_USER,
    user,
  };
}

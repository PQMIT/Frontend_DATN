import { actionTypes } from './actions';

export const initialState = {
  accessToken: null,
  isLoggingIn: false,
  verifying: false,
  loginCode: null,
  status: null,
  message: null,
  user: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOGIN:
      return { ...state, isLoggingIn: true };

    case actionTypes.LOGIN_SUCCESS: {
      const { accessToken, user } = action;
      return {
        ...state,
        isLoggingIn: false,
        status: 1,
        accessToken,
        user,
      };
    }

    case actionTypes.LOGIN_FAILURE: {
      const { code, message } = action;
      return {
        ...state,
        loginCode: code,
        message,
        status: 0,
        isLoggingIn: false,
      };
    }

    case actionTypes.VERIFY_TOKEN:
      return { ...state, verifying: true };

    case actionTypes.VERIFY_TOKEN_SUCCESS: {
      const { accessToken, user } = action;
      return {
        ...state,
        verifying: false,
        accessToken,
        user,
        status: 1,
      };
    }

    case actionTypes.VERIFY_TOKEN_FAILURE:
      return {
        ...state,
        verifying: false,
        status: 0,
        user: null,
        accessToken: null,
      };

    case actionTypes.LOGOUT:
      return { ...state, status: 0, accessToken: null, user: null };

    case actionTypes.UPDATE_USER: {
      const { user } = action;
      return { ...state, user };
    }

    default:
      return state;
  }
}

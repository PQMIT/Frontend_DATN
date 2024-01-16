/* eslint-disable no-case-declarations */
import { put, all, takeLatest, takeEvery } from 'redux-saga/effects';
import apis from '../../apis';
import actions from '../actions';
import { setCookie } from '../../utils/cookie';
import loginType from '../../constants/loginType';

function* loginSaga(data) {
  try {
    const A_WEEK = 7 * 24 * 60 * 60 * 1000;
    let res = null;
    switch (data && data.loginType) {
      case loginType.LOGIN_GOOGLE:
        const { tokenId } = data;
        res = yield apis.auth.loginByGoogle(tokenId);
        break;
      case loginType.LOGIN_FACEBOOK:
        const { accessToken, userID } = data;
        res = yield apis.auth.loginByFacebook({ accessToken, userID });
        break;
      default:
        const { email, password } = data;
        res = yield apis.auth.login(email, password);
    }

    if (res.status) {
      const { accessToken, user } = res.result;
      setCookie('accessToken', accessToken, A_WEEK);
      yield put(actions.auth.loginSuccess(accessToken, user));
    } else {
      const { code, message } = res;
      yield put(actions.auth.loginFailure(code, message));
    }
  } catch (error) {
    yield put(actions.auth.loginFailure());
  }
}

function* verifyTokenSaga({ accessToken }) {
  try {
    const data = yield apis.auth.verify(accessToken);
    if (!data.status) throw new Error();
    const { user } = data.result;
    if (user) {
      yield put(actions.auth.verifyTokenSuccess(accessToken, user));
    } else {
      yield put(actions.auth.verifyTokenFailure());
    }
  } catch (error) {
    yield put(actions.auth.verifyTokenFailure());
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.auth.actionTypes.LOGIN, loginSaga),
    takeEvery(actions.auth.actionTypes.VERIFY_TOKEN, verifyTokenSaga),
  ]);
}

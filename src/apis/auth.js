import api from './api';

export async function login(email, password) {
  const loginInfo = await api({
    method: 'POST',
    url: '/auths/login',
    data: { email, password },
  });
  return loginInfo;
}

export async function loginByGoogle(tokenId) {
  const loginInfo = await api({
    method: 'POST',
    url: '/auths/loginByGoogle',
    data: { tokenId },
  });
  return loginInfo;
}

export async function loginByFacebook({ accessToken, userID }) {
  const loginInfo = await api({
    method: 'POST',
    url: '/auths/loginByFacebook',
    data: { accessToken, userID },
  });
  return loginInfo;
}

export async function register({ name, email, password }) {
  const data = await api({
    method: 'POST',
    url: '/auths/register',
    data: { name, email, password },
  });
  return data;
}

export async function verify(accessToken) {
  const data = await api({
    method: 'GET',
    url: '/auths/verify',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return data;
}

import api from './api';

export async function updateUser(user) {
  const userInfo = await api({
    method: 'PUT',
    url: '/users',
    data: user,
  });
  return userInfo;
}

export async function changePassword(data) {
  const userInfo = await api({
    method: 'PUT',
    url: '/users/changePassword',
    data,
  });
  return userInfo;
}

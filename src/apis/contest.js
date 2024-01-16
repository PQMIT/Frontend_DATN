import api from './api';

export async function getContests(data) {
  const res = await api({
    method: 'GET',
    url: '/contests',
    param: {
      sort: data && data.sort,
      fields: data && data.fields,
    },
  });
  return res;
}
export async function getContestsJoined(data) {
  const res = await api({
    method: 'GET',
    url: '/contests/joined',
    param: {
      sort: data && data.sort,
      fields: data && data.fields,
    },
  });
  return res;
}
export async function getContestsByUser(data) {
  const res = await api({
    method: 'GET',
    url: '/contests/createByUser',
    param: {
      sort: data && data.sort,
      fields: data && data.fields,
    },
  });
  return res;
}

export async function getContest(id) {
  const res = await api({
    method: 'GET',
    url: `/contests/${id}`,
  });
  return res;
}

export async function createContest(data) {
  const res = await api({
    method: 'POST',
    url: '/contests',
    data,
  });
  return res;
}

export async function updateContest(id, data) {
  const res = await api({
    method: 'PUT',
    url: `/contests/${id}`,
    data,
  });
  return res;
}

export async function deleteContest(id) {
  const res = await api({
    method: 'DELETE',
    url: `/contests/${id}`,
  });
  return res;
}

export async function verifyPassword({ id, password }) {
  const res = await api({
    method: 'POST',
    url: `/contests/${id}/verifyPassword`,
    data: { password },
  });
  return res;
}

export async function getQuestions({ id, token }) {
  const res = await api({
    method: 'GET',
    headers: {
      'contest-token': token || null,
    },
    url: `/contests/${id}/getAllQuestion`,
  });
  return res;
}

export async function mark({ doTime, contestId, groupQuestionId, answers }) {
  const res = await api({
    method: 'POST',
    url: `/contests/${contestId}/mark`,
    data: { doTime, groupQuestionId, answers },
  });
  return res;
}

export async function getResultByContest(id) {
  const res = await api({
    method: 'GET',
    url: `/contests/${id}/results`,
  });
  return res;
}

export async function getResultByUserInContest(id) {
  const res = await api({
    method: 'GET',
    url: `/contests/${id}/results/user`,
  });
  return res;
}

export async function checkAccountRole({ contestId, userId }) {
  const res = await api({
    method: 'GET',
    url: `/contests/${contestId}/role/${userId}`,
  });
  return res;
}

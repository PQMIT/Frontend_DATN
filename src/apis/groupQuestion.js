import api from './api';

export async function getGroupQuestions(key) {
  const res = await api({
    method: 'GET',
    url: '/groupQuestions',
    params: { key },
  });
  return res;
}

export async function createGroupQuestion(data) {
  const res = await api({
    method: 'POST',
    url: '/groupQuestions',
    data,
  });
  return res;
}

export async function updateGroupQuestions(id, data) {
  const res = await api({
    method: 'PUT',
    url: `/groupQuestions/${id}`,
    data,
  });
  return res;
}

export async function deleteGroupQuestions(id) {
  const res = await api({
    method: 'DELETE',
    url: `/groupQuestions/${id}`,
  });
  return res;
}

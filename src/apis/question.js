import api from './api';

export async function getQuestionsInGroup({
  key,
  limit,
  offset,
  sort,
  fields,
  groupQuestionId,
}) {
  const res = await api({
    method: 'POST',
    url: '/questionsInGroup',
    data: {
      key,
      limit,
      offset,
      sort,
      fields,
      groupQuestionId,
    },
  });
  return res;
}

export async function getQuestion() {
  const res = await api({
    method: 'GET',
    url: '/questions/:id',
  });
  return res;
}

export async function createQuestion(data) {
  const res = await api({
    method: 'POST',
    url: '/questions',
    data,
  });
  return res;
}

export async function updateQuestion(id, data) {
  const res = await api({
    method: 'PUT',
    url: `/questions/${id}`,
    data,
  });
  return res;
}

export async function deleteQuestion(id) {
  const res = await api({
    method: 'DELETE',
    url: `/questions/${id}`,
  });
  return res;
}

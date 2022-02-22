import API from './api';

export async function uploadFile({ formData }) {
  try {
    const response = await API({
      method: 'POST',
      url: `/uploads/file`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  } catch (error) {
    return error.response;
  }
}

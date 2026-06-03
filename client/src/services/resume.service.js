import api from './api';

export const resumeService = {
  upload: (file) => {
    const form = new FormData();
    form.append('resume', file);
    return api.post('/resumes/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  list: () => api.get('/resumes'),
  get: (id) => api.get(`/resumes/${id}`),
  delete: (id) => api.delete(`/resumes/${id}`),
};

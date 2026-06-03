import api from './api';

export const jobMatchService = {
  create: (data) => api.post('/job-match', data),
  list: () => api.get('/job-match'),
  get: (id) => api.get(`/job-match/${id}`),
};

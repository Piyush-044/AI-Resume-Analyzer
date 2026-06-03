import api from './api';

export const analysisService = {
  runATS: (resumeId) => api.post(`/analysis/ats/${resumeId}`),
  list: () => api.get('/analysis'),
  get: (id) => api.get(`/analysis/${id}`),
  getLatest: (resumeId) => api.get(`/analysis/resume/${resumeId}/latest`),
};

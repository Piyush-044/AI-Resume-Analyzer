import api from './api';

export const careerService = {
  roadmap: (resumeId, targetRole) => api.post('/career/roadmap', { resumeId, targetRole }),
};

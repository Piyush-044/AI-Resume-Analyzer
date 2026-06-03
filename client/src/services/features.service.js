import api from './api';

export const featuresService = {
  optimizeLinkedIn: (resumeId) => api.post('/features/linkedin/optimize', { resumeId }),
  generatePortfolio: (resumeId) => api.post('/features/portfolio/generate', { resumeId }),
  parseResume: (resumeId) => api.post('/features/resume/parse', { resumeId }),
  getJobRecommendations: (resumeId) => api.post('/features/jobs/recommendations', { resumeId }),
};

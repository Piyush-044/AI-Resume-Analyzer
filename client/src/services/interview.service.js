import api from './api';

export const interviewService = {
  generate: (resumeId, jobDescription) => api.post('/interview/generate', { resumeId, jobDescription }),
  evaluate: (question, answer) => api.post('/interview/evaluate', { question, answer }),
};

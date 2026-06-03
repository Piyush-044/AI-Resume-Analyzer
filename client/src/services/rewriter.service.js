import api from './api';

export const rewriterService = {
  rewrite: (data) => api.post('/rewriter', data),
};

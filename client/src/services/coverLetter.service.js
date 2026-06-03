import api from './api';

export const coverLetterService = {
  generate: (data) => api.post('/cover-letter', data),
};

import { body } from 'express-validator';

export const rewriterValidator = [
  body('resumeId').notEmpty(),
  body('bullets').optional().isArray(),
];

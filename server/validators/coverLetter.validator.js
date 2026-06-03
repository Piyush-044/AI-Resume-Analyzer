import { body } from 'express-validator';

export const coverLetterValidator = [
  body('resumeId').notEmpty(),
  body('jobRole').trim().notEmpty().withMessage('Job role is required'),
  body('jobDescription').optional().isString(),
];

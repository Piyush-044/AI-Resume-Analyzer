import { body } from 'express-validator';

export const jobMatchValidator = [
  body('resumeId').notEmpty().withMessage('Resume ID is required'),
  body('jobDescription').trim().isLength({ min: 50 }).withMessage('Job description must be at least 50 characters'),
];

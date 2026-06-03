import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.middleware.js';
import { protect } from '../middleware/auth.middleware.js';
import { aiLimiter } from '../middleware/rateLimit.middleware.js';
import { coverLetterValidator } from '../validators/coverLetter.validator.js';
import * as coverLetterController from '../controllers/coverLetter.controller.js';

const router = Router();

router.post('/', protect, aiLimiter, coverLetterValidator, validate, asyncHandler(coverLetterController.generateCoverLetter));

export default router;

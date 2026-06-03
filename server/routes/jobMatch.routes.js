import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.middleware.js';
import { protect } from '../middleware/auth.middleware.js';
import { aiLimiter } from '../middleware/rateLimit.middleware.js';
import { jobMatchValidator } from '../validators/jobMatch.validator.js';
import * as jobMatchController from '../controllers/jobMatch.controller.js';

const router = Router();

router.use(protect);

router.post('/', aiLimiter, jobMatchValidator, validate, asyncHandler(jobMatchController.createJobMatch));
router.get('/', asyncHandler(jobMatchController.listJobMatches));
router.get('/:id', asyncHandler(jobMatchController.getJobMatch));

export default router;

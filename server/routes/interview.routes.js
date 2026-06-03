import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { protect } from '../middleware/auth.middleware.js';
import { aiLimiter } from '../middleware/rateLimit.middleware.js';
import { generateQuestions, evaluateAnswer } from '../controllers/interview.controller.js';

const router = Router();

router.use(protect);

router.post('/generate', aiLimiter, asyncHandler(generateQuestions));
router.post('/evaluate', aiLimiter, asyncHandler(evaluateAnswer));

export default router;

import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { protect } from '../middleware/auth.middleware.js';
import { aiLimiter } from '../middleware/rateLimit.middleware.js';
import {
  optimizeLinkedIn,
  generatePortfolio,
  parseResume,
  getJobRecommendations,
} from '../controllers/features.controller.js';

const router = Router();

router.use(protect);

router.post('/linkedin/optimize', aiLimiter, asyncHandler(optimizeLinkedIn));
router.post('/portfolio/generate', aiLimiter, asyncHandler(generatePortfolio));
router.post('/resume/parse', aiLimiter, asyncHandler(parseResume));
router.post('/jobs/recommendations', aiLimiter, asyncHandler(getJobRecommendations));

export default router;

import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { protect } from '../middleware/auth.middleware.js';
import { aiLimiter } from '../middleware/rateLimit.middleware.js';
import { generateRoadmap } from '../controllers/career.controller.js';

const router = Router();

router.use(protect);

router.post('/roadmap', aiLimiter, asyncHandler(generateRoadmap));

export default router;

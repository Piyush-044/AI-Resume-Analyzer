import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { protect } from '../middleware/auth.middleware.js';
import { aiLimiter } from '../middleware/rateLimit.middleware.js';
import * as analysisController from '../controllers/analysis.controller.js';

const router = Router();

router.use(protect);

router.post('/ats/:resumeId', aiLimiter, asyncHandler(analysisController.runATS));
router.get('/', asyncHandler(analysisController.listAnalyses));
router.get('/resume/:resumeId/latest', asyncHandler(analysisController.getLatestForResume));
router.get('/:id', asyncHandler(analysisController.getAnalysis));

export default router;

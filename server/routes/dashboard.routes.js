import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { protect } from '../middleware/auth.middleware.js';
import * as dashboardController from '../controllers/dashboard.controller.js';

const router = Router();

router.get('/stats', protect, asyncHandler(dashboardController.getStats));

export default router;

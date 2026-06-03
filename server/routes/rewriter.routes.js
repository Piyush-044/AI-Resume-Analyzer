import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.middleware.js';
import { protect } from '../middleware/auth.middleware.js';
import { aiLimiter } from '../middleware/rateLimit.middleware.js';
import { rewriterValidator } from '../validators/rewriter.validator.js';
import * as rewriterController from '../controllers/rewriter.controller.js';

const router = Router();

router.post('/', protect, aiLimiter, rewriterValidator, validate, asyncHandler(rewriterController.rewriteBullets));

export default router;

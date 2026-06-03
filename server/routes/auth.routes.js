import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.middleware.js';
import { protect } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', authLimiter, registerValidator, validate, asyncHandler(authController.register));
router.post('/login', authLimiter, loginValidator, validate, asyncHandler(authController.login));
router.get('/me', protect, asyncHandler(authController.getMe));

export default router;

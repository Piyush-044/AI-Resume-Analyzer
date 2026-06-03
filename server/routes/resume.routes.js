import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { protect } from '../middleware/auth.middleware.js';
import { uploadPdf } from '../middleware/upload.middleware.js';
import * as resumeController from '../controllers/resume.controller.js';

const router = Router();

router.use(protect);

router.post('/upload', uploadPdf.single('resume'), asyncHandler(resumeController.uploadResume));
router.get('/', asyncHandler(resumeController.listResumes));
router.get('/:id', asyncHandler(resumeController.getResume));
router.delete('/:id', asyncHandler(resumeController.deleteResume));

export default router;

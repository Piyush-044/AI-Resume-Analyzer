import { Router } from 'express';
import authRoutes from './auth.routes.js';
import resumeRoutes from './resume.routes.js';
import analysisRoutes from './analysis.routes.js';
import jobMatchRoutes from './jobMatch.routes.js';
import rewriterRoutes from './rewriter.routes.js';
import coverLetterRoutes from './coverLetter.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import interviewRoutes from './interview.routes.js';
import careerRoutes from './career.routes.js';
import featuresRoutes from './features.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/resumes', resumeRoutes);
router.use('/analysis', analysisRoutes);
router.use('/job-match', jobMatchRoutes);
router.use('/rewriter', rewriterRoutes);
router.use('/cover-letter', coverLetterRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/interview', interviewRoutes);
router.use('/career', careerRoutes);
router.use('/features', featuresRoutes);

export default router;

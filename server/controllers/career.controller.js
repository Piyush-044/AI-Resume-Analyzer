import { ApiResponse } from '../utils/ApiResponse.js';
import { resumeService } from '../services/resume.service.js';
import { pdfService } from '../services/pdf.service.js';
import { geminiService } from '../services/gemini.service.js';

export const generateRoadmap = async (req, res) => {
  const { resumeId, targetRole } = req.body;
  if (!resumeId || !targetRole) {
    return res.status(400).json({ success: false, message: 'Resume ID and Target Role are required' });
  }

  const resume = await resumeService.getByIdForUser(resumeId, req.user._id);
  const text = await pdfService.extractFromResume(resume);
  const result = await geminiService.generateCareerRoadmap(text, targetRole);

  ApiResponse.success(res, result, 'Career roadmap generated', 200);
};

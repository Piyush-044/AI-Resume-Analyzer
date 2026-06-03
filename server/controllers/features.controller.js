import { ApiResponse } from '../utils/ApiResponse.js';
import { resumeService } from '../services/resume.service.js';
import { pdfService } from '../services/pdf.service.js';
import { geminiService } from '../services/gemini.service.js';

export const optimizeLinkedIn = async (req, res) => {
  const { resumeId } = req.body;
  if (!resumeId) {
    return res.status(400).json({ success: false, message: 'Resume ID is required' });
  }

  const resume = await resumeService.getByIdForUser(resumeId, req.user._id);
  const text = await pdfService.extractFromResume(resume);
  const result = await geminiService.optimizeLinkedIn(text);

  ApiResponse.success(res, result, 'LinkedIn optimization complete', 200);
};

export const generatePortfolio = async (req, res) => {
  const { resumeId } = req.body;
  if (!resumeId) {
    return res.status(400).json({ success: false, message: 'Resume ID is required' });
  }

  const resume = await resumeService.getByIdForUser(resumeId, req.user._id);
  const text = await pdfService.extractFromResume(resume);
  const result = await geminiService.generatePortfolio(text);

  ApiResponse.success(res, result, 'Portfolio landing page code generated', 200);
};

export const parseResume = async (req, res) => {
  const { resumeId } = req.body;
  if (!resumeId) {
    return res.status(400).json({ success: false, message: 'Resume ID is required' });
  }

  const resume = await resumeService.getByIdForUser(resumeId, req.user._id);
  const text = await pdfService.extractFromResume(resume);
  const result = await geminiService.parseResume(text);

  ApiResponse.success(res, result, 'Resume text successfully parsed into fields', 200);
};

export const getJobRecommendations = async (req, res) => {
  const { resumeId } = req.body;
  if (!resumeId) {
    return res.status(400).json({ success: false, message: 'Resume ID is required' });
  }

  const resume = await resumeService.getByIdForUser(resumeId, req.user._id);
  const text = await pdfService.extractFromResume(resume);
  const result = await geminiService.getJobRecommendations(text);

  ApiResponse.success(res, result, 'Job recommendations retrieved', 200);
};

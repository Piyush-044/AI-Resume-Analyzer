import { ApiResponse } from '../utils/ApiResponse.js';
import { resumeService } from '../services/resume.service.js';
import { pdfService } from '../services/pdf.service.js';
import { geminiService } from '../services/gemini.service.js';

export const generateQuestions = async (req, res) => {
  const { resumeId, jobDescription } = req.body;
  if (!resumeId) {
    return res.status(400).json({ success: false, message: 'Resume ID is required' });
  }

  const resume = await resumeService.getByIdForUser(resumeId, req.user._id);
  const text = await pdfService.extractFromResume(resume);
  const result = await geminiService.generateInterviewQuestions(text, jobDescription || '');

  ApiResponse.success(res, result, 'Interview questions generated', 200);
};

export const evaluateAnswer = async (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ success: false, message: 'Question and answer are required' });
  }

  const result = await geminiService.evaluateAnswer(question, answer);
  ApiResponse.success(res, result, 'Answer evaluated successfully', 200);
};

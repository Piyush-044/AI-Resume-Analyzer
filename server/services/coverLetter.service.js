import { resumeService } from './resume.service.js';
import { pdfService } from './pdf.service.js';
import { geminiService } from './gemini.service.js';

export const coverLetterService = {
  async generate(userId, resumeId, jobRole, jobDescription = '') {
    const resume = await resumeService.getByIdForUser(resumeId, userId);
    const text = await pdfService.extractFromResume(resume);
    return geminiService.generateCoverLetter(text, jobRole, jobDescription);
  },
};

import { JobMatch } from '../models/JobMatch.model.js';
import { resumeService } from './resume.service.js';
import { pdfService } from './pdf.service.js';
import { geminiService } from './gemini.service.js';
import { ApiError } from '../utils/ApiError.js';

export const jobMatchService = {
  async createMatch(userId, resumeId, jobDescription) {
    const resume = await resumeService.getByIdForUser(resumeId, userId);
    const text = await pdfService.extractFromResume(resume);
    const result = await geminiService.matchJob(text, jobDescription);

    return JobMatch.create({
      userId,
      resumeId,
      jobDescription: jobDescription.slice(0, 15000),
      ...result,
    });
  },

  async listByUser(userId, limit = 20) {
    return JobMatch.find({ userId })
      .populate('resumeId', 'fileName')
      .sort({ createdAt: -1 })
      .limit(limit);
  },

  async getById(id, userId) {
    const match = await JobMatch.findOne({ _id: id, userId }).populate('resumeId', 'fileName');
    if (!match) throw new ApiError(404, 'Job match not found');
    return match;
  },
};

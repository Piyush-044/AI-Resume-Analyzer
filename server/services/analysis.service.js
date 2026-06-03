import { Analysis } from '../models/Analysis.model.js';
import { ApiError } from '../utils/ApiError.js';
import { resumeService } from './resume.service.js';
import { pdfService } from './pdf.service.js';
import { geminiService } from './gemini.service.js';

export const analysisService = {
  async runATS(resumeId, userId) {
    const resume = await resumeService.getByIdForUser(resumeId, userId);
    const text = await pdfService.extractFromResume(resume);
    const result = await geminiService.analyzeATS(text);

    const analysis = await Analysis.create({
      userId,
      resumeId,
      ...result,
      rawTextLength: text.length,
    });

    return analysis;
  },

  async listByUser(userId, limit = 20) {
    return Analysis.find({ userId })
      .populate('resumeId', 'fileName')
      .sort({ createdAt: -1 })
      .limit(limit);
  },

  async getById(id, userId) {
    const analysis = await Analysis.findOne({ _id: id, userId }).populate(
      'resumeId',
      'fileName'
    );
    if (!analysis) throw new ApiError(404, 'Analysis not found');
    return analysis;
  },

  async getLatestForResume(resumeId, userId) {
    return Analysis.findOne({ resumeId, userId }).sort({ createdAt: -1 });
  },
};

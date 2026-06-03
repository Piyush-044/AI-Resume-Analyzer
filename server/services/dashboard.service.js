import { Resume } from '../models/Resume.model.js';
import { Analysis } from '../models/Analysis.model.js';
import { JobMatch } from '../models/JobMatch.model.js';

export const dashboardService = {
  async getStats(userId) {
    const [totalResumes, latestAnalysis, recentAnalyses, recentJobMatches] = await Promise.all([
      Resume.countDocuments({ userId }),
      Analysis.findOne({ userId }).sort({ createdAt: -1 }),
      Analysis.find({ userId })
        .populate('resumeId', 'fileName')
        .sort({ createdAt: -1 })
        .limit(5),
      JobMatch.find({ userId })
        .populate('resumeId', 'fileName')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    const scoreHistory = await Analysis.find({ userId })
      .select('atsScore createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    return {
      totalResumes,
      latestAtsScore: latestAnalysis?.atsScore ?? null,
      recentAnalyses,
      recentJobMatches,
      scoreHistory: scoreHistory.reverse(),
    };
  },
};

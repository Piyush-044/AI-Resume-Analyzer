import { ApiResponse } from '../utils/ApiResponse.js';
import { analysisService } from '../services/analysis.service.js';

export const runATS = async (req, res) => {
  const analysis = await analysisService.runATS(req.params.resumeId, req.user._id);
  ApiResponse.success(res, { analysis }, 'ATS analysis complete', 201);
};

export const listAnalyses = async (req, res) => {
  const analyses = await analysisService.listByUser(req.user._id);
  ApiResponse.success(res, { analyses });
};

export const getAnalysis = async (req, res) => {
  const analysis = await analysisService.getById(req.params.id, req.user._id);
  ApiResponse.success(res, { analysis });
};

export const getLatestForResume = async (req, res) => {
  const analysis = await analysisService.getLatestForResume(
    req.params.resumeId,
    req.user._id
  );
  ApiResponse.success(res, { analysis });
};

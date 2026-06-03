import { ApiResponse } from '../utils/ApiResponse.js';
import { jobMatchService } from '../services/jobMatch.service.js';

export const createJobMatch = async (req, res) => {
  const { resumeId, jobDescription } = req.body;
  const match = await jobMatchService.createMatch(
    req.user._id,
    resumeId,
    jobDescription
  );
  ApiResponse.success(res, { match }, 'Job match complete', 201);
};

export const listJobMatches = async (req, res) => {
  const matches = await jobMatchService.listByUser(req.user._id);
  ApiResponse.success(res, { matches });
};

export const getJobMatch = async (req, res) => {
  const match = await jobMatchService.getById(req.params.id, req.user._id);
  ApiResponse.success(res, { match });
};

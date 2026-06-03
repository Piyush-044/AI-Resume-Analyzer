import { ApiResponse } from '../utils/ApiResponse.js';
import { coverLetterService } from '../services/coverLetter.service.js';

export const generateCoverLetter = async (req, res) => {
  const { resumeId, jobRole, jobDescription } = req.body;
  const result = await coverLetterService.generate(
    req.user._id,
    resumeId,
    jobRole,
    jobDescription
  );
  ApiResponse.success(res, result);
};

import { ApiResponse } from '../utils/ApiResponse.js';
import { rewriterService } from '../services/rewriter.service.js';

export const rewriteBullets = async (req, res) => {
  const { resumeId, bullets } = req.body;
  const result = await rewriterService.rewrite(req.user._id, resumeId, bullets);
  ApiResponse.success(res, result);
};

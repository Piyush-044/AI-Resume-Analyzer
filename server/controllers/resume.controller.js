import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { resumeService } from '../services/resume.service.js';

export const uploadResume = async (req, res) => {
  if (!req.file) throw new ApiError(400, 'PDF file is required');
  const resume = await resumeService.createFromUpload(req.user._id, req.file);
  ApiResponse.success(res, { resume }, 'Resume uploaded', 201);
};

export const listResumes = async (req, res) => {
  const resumes = await resumeService.listByUser(req.user._id);
  ApiResponse.success(res, { resumes });
};

export const getResume = async (req, res) => {
  const resume = await resumeService.getByIdForUser(req.params.id, req.user._id);
  ApiResponse.success(res, { resume });
};

export const deleteResume = async (req, res) => {
  await resumeService.delete(req.params.id, req.user._id);
  ApiResponse.success(res, null, 'Resume deleted');
};

import { ApiResponse } from '../utils/ApiResponse.js';
import { dashboardService } from '../services/dashboard.service.js';

export const getStats = async (req, res) => {
  const stats = await dashboardService.getStats(req.user._id);
  ApiResponse.success(res, { stats });
};

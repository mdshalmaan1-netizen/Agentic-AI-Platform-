import JobsService from './jobs.service.js';
import ApiResponse from '../../shared/utils/ApiResponse.js';
import asyncHandler from '../../shared/utils/asyncHandler.js';

export const searchJobsHandler = asyncHandler(async (req, res) => {
  const { q: query, location } = req.query;
  const userId = req.user?.id || null;

  const jobs = await JobsService.searchJobs({ query, location, userId });
  return ApiResponse.success(res, jobs, `Fetched ${jobs.length} aggregated job listings`);
});

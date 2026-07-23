import ApplicationsService from './applications.service.js';
import ApiResponse from '../../shared/utils/ApiResponse.js';
import asyncHandler from '../../shared/utils/asyncHandler.js';

export const getApplications = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'user_default';
  const applications = await ApplicationsService.getUserApplications(userId);

  // Compute live stats
  const stats = {
    applied: applications.filter((a) => a.status === 'Applied').length,
    inReview: applications.filter((a) => a.status === 'In Review').length,
    interview: applications.filter((a) => a.status === 'Interview').length,
    shortlisted: applications.filter((a) => a.status === 'Shortlisted').length,
    rejected: applications.filter((a) => a.status === 'Rejected').length,
    total: applications.length,
  };

  return ApiResponse.success(res, { applications, stats }, 'Applications and stats retrieved successfully');
});

export const createApplication = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'user_default';
  const application = await ApplicationsService.createApplication({ ...req.body, userId });
  return ApiResponse.success(res, application, 'Application submitted successfully');
});

export const updateApplication = asyncHandler(async (req, res) => {
  const { id, status } = req.body;
  const application = await ApplicationsService.updateApplicationStatus(id, status);
  return ApiResponse.success(res, application, 'Application status updated successfully');
});

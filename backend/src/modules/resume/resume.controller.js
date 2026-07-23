import ResumeService from './resume.service.js';
import ApiResponse from '../../shared/utils/ApiResponse.js';
import asyncHandler from '../../shared/utils/asyncHandler.js';

export const uploadResumeHandler = asyncHandler(async (req, res) => {
  const result = await ResumeService.uploadAndAnalyze(req.user.id, req.file);
  return ApiResponse.created(res, result, 'Resume uploaded and analyzed successfully');
});

export const getLatestResumeHandler = asyncHandler(async (req, res) => {
  const resume = await ResumeService.getLatestResume(req.user.id);
  return ApiResponse.success(res, resume, 'Resume fetched successfully');
});

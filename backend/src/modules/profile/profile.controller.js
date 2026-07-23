import ProfileService from './profile.service.js';
import ApiResponse from '../../shared/utils/ApiResponse.js';
import asyncHandler from '../../shared/utils/asyncHandler.js';

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await ProfileService.getProfile(req.user.id);
  return ApiResponse.success(res, profile, 'Profile fetched successfully');
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await ProfileService.updateProfile(req.user.id, req.body);
  return ApiResponse.success(res, profile, 'Profile updated successfully');
});

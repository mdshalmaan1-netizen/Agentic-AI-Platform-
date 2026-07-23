import coverLetterAgent from '../../agents/cover-letter.agent.js';
import ProfileRepository from '../profile/profile.repository.js';
import ApiResponse from '../../shared/utils/ApiResponse.js';
import asyncHandler from '../../shared/utils/asyncHandler.js';

export const generateCoverLetter = asyncHandler(async (req, res) => {
  const { jobDetails, tone } = req.body;
  const profile = await ProfileRepository.findByUserId(req.user.id);

  const result = await coverLetterAgent.generate(profile, jobDetails, tone);
  return ApiResponse.success(res, result, 'Cover letter generated successfully');
});

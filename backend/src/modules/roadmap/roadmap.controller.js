import roadmapAgent from '../../agents/roadmap.agent.js';
import ProfileRepository from '../profile/profile.repository.js';
import ApiResponse from '../../shared/utils/ApiResponse.js';
import asyncHandler from '../../shared/utils/asyncHandler.js';

export const generateRoadmap = asyncHandler(async (req, res) => {
  const { targetRole } = req.body;
  const profile = await ProfileRepository.findByUserId(req.user.id);
  const currentSkills = profile?.skills || [];

  const roadmapData = await roadmapAgent.generateRoadmap(targetRole || 'Full Stack Engineer', currentSkills);
  return ApiResponse.success(res, roadmapData, 'Roadmap generated successfully');
});

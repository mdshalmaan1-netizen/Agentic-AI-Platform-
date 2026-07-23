import ProfileRepository from '../profile/profile.repository.js';
import ResumeRepository from '../resume/resume.repository.js';
import AggregatorService from '../../aggregator/aggregator.service.js';
import hackathonAgent from '../../agents/hackathon.agent.js';
import ApiResponse from '../../shared/utils/ApiResponse.js';
import asyncHandler from '../../shared/utils/asyncHandler.js';

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const profile = await ProfileRepository.findByUserId(userId);
  const resume = await ResumeRepository.findLatestByUserId(userId);

  const targetRole = profile?.preferredRole || 'Software Engineer';
  const matchingJobs = await AggregatorService.searchAllJobs(targetRole, profile?.preferredLocation || '');

  const hackathonsData = await hackathonAgent.recommend(profile);

  return ApiResponse.success(
    res,
    {
      profile,
      resumeScore: resume?.analysis?.resumeScore || 0,
      atsScore: resume?.analysis?.atsScore || 0,
      matchingJobs: matchingJobs.slice(0, 5),
      hackathons: hackathonsData.recommendations || [],
      skillGaps: resume?.analysis?.missingSkills || ['TypeScript', 'Docker', 'AWS'],
    },
    'Dashboard summary retrieved'
  );
});

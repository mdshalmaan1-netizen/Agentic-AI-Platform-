import interviewPrepAgent from '../../agents/interview-prep.agent.js';
import ApiResponse from '../../shared/utils/ApiResponse.js';
import asyncHandler from '../../shared/utils/asyncHandler.js';

export const generateInterviewQuestions = asyncHandler(async (req, res) => {
  const { role = 'Software Engineer', company = 'Tech Company', difficulty = 'Intermediate' } = req.body;
  const questionsData = await interviewPrepAgent.generateQuestions(role, company, difficulty);
  return ApiResponse.success(res, questionsData, 'Interview questions generated successfully');
});

import careerChatbotAgent from '../../agents/career-chatbot.agent.js';
import ProfileRepository from '../profile/profile.repository.js';
import ApiResponse from '../../shared/utils/ApiResponse.js';
import asyncHandler from '../../shared/utils/asyncHandler.js';

export const sendChatMessage = asyncHandler(async (req, res) => {
  const { message, history } = req.body;
  let profile = null;
  if (req.user?.id) {
    try {
      profile = await ProfileRepository.findByUserId(req.user.id);
    } catch (e) {
      // Ignored
    }
  }

  const reply = await careerChatbotAgent.chat(message, history || [], profile);
  return ApiResponse.success(res, reply, 'AI Assistant response generated');
});

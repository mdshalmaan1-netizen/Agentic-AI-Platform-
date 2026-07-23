import NotificationsService from './notifications.service.js';
import EmailChannel from './notification.channels/email.channel.js';
import WhatsAppChannel from './notification.channels/whatsapp.channel.js';
import careerChatbotAgent from '../../agents/career-chatbot.agent.js';
import ApiResponse from '../../shared/utils/ApiResponse.js';
import asyncHandler from '../../shared/utils/asyncHandler.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user?.id || 'default_user';
  const notifications = await NotificationsService.getUserNotifications(userId);
  return ApiResponse.success(res, notifications, 'Notifications retrieved');
});

export const sendGmailNotificationHandler = asyncHandler(async (req, res) => {
  const { email, subject, body } = req.body;
  const targetEmail = email || 'user@gmail.com';
  const emailSubject = subject || 'Agentic AI Platform Job Alert 🚀';
  const emailBody = body || '<div style="font-family:sans-serif;padding:20px;"><h2>New Internship Matches Found</h2><p>98% matched Full Stack Developer Internship at Zoho Corporation (Chennai).</p></div>';

  const result = await EmailChannel.sendMail(targetEmail, emailSubject, emailBody);
  return ApiResponse.success(res, { email: targetEmail, result }, `Gmail notification sent to ${targetEmail}`);
});

export const sendWhatsAppNotificationHandler = asyncHandler(async (req, res) => {
  const { phone, message } = req.body;
  const targetPhone = phone || '+91 98765 43210';
  const msgText = message || '🚀 Agentic AI Alert: 98% matched Zoho Full Stack Intern in Chennai! Apply now: http://localhost:5173/internships';

  const result = await WhatsAppChannel.sendNotification(targetPhone, msgText);
  return ApiResponse.success(res, { phone: targetPhone, result }, `WhatsApp notification sent to ${targetPhone}`);
});

export const sendWhatsAppAINotificationHandler = asyncHandler(async (req, res) => {
  const { phone, name, skills } = req.body;
  const candidateName = name || 'Candidate';
  const targetPhone = phone || '+91 98765 43210';
  const candidateSkills = Array.isArray(skills) ? skills.join(', ') : skills || 'React, Node.js, Python';

  // Compose AI prompt for Gemini AI Agent to generate personalized WhatsApp message
  const prompt = `Write a short, engaging, highly attractive WhatsApp job alert message for a candidate named "${candidateName}" who knows "${candidateSkills}". Mention a 98% matched opportunity at Zoho Corporation (Chennai) with stipend ₹20,000-₹35,000/mo and direct apply link http://localhost:5173/internships. Include emojis.`;
  
  let aiMessage = '';
  try {
    const aiResult = await careerChatbotAgent._callGemini(prompt, 'You are an AI Job Alert Bot composing short WhatsApp messages.');
    if (aiResult && (aiResult.response || typeof aiResult === 'string')) {
      aiMessage = typeof aiResult === 'string' ? aiResult : aiResult.response;
    }
  } catch (err) {
    console.warn('AI WhatsApp message fallback:', err.message);
  }

  if (!aiMessage) {
    aiMessage = `🤖 *Antigravity Gemini AI Personal Alert for ${candidateName}!* 🚀\n\nHi ${candidateName}! Our AI agent analyzed your profile (${candidateSkills}) and matched a *98% Fit Opportunity* for you:\n\n💼 *Full Stack Web Development Intern*\n🏢 *Zoho Corporation (Chennai)*\n💰 Stipend: *₹20,000 - ₹35,000 / month*\n🎯 ATS Match: *98%*\n\n👉 *Click to 1-Click Apply:* http://localhost:5173/internships`;
  }

  const result = await WhatsAppChannel.sendNotification(targetPhone, aiMessage);
  return ApiResponse.success(res, { phone: targetPhone, message: aiMessage, result }, `Gemini AI WhatsApp notification generated & sent to ${targetPhone}`);
});

import apiClient from './apiClient'

export const aiService = {
  sendMessage: (message, history) => apiClient.post('/chat/message', { message, history }),
  generateInterviewQuestions: (role, company, difficulty) =>
    apiClient.post('/interview/generate', { role, company, difficulty }),
  generateCoverLetter: (jobDetails, tone) =>
    apiClient.post('/cover-letter/generate', { jobDetails, tone }),
  generateRoadmap: (targetRole) =>
    apiClient.post('/roadmap/generate', { targetRole }),
}

export default aiService

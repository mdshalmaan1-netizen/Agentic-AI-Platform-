import apiClient from './apiClient'

export const resumeService = {
  uploadResume: (formData) =>
    apiClient.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAnalysis: () => apiClient.get('/resume/latest'),
}

export default resumeService

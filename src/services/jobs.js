import apiClient from './apiClient'

export const jobsService = {
  getJobs: (params) => apiClient.get('/jobs/search', { params }),
  getJobById: (id) => apiClient.get(`/jobs/${id}`),
  getInternships: (params) => apiClient.get('/jobs/search', { params: { q: 'Internship', ...(params || {}) } }),
  getHackathons: (params) => apiClient.get('/dashboard/summary'),
  applyToJob: (id, payload) => apiClient.post(`/jobs/${id}/apply`, payload),
  bookmarkJob: (id) => apiClient.post(`/jobs/${id}/bookmark`),
}

export default jobsService

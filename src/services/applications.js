import apiClient from './apiClient'

export const applicationsService = {
  getApplications: () => apiClient.get('/applications'),
  applyToJob: (payload) => apiClient.post('/applications/apply', payload),
  updateStatus: (id, status) => apiClient.post('/applications/update', { id, status }),
}

export default applicationsService

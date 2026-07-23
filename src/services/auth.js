import apiClient from './apiClient'

export const authService = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (data) => apiClient.post('/auth/register', data),
  googleAuth: (idToken) => apiClient.post('/auth/google', { idToken }),
  logout: () => apiClient.post('/auth/logout'),
  getProfile: () => apiClient.get('/profile/me'),
  updateProfile: (profileData) => apiClient.put('/profile/me', profileData),
}

export default authService

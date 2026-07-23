import apiClient from './apiClient'

export const notificationsService = {
  getNotifications: () => apiClient.get('/notifications'),
  sendGmailNotification: (payload) => apiClient.post('/notifications/send-gmail', payload),
  sendWhatsAppNotification: (payload) => apiClient.post('/notifications/send-whatsapp', payload),
  sendWhatsAppAINotification: (payload) => apiClient.post('/notifications/send-whatsapp-ai', payload),
}

export default notificationsService

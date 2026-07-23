import { Router } from 'express';
import { getNotifications, sendGmailNotificationHandler, sendWhatsAppNotificationHandler, sendWhatsAppAINotificationHandler } from './notifications.controller.js';

const router = Router();

router.get('/', getNotifications);
router.post('/send-gmail', sendGmailNotificationHandler);
router.post('/send-whatsapp', sendWhatsAppNotificationHandler);
router.post('/send-whatsapp-ai', sendWhatsAppAINotificationHandler);

export default router;

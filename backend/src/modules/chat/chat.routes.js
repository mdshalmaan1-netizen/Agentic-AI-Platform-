import { Router } from 'express';
import { sendChatMessage } from './chat.controller.js';
import { aiRateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.post('/message', aiRateLimiter, sendChatMessage);

export default router;

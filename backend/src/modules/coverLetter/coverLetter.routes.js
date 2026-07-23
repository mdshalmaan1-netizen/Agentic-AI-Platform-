import { Router } from 'express';
import { generateCoverLetter } from './coverLetter.controller.js';
import authenticate from '../../middleware/authenticate.js';
import { aiRateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.use(authenticate);
router.post('/generate', aiRateLimiter, generateCoverLetter);

export default router;

import { Router } from 'express';
import { generateInterviewQuestions } from './interview.controller.js';
import authenticate from '../../middleware/authenticate.js';
import { aiRateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.use(authenticate);
router.post('/generate', aiRateLimiter, generateInterviewQuestions);

export default router;

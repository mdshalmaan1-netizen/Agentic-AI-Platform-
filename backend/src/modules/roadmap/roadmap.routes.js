import { Router } from 'express';
import { generateRoadmap } from './roadmap.controller.js';
import authenticate from '../../middleware/authenticate.js';
import { aiRateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.use(authenticate);
router.post('/generate', aiRateLimiter, generateRoadmap);

export default router;

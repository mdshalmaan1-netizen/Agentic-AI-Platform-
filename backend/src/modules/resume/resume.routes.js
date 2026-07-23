import { Router } from 'express';
import { uploadResumeHandler, getLatestResumeHandler } from './resume.controller.js';
import authenticate from '../../middleware/authenticate.js';
import uploadResume from '../../middleware/upload.js';
import { aiRateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.use(authenticate);

router.post('/upload', aiRateLimiter, uploadResume.single('resume'), uploadResumeHandler);
router.get('/latest', getLatestResumeHandler);

export default router;

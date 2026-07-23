import { Router } from 'express';
import { searchJobsHandler } from './jobs.controller.js';

const router = Router();

router.get('/search', searchJobsHandler);

export default router;

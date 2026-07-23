import { Router } from 'express';
import { getDashboardSummary } from './dashboard.controller.js';
import authenticate from '../../middleware/authenticate.js';

const router = Router();

router.use(authenticate);
router.get('/summary', getDashboardSummary);

export default router;

import { Router } from 'express';
import { getApplications, createApplication, updateApplication } from './applications.controller.js';

const router = Router();

router.get('/', getApplications);
router.post('/apply', createApplication);
router.post('/update', updateApplication);

export default router;

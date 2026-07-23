import { Router } from 'express';
import { getProfile, updateProfile } from './profile.controller.js';
import authenticate from '../../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/me', getProfile);
router.put('/me', updateProfile);

export default router;

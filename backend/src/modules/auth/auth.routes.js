import { Router } from 'express';
import { register, login, googleAuth, refreshToken, logout } from './auth.controller.js';
import { registerValidation, loginValidation } from './auth.validator.js';
import { authRateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authRateLimiter, registerValidation, register);
router.post('/login', authRateLimiter, loginValidation, login);
router.post('/google', authRateLimiter, googleAuth);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

export default router;

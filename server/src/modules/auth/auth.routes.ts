import { Router } from 'express';
import { asyncHandler } from '../../middlewares/asyncHandler';
import { validate } from '../../middlewares/validate';
import { requireAuth } from '../../middlewares/auth.middleware';
import { registerSchema, loginSchema } from './auth.validation';
import {
  registerHandler,
  loginHandler,
  refreshHandler,
  logoutHandler,
} from './auth.controller';

const router = Router();

router.post('/register', validate(registerSchema), asyncHandler(registerHandler));
router.post('/login', validate(loginSchema), asyncHandler(loginHandler));
router.post('/refresh', asyncHandler(refreshHandler));
router.post('/logout', requireAuth, asyncHandler(logoutHandler));

export default router;
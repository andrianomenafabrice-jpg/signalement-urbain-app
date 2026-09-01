import { Router } from 'express';
import { asyncHandler } from '../../middlewares/asyncHandler';
import { requireAuth } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/rbac.middleware';
import { statsHandler } from './admin.controller';

const router = Router();

router.get('/stats', requireAuth, requireRole('admin'), asyncHandler(statsHandler));

export default router;
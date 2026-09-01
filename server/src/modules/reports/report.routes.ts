import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { asyncHandler } from '../../middlewares/asyncHandler';
import { validate } from '../../middlewares/validate';
import { validateQuery } from '../../middlewares/validateQuery';
import { requireAuth } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/rbac.middleware';
import { uploadPhoto } from '../../middlewares/upload.middleware';
import { createReportSchema, changeStatutSchema, listReportsQuerySchema } from './report.validation';
import {
  createReportHandler,
  listReportsHandler,
  getReportHandler,
  listMineHandler,
  changeStatutHandler,
} from './report.controller';

const router = Router();

// Cible evidente pour le spam de faux signalements (section 8) : limite dediee,
// plus stricte que le limiteur global applique sur /api.
const creationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: { code: 'TROP_DE_SIGNALEMENTS', message: 'Trop de signalements crees recemment, reessaie plus tard.' },
  },
});

router.get('/mine', requireAuth, validateQuery(listReportsQuerySchema), asyncHandler(listMineHandler));
router.get('/:id', asyncHandler(getReportHandler));
router.get('/', validateQuery(listReportsQuerySchema), asyncHandler(listReportsHandler));

router.post(
  '/',
  requireAuth,
  creationLimiter,
  uploadPhoto.single('photo'),
  validate(createReportSchema),
  asyncHandler(createReportHandler)
);

router.patch('/:id/statut', requireAuth, requireRole('admin'), validate(changeStatutSchema), asyncHandler(changeStatutHandler));

export default router;
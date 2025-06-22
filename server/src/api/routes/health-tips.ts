import { Router } from 'express';
import { HealthTipsController } from '../controllers/health-tips-controller.js';
import { authenticateToken, requireRole } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/error-handler.js';

const router = Router();
const healthTipsController = new HealthTipsController();

// Public routes
router.get('/', asyncHandler(healthTipsController.getHealthTips));
router.get('/categories', asyncHandler(healthTipsController.getCategories));
router.get('/:id', asyncHandler(healthTipsController.getHealthTip));

// Protected routes
router.use(authenticateToken);

// User routes
router.post('/:id/like', asyncHandler(healthTipsController.likeHealthTip));
router.post('/:id/bookmark', asyncHandler(healthTipsController.bookmarkHealthTip));
router.get('/user/bookmarks', asyncHandler(healthTipsController.getUserBookmarks));

// Admin routes
router.post('/', requireRole(['admin', 'doctor']), asyncHandler(healthTipsController.createHealthTip));
router.put('/:id', requireRole(['admin', 'doctor']), asyncHandler(healthTipsController.updateHealthTip));
router.delete('/:id', requireRole(['admin']), asyncHandler(healthTipsController.deleteHealthTip));

export default router;

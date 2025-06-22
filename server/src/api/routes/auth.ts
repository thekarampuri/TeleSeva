import { Router } from 'express';
import { AuthController } from '../controllers/auth-controller.js';
import { authenticateToken } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/error-handler.js';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));
router.post('/refresh-token', asyncHandler(authController.refreshToken));
router.post('/forgot-password', asyncHandler(authController.forgotPassword));
router.post('/verify-email', asyncHandler(authController.verifyEmail));

// Protected routes
router.get('/profile', authenticateToken, asyncHandler(authController.getProfile));
router.put('/profile', authenticateToken, asyncHandler(authController.updateProfile));
router.post('/logout', authenticateToken, asyncHandler(authController.logout));
router.delete('/account', authenticateToken, asyncHandler(authController.deleteAccount));

export default router;

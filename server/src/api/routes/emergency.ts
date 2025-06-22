import { Router } from 'express';
import { EmergencyController } from '../controllers/emergency-controller.js';
import { authenticateToken, requireRole } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/error-handler.js';

const router = Router();
const emergencyController = new EmergencyController();

// All emergency routes require authentication
router.use(authenticateToken);

// Emergency SOS routes
router.post('/sos', asyncHandler(emergencyController.createSOSAlert));
router.get('/sos/:id', asyncHandler(emergencyController.getSOSAlert));
router.put('/sos/:id/cancel', asyncHandler(emergencyController.cancelSOSAlert));

// Emergency contacts
router.get('/contacts', asyncHandler(emergencyController.getEmergencyContacts));
router.post('/contacts', asyncHandler(emergencyController.addEmergencyContact));
router.put('/contacts/:id', asyncHandler(emergencyController.updateEmergencyContact));
router.delete('/contacts/:id', asyncHandler(emergencyController.deleteEmergencyContact));

// Emergency responder routes
router.get('/responder/alerts', requireRole(['responder', 'admin']), asyncHandler(emergencyController.getActiveAlerts));
router.put('/sos/:id/respond', requireRole(['responder', 'admin']), asyncHandler(emergencyController.respondToAlert));
router.put('/sos/:id/resolve', requireRole(['responder', 'admin']), asyncHandler(emergencyController.resolveAlert));

// Admin routes
router.get('/admin/all-alerts', requireRole(['admin']), asyncHandler(emergencyController.getAllAlerts));
router.get('/admin/stats', requireRole(['admin']), asyncHandler(emergencyController.getEmergencyStats));

export default router;

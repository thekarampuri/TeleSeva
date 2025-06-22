import { Router } from 'express';
import { ConsultationController } from '../controllers/consultation-controller.js';
import { authenticateToken, requireRole } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/error-handler.js';

const router = Router();
const consultationController = new ConsultationController();

// All consultation routes require authentication
router.use(authenticateToken);

// Patient routes
router.post('/book', asyncHandler(consultationController.bookConsultation));
router.get('/my-consultations', asyncHandler(consultationController.getPatientConsultations));
router.get('/:id', asyncHandler(consultationController.getConsultation));
router.put('/:id/cancel', asyncHandler(consultationController.cancelConsultation));

// Doctor routes
router.get('/doctor/pending', requireRole(['doctor']), asyncHandler(consultationController.getPendingConsultations));
router.put('/:id/accept', requireRole(['doctor']), asyncHandler(consultationController.acceptConsultation));
router.put('/:id/complete', requireRole(['doctor']), asyncHandler(consultationController.completeConsultation));
router.post('/:id/prescription', requireRole(['doctor']), asyncHandler(consultationController.addPrescription));

// Admin routes
router.get('/admin/all', requireRole(['admin']), asyncHandler(consultationController.getAllConsultations));
router.get('/admin/stats', requireRole(['admin']), asyncHandler(consultationController.getConsultationStats));

export default router;

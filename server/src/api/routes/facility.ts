import { Router } from 'express';
import { FacilityController } from '../controllers/facility-controller.js';
import { authenticateToken, requireRole } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/error-handler.js';

const router = Router();
const facilityController = new FacilityController();

// Public routes
router.get('/search', asyncHandler(facilityController.searchFacilities));
router.get('/nearby', asyncHandler(facilityController.getNearbyFacilities));
router.get('/types', asyncHandler(facilityController.getFacilityTypes));
router.get('/:id', asyncHandler(facilityController.getFacility));

// Protected routes
router.use(authenticateToken);

// User routes
router.post('/:id/review', asyncHandler(facilityController.addReview));
router.get('/:id/reviews', asyncHandler(facilityController.getFacilityReviews));

// Facility admin routes
router.put('/:id', requireRole(['facility_admin', 'admin']), asyncHandler(facilityController.updateFacility));
router.post('/:id/services', requireRole(['facility_admin', 'admin']), asyncHandler(facilityController.addService));

// Admin routes
router.post('/', requireRole(['admin']), asyncHandler(facilityController.createFacility));
router.delete('/:id', requireRole(['admin']), asyncHandler(facilityController.deleteFacility));
router.get('/admin/all', requireRole(['admin']), asyncHandler(facilityController.getAllFacilities));

export default router;

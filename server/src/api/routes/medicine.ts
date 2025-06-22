import { Router } from 'express';
import { MedicineController } from '../controllers/medicine-controller.js';
import { authenticateToken, requireRole } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/error-handler.js';

const router = Router();
const medicineController = new MedicineController();

// Public routes
router.get('/search', asyncHandler(medicineController.searchMedicines));
router.get('/categories', asyncHandler(medicineController.getCategories));

// Protected routes
router.use(authenticateToken);

// Patient routes
router.post('/order', asyncHandler(medicineController.createOrder));
router.get('/orders', asyncHandler(medicineController.getMyOrders));
router.get('/orders/:id', asyncHandler(medicineController.getOrder));
router.put('/orders/:id/cancel', asyncHandler(medicineController.cancelOrder));

// Pharmacy routes
router.get('/pharmacy/orders', requireRole(['pharmacy']), asyncHandler(medicineController.getPharmacyOrders));
router.put('/orders/:id/status', requireRole(['pharmacy']), asyncHandler(medicineController.updateOrderStatus));

// Admin routes
router.post('/medicines', requireRole(['admin']), asyncHandler(medicineController.addMedicine));
router.put('/medicines/:id', requireRole(['admin']), asyncHandler(medicineController.updateMedicine));
router.delete('/medicines/:id', requireRole(['admin']), asyncHandler(medicineController.deleteMedicine));

export default router;

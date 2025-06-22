import { Router } from 'express';
import { HealthController } from '@/api/controllers/HealthController';

const router = Router();
const healthController = new HealthController();

// GET /api/health/symptoms
router.get('/symptoms', healthController.getSymptoms);

// POST /api/health/symptom-check
router.post('/symptom-check', healthController.checkSymptoms);

// GET /api/health/tips
router.get('/tips', healthController.getHealthTips);

// GET /api/health/facilities
router.get('/facilities', healthController.getNearbyFacilities);

// POST /api/health/emergency
router.post('/emergency', healthController.handleEmergency);

export default router;

// routes/analyticsRoutes.js
import express from 'express';
import {
  getOverview,
  getAppointmentStats,
  getRevenueStats,
  getDoctorPerformance,
} from '../controllers/analyticsController.js';
// import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// router.use(authenticate, authorize('admin'));

router.get('/overview', getOverview);
router.get('/appointments', getAppointmentStats);
router.get('/revenue', getRevenueStats);
router.get('/doctor-performance', getDoctorPerformance);

export default router;
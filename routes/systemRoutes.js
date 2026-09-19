// routes/systemRoutes.js
import express from 'express';
import {
  getLogs,
  getActiveUsers,
  getSystemHealth,
} from '../controllers/systemController.js';
// import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// router.use(authenticate, authorize('admin'));

router.get('/logs', getLogs);
router.get('/active-users', getActiveUsers);
router.get('/health', getSystemHealth);

export default router;
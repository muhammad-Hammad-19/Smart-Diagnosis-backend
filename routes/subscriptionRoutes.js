// routes/subscriptionRoutes.js
import express from 'express';
import {
  createPlan,
  getAllPlans,
  updatePlan,
  deletePlan,
  assignPlan,
} from '../controllers/subscriptionController.js';
// import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// router.use(authenticate, authorize('admin'));

router.post('/', createPlan);
router.get('/', getAllPlans);
router.put('/:id', updatePlan);
router.delete('/:id', deletePlan);
router.post('/assign', assignPlan);

export default router;
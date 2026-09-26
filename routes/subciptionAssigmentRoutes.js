// routes/subscriptionAssignmentRoutes.js
import express from 'express';
import {
  assignPlan,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  cancelAssignment,
} from '../controllers/subscriptionAssignmentController.js';
// import { verifyToken, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

// router.use(verifyToken, authorizeRoles("admin"));

router.post('/', assignPlan);
router.get('/', getAllAssignments);
router.get('/:id', getAssignmentById);
router.put('/:id', updateAssignment);
router.delete('/:id', cancelAssignment);

export default router;
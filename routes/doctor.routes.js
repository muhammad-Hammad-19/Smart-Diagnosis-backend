// routes/doctorRoutes.js
import express from "express";
import {
  addDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctorController.js";
import { authorizeRoles, verifyToken } from "../middlewares/authMiddleware.js";
// import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// router.use(authenticate, authorize('admin'));

router.post("/",verifyToken, authorizeRoles("admin"), addDoctor);
router.get("/", getAllDoctors);
router.get("/:id", getDoctorById);
router.put("/:id", updateDoctor);

router.delete("/:id", deleteDoctor);

export default router;

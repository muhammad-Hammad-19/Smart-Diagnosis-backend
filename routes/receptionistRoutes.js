// routes/receptionistRoutes.js
import express from "express";
import {
  addReceptionist,
  getAllReceptionists,
  getReceptionistById,
  updateReceptionist,
  deleteReceptionist,
} from "../controllers/receptionistController.js";
// import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// router.use(authenticate, authorize('admin'));

router.post("/", addReceptionist);
router.get("/", getAllReceptionists);
router.get("/:id", getReceptionistById);
router.put("/:id", updateReceptionist);
router.delete("/:id", deleteReceptionist);

export default router;

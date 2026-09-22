// controllers/receptionistController.js
import {
  createReceptionist,
  getAllReceptionistsService,
  getReceptionistByIdService,
  updateReceptionistService,
  deleteReceptionistService,
} from "../services/receptionist.service.js";

// @route   POST /admin/receptionists
// @desc    Add a new receptionist (creates User + Receptionist record)
export const addReceptionist = async (req, res) => {
  try {
    const { name, email, password, shift_info } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    const { user, receptionist } = await createReceptionist({
      name,
      email,
      password,
      shift_info,
    });

    return res.status(201).json({
      message: "Receptionist added successfully",
      user,
      receptionist,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

// @route   GET /admin/receptionists
// @desc    Get list of all receptionists
export const getAllReceptionists = async (req, res) => {
  try {
    const receptionists = await getAllReceptionistsService();
    return res.status(200).json({
      message: "Receptionists fetched successfully",
      count: receptionists.length,
      receptionists,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

// @route   GET /admin/receptionists/:id
// @desc    Get single receptionist details
export const getReceptionistById = async (req, res) => {
  try {
    const { id } = req.params;
    const receptionist = await getReceptionistByIdService(id);
    return res.status(200).json({
      message: "Receptionist fetched successfully",
      receptionist,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

// @route   PUT /admin/receptionists/:id
// @desc    Update receptionist info
export const updateReceptionist = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedReceptionist = await updateReceptionistService(id, req.body);
    return res.status(200).json({
      message: "Receptionist updated successfully",
      receptionist: updatedReceptionist,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

// @route   DELETE /admin/receptionists/:id
// @desc    Remove/deactivate receptionist (soft delete)
export const deleteReceptionist = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteReceptionistService(id);
    return res.status(200).json({
      message: "Receptionist deactivated successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

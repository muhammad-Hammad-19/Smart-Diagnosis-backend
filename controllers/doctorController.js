// controllers/doctorController.js
import {
  createDoctor,
  getAllDoctorsService,
  getDoctorByIdService,
  updateDoctorService,
  deleteDoctorService,
} from "../services/doctor.service.js";

// @route   POST /admin/doctors
// @desc    Add a new doctor (Admin sets email + password directly)
export const addDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization, licenseNo } = req.body;

    if (!name || !email || !password || !specialization) {
      return res.status(400).json({
        message: "Name, email, password, and specialization are required",
      });
    }

    const { user, doctor } = await createDoctor({
      name,
      email,
      password,
      specialization,
      licenseNo,
    });

    return res.status(201).json({
      message: "Doctor added successfully",
      user,
      doctor,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

// @route   GET /admin/doctors
// @desc    Get list of all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await getAllDoctorsService();
    return res.status(200).json({
      message: "Doctors fetched successfully",
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

// @route   GET /admin/doctors/:id
// @desc    Get single doctor details
export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await getDoctorByIdService(id);
    return res.status(200).json({
      message: "Doctor fetched successfully",
      doctor,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

// @route   PUT /admin/doctors/:id
// @desc    Update doctor info (specialization, schedule, etc.)
export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDoctor = await updateDoctorService(id, req.body);
    return res.status(200).json({
      message: "Doctor updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

// @route   DELETE /admin/doctors/:id
// @desc    Remove/deactivate doctor (soft delete)
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDoctorService(id);
    return res.status(200).json({
      message: "Doctor deactivated successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

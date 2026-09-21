// controllers/doctorController.js

import { createDoctor } from "../services/doctor.service.js";

// @route   POST /admin/doctors
// @desc    Add a new doctor (creates User + Doctor record)

export const addDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization, licenseNo } = req.body;

    if (!name || !email || !specialization || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and specialization are required" });
    }

    const { user, doctor } = await createDoctor({
      name,
      email,
      password,
      specialization,
      licenseNo,
    });

    return res
      .status(201)
      .json({ message: "Doctor added successfully", user, doctor });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  }
};

// @route   GET /admin/doctors
// @desc    Get list of all doctors
export const getAllDoctors = async (req, res) => {
  // TODO: implement
};

// @route   GET /admin/doctors/:id
// @desc    Get single doctor details
export const getDoctorById = async (req, res) => {
  // TODO: implement
};

// @route   PUT /admin/doctors/:id
// @desc    Update doctor info (specialization, schedule, etc.)
export const updateDoctor = async (req, res) => {
  // TODO: implement
};

// @route   DELETE /admin/doctors/:id
// @desc    Remove/deactivate doctor (soft delete)
export const deleteDoctor = async (req, res) => {
  // TODO: implement
};

// services/doctor.service.js
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { Doctor } from "../models/doctor.model.js";

const SALT_ROUNDS = 10;

export const createDoctor = async ({
  name,
  email,
  password,
  specialization,
  licenseNo,
}) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "doctor",
  });

  const doctor = await Doctor.create({
    user_id: user._id,
    specialization,
    licenseNo,
  });

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    doctor,
  };
};

export const getAllDoctorsService = async () => {
  const doctors = await Doctor.find({ status: "active" }).populate(
    "user_id",
    "name email role status",
  );
  return doctors;
};

export const getDoctorByIdService = async (id) => {
  const doctor = await Doctor.findById(id).populate(
    "user_id",
    "name email role status",
  );
  if (!doctor) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }
  return doctor;
};

export const updateDoctorService = async (id, updates) => {
  const { name, email, specialization, licenseNo, schedule } = updates;

  const doctor = await Doctor.findById(id);
  if (!doctor) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }

  if (specialization !== undefined) doctor.specialization = specialization;
  if (licenseNo !== undefined) doctor.licenseNo = licenseNo;
  if (schedule !== undefined) doctor.schedule = schedule;
  await doctor.save();

  if (name !== undefined || email !== undefined) {
    const user = await User.findById(doctor.user_id);
    if (!user) {
      const error = new Error("Linked user account not found");
      error.statusCode = 404;
      throw error;
    }
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    await user.save();
  }

  return await Doctor.findById(id).populate(
    "user_id",
    "name email role status",
  );
};

export const deleteDoctorService = async (id) => {
  const doctor = await Doctor.findById(id);
  if (!doctor) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }

  doctor.status = "inactive";
  await doctor.save();

  await User.findByIdAndUpdate(doctor.user_id, { status: "inactive" });

  return doctor;
};

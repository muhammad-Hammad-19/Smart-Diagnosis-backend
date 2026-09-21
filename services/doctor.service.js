// services/doctor.service.js
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { Doctor } from "../models/doctor.model.js";

const SALT_ROUNDS = 10;

export const createDoctor = async ({
  name,
  email,
  specialization,
  password,
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
    user: sanitizeUser(user),
    doctor,
  };
};

const sanitizeUser = (user) => {
  const { _id, name, email, role } = user;
  return { id: _id, name, email, role };
};

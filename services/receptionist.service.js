// services/receptionist.service.js
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { Receptionist } from "../models/receptionist.model.js";

const SALT_ROUNDS = 10;

export const createReceptionist = async ({ name, email, password, shift_info }) => {
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
    role: "receptionist",
  });

  const receptionist = await Receptionist.create({
    user_id: user._id,
    shift_info,
  });

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    receptionist,
  };
};

export const getAllReceptionistsService = async () => {
  const receptionists = await Receptionist.find({ status: "active" })
    .populate("user_id", "name email role status");
  return receptionists;
};

export const getReceptionistByIdService = async (id) => {
  const receptionist = await Receptionist.findById(id)
    .populate("user_id", "name email role status");
  if (!receptionist) {
    const error = new Error("Receptionist not found");
    error.statusCode = 404;
    throw error;
  }
  return receptionist;
};

export const updateReceptionistService = async (id, updates) => {
  const { name, email, shift_info } = updates;

  const receptionist = await Receptionist.findById(id);
  if (!receptionist) {
    const error = new Error("Receptionist not found");
    error.statusCode = 404;
    throw error;
  }

  if (shift_info !== undefined) receptionist.shift_info = shift_info;
  await receptionist.save();

  if (name !== undefined || email !== undefined) {
    const user = await User.findById(receptionist.user_id);
    if (!user) {
      const error = new Error("Linked user account not found");
      error.statusCode = 404;
      throw error;
    }
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    await user.save();
  }

  return await Receptionist.findById(id).populate("user_id", "name email role status");
};

export const deleteReceptionistService = async (id) => {
  const receptionist = await Receptionist.findById(id);
  if (!receptionist) {
    const error = new Error("Receptionist not found");
    error.statusCode = 404;
    throw error;
  }

  receptionist.status = "inactive";
  await receptionist.save();

  await User.findByIdAndUpdate(receptionist.user_id, { status: "inactive" });

  return receptionist;
};
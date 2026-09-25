// models/patient.model.js
import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    contact: {
      type: String,
    },
    medical_history_summary: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Patient = mongoose.model("Patient", patientSchema);
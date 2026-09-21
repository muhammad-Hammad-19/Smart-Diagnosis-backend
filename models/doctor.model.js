import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  licenseNo: {
    type: String,
    required: true,
    unique: true,
  },
});

export const Doctor = mongoose.model("doctor", doctorSchema);
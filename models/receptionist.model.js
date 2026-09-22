// models/receptionist.model.js
import mongoose from "mongoose";

const receptionistSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    shift_info: {
      type: String, // e.g. "Morning (9am-5pm)" or "Evening (2pm-10pm)"
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true },
);

export const Receptionist = mongoose.model("Receptionist", receptionistSchema);

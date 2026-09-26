// models/systemLog.model.js
import mongoose from "mongoose";

const systemLogSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // failed login attempts me user_id na ho toh bhi chalega
    },
    action: {
      type: String, // e.g. "Created Doctor", "Logged in", "Deleted Receptionist"
      required: true,
    },
    ip_address: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } // createdAt hi hamara "timestamp" hai
);

export const SystemLog = mongoose.model("SystemLog", systemLogSchema);
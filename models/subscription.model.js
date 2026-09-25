// models/subscription.model.js
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    plan_name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    features: {
      type: [String], // e.g. ["Unlimited AI assist", "Priority support"]
      default: [],
    },
    duration_days: {
      type: Number, // e.g. 30 for monthly, 365 for yearly
      default: 30,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
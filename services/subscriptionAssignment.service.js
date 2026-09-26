// services/subscriptionAssignment.service.js
import { Subscription } from "../models/subscription.model.js";
import { SubscriptionAssignment } from "../models/subciptionAssign.model.js";

export const assignPlanService = async ({ plan_id, assigned_to }) => {
  // 1. Check the plan exists and is active
  const plan = await Subscription.findById(plan_id);
  if (!plan || plan.status !== "active") {
    const error = new Error("Subscription plan not found or inactive");
    error.statusCode = 404;
    throw error;
  }

  // 2. Calculate start_date and end_date from plan's duration
  const start_date = new Date();
  const end_date = new Date();
  end_date.setDate(start_date.getDate() + plan.duration_days);

  // 3. Create the assignment
  const assignment = await SubscriptionAssignment.create({
    plan_id,
    assigned_to,
    start_date,
    end_date,
    status: "active",
    payment_status: "paid", // simulated
  });

  return assignment;
};

export const getAllAssignmentsService = async () => {
  const assignments = await SubscriptionAssignment.find()
    .populate("plan_id", "plan_name price duration_days features")
    .populate("assigned_to", "name email role");
  return assignments;
};

export const getAssignmentByIdService = async (id) => {
  const assignment = await SubscriptionAssignment.findById(id)
    .populate("plan_id", "plan_name price duration_days features")
    .populate("assigned_to", "name email role");

  if (!assignment) {
    const error = new Error("Assignment not found");
    error.statusCode = 404;
    throw error;
  }

  return assignment;
};

export const updateAssignmentService = async (id, updates) => {
  const { status, payment_status } = updates;

  const assignment = await SubscriptionAssignment.findById(id);
  if (!assignment) {
    const error = new Error("Assignment not found");
    error.statusCode = 404;
    throw error;
  }

  if (status !== undefined) assignment.status = status;
  if (payment_status !== undefined) assignment.payment_status = payment_status;

  // If renewing, extend end_date by plan's duration again
  if (status === "active" && updates.renew === true) {
    const plan = await Subscription.findById(assignment.plan_id);
    if (plan) {
      const newEndDate = new Date(assignment.end_date);
      newEndDate.setDate(newEndDate.getDate() + plan.duration_days);
      assignment.end_date = newEndDate;
    }
  }

  await assignment.save();

  return await SubscriptionAssignment.findById(id)
    .populate("plan_id", "plan_name price duration_days features")
    .populate("assigned_to", "name email role");
};

export const cancelAssignmentService = async (id) => {
  const assignment = await SubscriptionAssignment.findByIdAndUpdate(
    id,
    { status: "cancelled" },
    { new: true },
  );

  if (!assignment) {
    const error = new Error("Assignment not found");
    error.statusCode = 404;
    throw error;
  }

  return assignment;
};

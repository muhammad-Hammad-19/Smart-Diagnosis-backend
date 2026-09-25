import { Subscription } from "../models/subscription.model.js";

// CREATE
export const createSubscription = async ({
  plan_name,
  price,
  duration_days,
  features,
}) => {
  const existingPlan = await Subscription.findOne({ plan_name });

  if (existingPlan) {
    return {
      result: null,
      message: "Plan already exists",
    };
  }

  const plan = await Subscription.create({
    plan_name,
    price,
    duration_days,
    features,
  });

  return {
    result: plan,
    message: "Plan created successfully",
  };
};

// GET ALL
export const getAllSubscriptions = async () => {
  const plans = await Subscription.find().sort({ createdAt: -1 });

  return {
    result: plans,
    message: "Plans fetched successfully",
  };
};

// UPDATE
export const updateSubscription = async (id, data) => {
  const existingPlan = await Subscription.findById(id);

  if (!existingPlan) {
    return {
      result: null,
      message: "Plan not found",
    };
  }

  if (data.plan_name && data.plan_name !== existingPlan.plan_name) {
    const duplicatePlan = await Subscription.findOne({
      plan_name: data.plan_name,
      _id: { $ne: id },
    });

    if (duplicatePlan) {
      return {
        result: null,
        message: "Another plan with this name already exists",
      };
    }
  }

  const updatedPlan = await Subscription.findByIdAndUpdate(
    id,
    { $set: data },
    {
      new: true,
      runValidators: true,
    },
  );

  return {
    result: updatedPlan,
    message: "Plan updated successfully",
  };
};

// DELETE
export const deleteSubscription = async (id) => {
  const deletedPlan = await Subscription.findByIdAndDelete(id);

  if (!deletedPlan) {
    return {
      result: null,
      message: "Plan not found",
    };
  }

  return {
    result: deletedPlan,
    message: "Plan deleted successfully",
  };
};

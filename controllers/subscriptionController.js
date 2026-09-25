import {
  createSubscription,
  getAllSubscriptions,
  updateSubscription,
  deleteSubscription,
} from "../services/subsciption.service.js";

// @route   POST /admin/subscriptions
// @desc    Create a subscription plan
export const createPlan = async (req, res) => {
  try {
    const { plan_name, price, duration_days, features } = req.body;

    if (!plan_name || price === undefined || !duration_days || !features) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const { result, message } = await createSubscription({
      plan_name,
      price,
      duration_days,
      features,
    });

    return res.status(201).json({
      message,
      result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// @route   GET /admin/subscriptions
// @desc    Get all subscription plans
export const getAllPlans = async (req, res) => {
  try {
    const { result, message } = await getAllSubscriptions();

    return res.status(200).json({
      message,
      result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// @route   PUT /admin/subscriptions/:id
// @desc    Update a subscription plan
export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;

    const { plan_name, price, duration_days, features } = req.body;

    const { result, message } = await updateSubscription(id, {
      plan_name,
      price,
      duration_days,
      features,
    });

    if (!result) {
      return res.status(404).json({
        message,
      });
    }

    return res.status(200).json({
      message,
      result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// @route   DELETE /admin/subscriptions/:id
// @desc    Remove a subscription plan
export const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;

    const { result, message } = await deleteSubscription(id);

    if (!result) {
      return res.status(404).json({
        message,
      });
    }

    return res.status(200).json({
      message,
      result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
// @route   POST /admin/subscriptions/assign
// @desc    Assign a plan to a user/clinic (simulated, no real payment)
export const assignPlan = async (req, res) => {
  // TODO: implement
};

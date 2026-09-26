// controllers/subscriptionAssignmentController.js
// Manages which plan is assigned to which user/clinic (simulated, no real payment)
import {
  assignPlanService,
  getAllAssignmentsService,
  getAssignmentByIdService,
  updateAssignmentService,
  cancelAssignmentService,
} from "../services/subscriptionAssignment.service.js";

// @route   POST /admin/subscriptions/assign
// @desc    Assign a plan to a user/clinic
export const assignPlan = async (req, res) => {
  try {
    const { plan_id, assigned_to } = req.body;

    if (!plan_id || !assigned_to) {
      return res.status(400).json({
        message: "plan_id and assigned_to are required",
      });
    }

    const assignment = await assignPlanService({ plan_id, assigned_to });

    return res.status(201).json({
      message: "Plan assigned successfully",
      assignment,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

// @route   GET /admin/subscriptions/assign
// @desc    Get all subscription assignments
export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await getAllAssignmentsService();
    return res.status(200).json({
      message: "Assignments fetched successfully",
      count: assignments.length,
      assignments,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

// @route   GET /admin/subscriptions/assign/:id
// @desc    Get a single assignment (e.g. current plan for a user/clinic)
export const getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await getAssignmentByIdService(id);
    return res.status(200).json({
      message: "Assignment fetched successfully",
      assignment,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

// @route   PUT /admin/subscriptions/assign/:id
// @desc    Update assignment status (e.g. renew, mark as paid)
export const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAssignment = await updateAssignmentService(id, req.body);
    return res.status(200).json({
      message: "Assignment updated successfully",
      assignment: updatedAssignment,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

// @route   DELETE /admin/subscriptions/assign/:id
// @desc    Cancel a subscription assignment
export const cancelAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    await cancelAssignmentService(id);
    return res.status(200).json({
      message: "Assignment cancelled successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

// controllers/systemController.js
import {
  getLogsService,
  getActiveUsersService,
  getSystemHealthService,
} from "../services/system.service.js";

// @route   GET /admin/system/logs?page=1&limit=50
// @desc    Get activity/audit logs
export const getLogs = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await getLogsService({ page, limit });
    return res.status(200).json({
      message: "Logs fetched successfully",
      ...result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

// @route   GET /admin/system/active-users
// @desc    Get currently active/online users (active in last 15 minutes)
export const getActiveUsers = async (req, res) => {
  try {
    const activeUsers = await getActiveUsersService();
    return res.status(200).json({
      message: "Active users fetched successfully",
      count: activeUsers.length,
      activeUsers,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

// @route   GET /admin/system/health
// @desc    Basic server/DB health check
export const getSystemHealth = async (req, res) => {
  try {
    const health = getSystemHealthService();
    return res.status(200).json(health);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "Server error",
    });
  }
};
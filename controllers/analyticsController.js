// controllers/analyticsController.js
import {
  getOverviewService,
  getAppointmentStatsService,
  getRevenueStatsService,
  getDoctorPerformanceService,
} from "../services/analytics.service.js";

// @route   GET /admin/analytics/overview
// @desc    Total doctors, patients, appointments today etc.
export const getOverview = async (req, res) => {
  try {
    const overview = await getOverviewService();
    return res.status(200).json({
      message: "Overview fetched successfully",
      overview,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

// @route   GET /admin/analytics/appointments?range=daily|weekly|monthly
// @desc    Appointment trends (daily/weekly/monthly)
export const getAppointmentStats = async (req, res) => {
  try {
    const { range } = req.query; // optional: daily (default) | weekly | monthly
    const trends = await getAppointmentStatsService(range);
    return res.status(200).json({
      message: "Appointment trends fetched successfully",
      range: range || "daily",
      trends,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

// @route   GET /admin/analytics/revenue
// @desc    Revenue/subscription related stats (simulated)
export const getRevenueStats = async (req, res) => {
  try {
    const revenue = await getRevenueStatsService();
    return res.status(200).json({
      message: "Revenue stats fetched successfully",
      revenue,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

// @route   GET /admin/analytics/doctor-performance
// @desc    Per-doctor performance stats
export const getDoctorPerformance = async (req, res) => {
  try {
    const performance = await getDoctorPerformanceService();
    return res.status(200).json({
      message: "Doctor performance fetched successfully",
      performance,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};
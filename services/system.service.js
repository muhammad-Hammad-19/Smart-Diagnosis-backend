// services/system.service.js
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { SystemLog } from "../models/systemLog.model.js";

// 1. Activity/audit logs — most recent first, paginated
export const getLogsService = async ({ page = 1, limit = 50 }) => {
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    SystemLog.find()
      .populate("user_id", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    SystemLog.countDocuments(),
  ]);

  return { logs, total, page: Number(page), pages: Math.ceil(total / limit) };
};

// Helper — call this from other controllers to record an action
export const createLog = async ({ user_id, action, ip_address }) => {
  try {
    await SystemLog.create({ user_id, action, ip_address });
  } catch (error) {
    console.error("Failed to write system log:", error.message);
    // Don't throw — logging failure should never break the main request
  }
};

// 2. Active users — anyone active in the last 15 minutes
export const getActiveUsersService = async () => {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

  const activeUsers = await User.find({
    lastActiveAt: { $gte: fifteenMinutesAgo },
    status: "active",
  }).select("name email role lastActiveAt");

  return activeUsers;
};

// 3. Basic server/DB health check
export const getSystemHealthService = () => {
  const dbStates = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const dbStatus = dbStates[mongoose.connection.readyState] || "unknown";

  const uptimeSeconds = process.uptime();
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);

  return {
    status: dbStatus === "connected" ? "ok" : "degraded",
    database: dbStatus,
    uptime: `${hours}h ${minutes}m`,
    timestamp: new Date().toISOString(),
  };
};

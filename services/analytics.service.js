// services/analytics.service.js
import { Doctor } from "../models/doctor.model.js";
import { Receptionist } from "../models/receptionist.model.js";
import { Patient } from "../models/patient.model.js";
import { Appointment } from "../models/appointment.model.js";
import { Subscription } from "../models/subscription.model.js";

// 1. Overview — quick dashboard snapshot
export const getOverviewService = async () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [totalDoctors, totalReceptionists, totalPatients, appointmentsToday, appointmentsThisMonth] =
    await Promise.all([
      Doctor.countDocuments({ status: "active" }),
      Receptionist.countDocuments({ status: "active" }),
      Patient.countDocuments(),
      Appointment.countDocuments({ date: { $gte: startOfToday, $lte: endOfToday } }),
      Appointment.countDocuments({ date: { $gte: startOfMonth } }),
    ]);

  return {
    totalDoctors,
    totalReceptionists,
    totalPatients,
    appointmentsToday,
    appointmentsThisMonth,
  };
};

// 2. Appointment trends — date-wise count, for charts
export const getAppointmentStatsService = async (range = "daily") => {
  let dateFormat = "%Y-%m-%d"; // daily
  if (range === "monthly") dateFormat = "%Y-%m";
  if (range === "weekly") dateFormat = "%Y-%U"; // year-week number

  const trends = await Appointment.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: "$date" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return trends.map((t) => ({ period: t._id, count: t.count }));
};

// 3. Revenue — sum of active subscriptions grouped by plan (simulated, no real payments)
export const getRevenueStatsService = async () => {
  const revenue = await Subscription.aggregate([
    { $match: { status: "active" } },
    {
      $group: {
        _id: "$plan_name",
        totalRevenue: { $sum: "$price" },
        count: { $sum: 1 },
      },
    },
    { $sort: { totalRevenue: -1 } },
  ]);

  return revenue.map((r) => ({
    plan: r._id,
    subscriberCount: r.count,
    totalRevenue: r.totalRevenue,
  }));
};

// 4. Doctor performance — appointments completed per doctor
export const getDoctorPerformanceService = async () => {
  const performance = await Appointment.aggregate([
    { $match: { status: "completed" } },
    {
      $group: {
        _id: "$doctor_id",
        patientsSeen: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "doctors",
        localField: "_id",
        foreignField: "_id",
        as: "doctorInfo",
      },
    },
    { $unwind: "$doctorInfo" },
    {
      $lookup: {
        from: "users",
        localField: "doctorInfo.user_id",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" },
    {
      $project: {
        _id: 0,
        doctorId: "$_id",
        doctorName: "$userInfo.name",
        specialization: "$doctorInfo.specialization",
        patientsSeen: 1,
      },
    },
    { $sort: { patientsSeen: -1 } },
  ]);

  return performance;
};
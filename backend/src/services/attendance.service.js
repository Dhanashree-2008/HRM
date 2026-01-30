import { Attendance, Employee } from "../models/index.js";
import { Op } from "sequelize";

export const markInService = async (employeeId) => {
  const today = new Date().toISOString().split("T")[0];

  const existing = await Attendance.findOne({
    where: { employeeId, date: today },
  });

  if (existing && existing.markIn) {
    throw new Error("Already marked in for today");
  }

  if (existing) {
    existing.markIn = new Date();
    await existing.save();
    return existing;
  }

  return Attendance.create({
    employeeId,
    date: today,
    markIn: new Date(),
  });
};

export const getAllAttendanceService = async (filters = {}) => {
  const { month, year } = filters;
  const where = {};

  if (month && year) {
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0));
    // Adjust end date to cover the last day properly if needed, but between should work for dates
    // Actually, simple string comparison might be safer if date is stored as string YYYY-MM-DD
    // But model likely defines it as DATEONLY or DATE. Assuming DATEONLY based on markInService using split("T")[0]

    // Let's use string if model uses string dates
    // markInService uses: const today = new Date().toISOString().split("T")[0];

    const startStr = startDate.toISOString().split('T')[0];
    // For end date, we want the last day of the month
    const endStr = endDate.toISOString().split('T')[0];

    where.date = {
      [Op.between]: [startStr, endStr],
    };
  }

  return Attendance.findAll({
    where,
    include: [
      {
        model: Employee,
        as: "employee",
        attributes: ["id", "fullName", "department"],
      },
    ],
    order: [["date", "ASC"]],
  });
};

export const markOutService = async (employeeId) => {
  const today = new Date().toISOString().split("T")[0];

  const attendance = await Attendance.findOne({
    where: { employeeId, date: today },
  });

  if (!attendance?.markIn) throw new Error("Mark in first");
  if (attendance.markOut) throw new Error("Already marked out today");

  attendance.markOut = new Date();
  await attendance.save();
  return attendance;
};

export const getMyAttendanceService = async (employeeId) => {
  return Attendance.findAll({
    where: { employeeId },
    order: [["date", "DESC"]],
  });
};

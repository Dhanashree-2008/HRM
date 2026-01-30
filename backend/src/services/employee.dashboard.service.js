import { Op } from "sequelize";
import {
  Attendance,
  LeaveRequest,
  EmployeeLeaveBalance,
  Task,
  Worklog,
} from "../models/index.js";

const today = new Date();
const CURRENT_YEAR = today.getFullYear();
const CURRENT_MONTH = today.getMonth() + 1;

// EMPLOYEE DASHBOARD DATA
export const getEmployeeDashboardService = async (employeeId) => {
  // Attendance summary
  const totalAttendanceDays = await Attendance.count({
    where: { employeeId },
  });

  const presentDays = await Attendance.count({
    where: {
      employeeId,
      markIn: { [Op.ne]: null },
    },
  });

  // Leave summary
  const leaveBalances = await EmployeeLeaveBalance.findAll({
    where: {
      employeeId,
      year: CURRENT_YEAR,
    },
  });

  const totalLeaves = leaveBalances.reduce(
    (sum, l) => sum + l.total,
    0
  );
  const usedLeaves = leaveBalances.reduce(
    (sum, l) => sum + l.used,
    0
  );
  const remainingLeaves = leaveBalances.reduce(
    (sum, l) => sum + l.remaining,
    0
  );

  // Task summary
  const pendingTasks = await Task.count({
    where: {
      assignedToEmployeeId: employeeId,
      status: "PENDING",
    },
  });

  const completedTasks = await Task.count({
    where: {
      assignedToEmployeeId: employeeId,
      status: "COMPLETED",
    },
  });

  // Worklogs (current month) - using date range
  const startOfMonth = `${CURRENT_YEAR}-${String(CURRENT_MONTH).padStart(2, '0')}-01`;
  const endOfMonth = new Date(CURRENT_YEAR, CURRENT_MONTH, 0).toISOString().slice(0, 10);
  
  const worklogsThisMonth = await Worklog.count({
    where: {
      employeeId,
      date: {
        [Op.between]: [startOfMonth, endOfMonth],
      },
    },
  });

  return {
    attendance: {
      totalDays: totalAttendanceDays,
      presentDays,
    },
    leaves: {
      total: totalLeaves,
      used: usedLeaves,
      remaining: remainingLeaves,
    },
    tasks: {
      pending: pendingTasks,
      completed: completedTasks,
    },
    worklogs: {
      thisMonth: worklogsThisMonth,
    },
  };
};

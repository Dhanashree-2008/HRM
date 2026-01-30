import { Op, fn, col } from "sequelize";
import { Attendance, LeaveRequest, Employee, Worklog } from "../models/index.js";

// Helper: current year
const YEAR = new Date().getFullYear();

// ================= ADMIN =================

// Monthly attendance trend (ADMIN)
export const adminMonthlyAttendanceService = async () => {
  const data = await Attendance.findAll({
    attributes: [
      [fn("MONTH", col("date")), "month"],
      [fn("COUNT", col("id")), "count"],
    ],
    where: {
      date: {
        [Op.between]: [`${YEAR}-01-01`, `${YEAR}-12-31`],
      },
      markIn: { [Op.ne]: null },
    },
    group: [fn("MONTH", col("date"))],
    order: [[fn("MONTH", col("date")), "ASC"]],
    raw: true,
  });

  return data.map((r) => ({ month: Number(r.month), count: Number(r.count) }));
};

// Monthly leave trend (ADMIN)
export const adminMonthlyLeaveService = async () => {
  const data = await LeaveRequest.findAll({
    attributes: [
      [fn("MONTH", col("fromDate")), "month"],
      [fn("COUNT", col("id")), "count"],
    ],
    where: {
      status: "APPROVED",
      fromDate: {
        [Op.between]: [`${YEAR}-01-01`, `${YEAR}-12-31`],
      },
    },
    group: [fn("MONTH", col("fromDate"))],
    order: [[fn("MONTH", col("fromDate")), "ASC"]],
    raw: true,
  });

  return data.map((r) => ({ month: Number(r.month), count: Number(r.count) }));
};

// Department-wise employee count (ADMIN)
export const departmentEmployeeCountService = async () => {
  const data = await Employee.findAll({
    attributes: [
      "department",
      [fn("COUNT", col("id")), "count"],
    ],
    group: ["department"],
    raw: true,
  });

  return data.map((r) => ({ department: r.department, count: Number(r.count) }));
};

// Monthly Hiring Trend (ADMIN)
export const adminHiringTrendService = async () => {
  const data = await Employee.findAll({
    attributes: [
      [fn("MONTH", col("dateOfJoining")), "month"],
      [fn("COUNT", col("id")), "count"]
    ],
    where: {
      dateOfJoining: {
        [Op.between]: [`${YEAR}-01-01`, `${YEAR}-12-31`]
      }
    },
    group: [fn("MONTH", col("dateOfJoining"))],
    order: [[fn("MONTH", col("dateOfJoining")), "ASC"]],
    raw: true,
  });
  return data.map(r => ({ month: Number(r.month), count: Number(r.count) }));
};

// Leave Statistics by Type (ADMIN)
export const adminLeaveStatisticsService = async () => {
  const data = await LeaveRequest.findAll({
    attributes: [
      "leaveType",
      [fn("COUNT", col("id")), "count"]
    ],
    group: ["leaveType"],
    raw: true,
  });

  return data.map(r => ({
    type: r.leaveType,
    count: Number(r.count)
  }));
};

// Overtime by Department (ADMIN)
export const adminOvertimeService = async () => {
  // Sum hoursWorked > 9 (taking 9 as standard shift end including break)
  // This is an approximation.
  // ... (keep previous implementation, it doesn't use SQL group by)
  // But I need to include it in replacement or skip it.
  // Step 250 replaced adminOvertimeService completely with JS logic.
  // The current file view (Step 309) shows it effectively commented out (lines 102-116) then redefined (lines 135-147).
  // Wait, in Step 309, lines 102-116 are commented out? NO, they are active code in `adminOvertimeService`.
  // Wait, I see lines 102-148 as the function content.
  // Lines 102-116 define `data` but never use it?
  // AND THEN lines 135 calls `Worklog.findAll` and ignores `data`.
  // Ah, my previous edit (Step 250/260) might have appended or not cleaned up?
  // Let's check Step 260 diff... 
  // It added the new functions.
  // Step 309 shows the file content.
  // Lines 102-116: `const data = await Employee.findAll...`
  // Lines 135-138: `const logs = await Worklog.findAll...`
  // And it returns `logs` based result.
  // `data` is unused variable. I should clean this up.
  // I will replace `adminOvertimeService` to be clean.

  const logs = await Worklog.findAll({
    where: { hoursWorked: { [Op.gt]: 9 } },
    include: [{ model: Employee, as: "employee", attributes: ["department"] }]
  });

  const deptMap = {};
  logs.forEach(log => {
    const dept = log.employee?.department || "Unassigned";
    if (!deptMap[dept]) deptMap[dept] = 0;
    deptMap[dept] += (Number(log.hoursWorked) - 9);
  });

  return Object.entries(deptMap).map(([k, v]) => ({ department: k, hours: Math.round(v) }));
};

// Mock Services for missing models
export const adminPerformanceMetricsService = async () => {
  // Mock trend
  return [
    { month: 1, attendance: 92, productivity: 85, quality: 88 },
    { month: 2, attendance: 93, productivity: 86, quality: 89 },
    { month: 3, attendance: 94, productivity: 87, quality: 90 },
    { month: 4, attendance: 95, productivity: 88, quality: 91 },
    { month: 5, attendance: 94, productivity: 89, quality: 92 },
    { month: 6, attendance: 95, productivity: 90, quality: 93 }
  ];
};

export const adminTrainingService = async () => {
  return { completion: 78, total: 54, completed: 42 };
};

// ================= MANAGER =================

// Monthly attendance trend (MANAGER)
export const managerMonthlyAttendanceService = async (managerEmployeeId) => {
  const manager = await Employee.findByPk(managerEmployeeId);
  if (!manager) throw new Error("Manager not found");

  const data = await Attendance.findAll({
    attributes: [
      [fn("MONTH", col("date")), "month"],
      [fn("COUNT", col("id")), "count"],
    ],
    include: [
      {
        model: Employee,
        as: "employee",
        where: { department: manager.department },
      },
    ],
    where: {
      date: {
        [Op.between]: [`${YEAR}-01-01`, `${YEAR}-12-31`],
      },
      markIn: { [Op.ne]: null },
    },
    group: [fn("MONTH", col("date"))],
    order: [[fn("MONTH", col("date")), "ASC"]],
  });

  return data.map((r) => ({ month: Number(r.get('month')), count: Number(r.get('count')) }));
};

// Monthly leave trend (MANAGER)
export const managerMonthlyLeaveService = async (managerEmployeeId) => {
  const manager = await Employee.findByPk(managerEmployeeId);
  if (!manager) throw new Error("Manager not found");

  const data = await LeaveRequest.findAll({
    attributes: [
      [fn("MONTH", col("fromDate")), "month"],
      [fn("COUNT", col("id")), "count"],
    ],
    include: [
      {
        model: Employee,
        as: "employee",
        where: { department: manager.department },
      },
    ],
    where: {
      status: "APPROVED",
      fromDate: {
        [Op.between]: [`${YEAR}-01-01`, `${YEAR}-12-31`],
      },
    },
    group: [fn("MONTH", col("fromDate"))],
    order: [[fn("MONTH", col("fromDate")), "ASC"]],
  });

  return data.map((r) => ({ month: Number(r.get('month')), count: Number(r.get('count')) }));
};

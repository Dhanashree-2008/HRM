import { Attendance, LeaveRequest, Worklog, Task, Employee } from "../models/index.js";
import { Op, Sequelize } from "sequelize";

// ATTENDANCE ANALYTICS
export const getAttendanceAnalytics = async (filters = {}) => {
  const { dateRange, department } = filters;

  const whereClause = {};
  if (dateRange?.start && dateRange?.end) {
    whereClause.date = {
      [Op.between]: [dateRange.start, dateRange.end]
    };
  }

  // If department filter is applied, we need to filter employees first
  const employeeWhere = { status: 'Active' };
  if (department && department !== 'all') {
    employeeWhere.department = department;
  }

  const totalEmployees = await Employee.count({ where: employeeWhere });

  // Get all attendance records in range
  const records = await Attendance.findAll({
    where: whereClause,
    include: [{
      model: Employee,
      as: "employee",
      where: employeeWhere,
      attributes: ["id", "fullName", "department"]
    }]
  });

  // Calculate Stats
  const presentCount = records.filter(r => r.status === 'PRESENT' || r.status === 'LATE').length;
  // Late is usually a status or derived from time. Assuming 'LATE' status exists or we check time.
  // For now rely on status field if it stores 'LATE', otherwise just 'PRESENT'.
  // If your system only marks PRESENT/ABSENT, we might need to simulate late based on time (e.g. after 9:30 AM).
  const lateCount = records.filter(r => r.status === 'LATE' || (r.markIn && new Date(r.markIn).getHours() > 9)).length;

  // Absences: In a perfect world, we have absent records. If not, it's (TotalDays * TotalEmps) - Present.
  // We'll rely on explicit 'ABSENT' status if available, else 0 for now to be safe.
  const absentCount = records.filter(r => r.status === 'ABSENT').length;

  const totalDays = new Set(records.map(r => r.date)).size || 1;
  const avgAttendance = totalEmployees > 0 ? ((presentCount / (totalDays * totalEmployees)) * 100).toFixed(1) : 0;

  // Trend Data (Monthly)
  // We'll group by month.
  const trendMap = {};
  records.forEach(r => {
    const month = new Date(r.date).toLocaleString('default', { month: 'short' });
    if (!trendMap[month]) trendMap[month] = { month, attendance: 0, late: 0, absent: 0, count: 0 };
    trendMap[month].count++;
    if (r.status === 'PRESENT' || r.status === 'LATE') trendMap[month].attendance++;
    if (r.status === 'LATE' || (r.markIn && new Date(r.markIn).getHours() > 9)) trendMap[month].late++;
    if (r.status === 'ABSENT') trendMap[month].absent++;
  });

  const trendData = Object.values(trendMap);

  // Department Stats
  const deptMap = {};
  records.forEach(r => {
    const dept = r.employee?.department || 'Unassigned';
    if (!deptMap[dept]) deptMap[dept] = { name: dept, total: 0, present: 0, late: 0, absent: 0 };
    deptMap[dept].total++; // This is total man-days, not unique employees.
    if (r.status === 'PRESENT' || r.status === 'LATE') deptMap[dept].present++;
    if (r.status === 'LATE' || (r.markIn && new Date(r.markIn).getHours() > 9)) deptMap[dept].late++;
    if (r.status === 'ABSENT') deptMap[dept].absent++;
  });

  const departmentStats = Object.values(deptMap).map(d => ({
    name: d.name,
    employees: 0, // Need unique count?
    attendance: ((d.present / d.total) * 100).toFixed(1),
    late: d.late,
    absent: d.absent,
    value: ((d.present / d.total) * 100).toFixed(1)
  }));

  // Simple aggregation for Top Performers (most present days)
  const empPerf = {};
  records.forEach(r => {
    const name = r.employee?.fullName;
    if (!empPerf[name]) empPerf[name] = { name, department: r.employee?.department, days: 0 };
    if (r.status === 'PRESENT' || r.status === 'LATE') empPerf[name].days++;
  });
  const topPerformers = Object.values(empPerf)
    .sort((a, b) => b.days - a.days)
    .slice(0, 5)
    .map(e => ({
      name: e.name,
      department: e.department,
      attendance: totalDays > 0 ? ((e.days / totalDays) * 100).toFixed(0) : 0,
      trend: "up"
    }));

  return {
    reportStats: {
      totalEmployees,
      averageAttendance: parseFloat(avgAttendance),
      totalLateArrivals: lateCount,
      totalAbsences: absentCount, // detailed logic needed for real gaps
      totalLeaves: 0, // Need to merge LeaveRequest data
      totalOvertime: 0 // Need calculation
    },
    trendData,
    departmentStats,
    topPerformers
  };
};

// ATTENDANCE REPORT
export const getAttendanceReport = async (filters = {}) => {
  const { start, end, department } = filters;

  const whereClause = {};
  if (start && end) {
    whereClause.date = {
      [Op.between]: [start, end]
    };
  }

  const employeeWhere = { status: 'Active' };
  if (department && department !== 'all') {
    employeeWhere.department = department;
  }

  const records = await Attendance.findAll({
    where: whereClause,
    include: [
      {
        model: Employee,
        as: "employee",
        where: employeeWhere,
        attributes: ["fullName", "department", "designation"],
      },
    ],
    order: [["date", "DESC"]],
  });

  return records.map((r) => ({
    date: r.date,
    markIn: r.markIn,
    markOut: r.markOut,
    status: r.status,
    employeeName: r.employee?.fullName,
    department: r.employee?.department,
    designation: r.employee?.designation,
  }));
};


// LEAVE REPORT
export const getLeaveReport = async () => {
  try {
    const records = await LeaveRequest.findAll({
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["fullName", "department", "designation"],
        },
      ],
      order: [["fromDate", "DESC"]],
    });

    return records.map((r) => ({
      employeeName: r.employee?.fullName,
      department: r.employee?.department,
      designation: r.employee?.designation,
      leaveType: r.leaveType,
      fromDate: r.fromDate,
      toDate: r.toDate,
      status: r.status,
    }));
  } catch (err) {
    console.error("❌ Leave report error:", err);
    throw err;
  }
};


// WORKLOG REPORT
export const getWorklogReport = async () => {
  const records = await Worklog.findAll({
    include: [
      {
        model: Employee,
        as: "employee",
        attributes: ["fullName", "department"],
      },
    ],
    order: [["date", "DESC"]],
  });

  return records.map((r) => ({
    date: r.date,
    description: r.description,
    hoursWorked: r.hoursWorked,
    employeeName: r.employee?.fullName,
    department: r.employee?.department,
  }));
};


// TASK REPORT
export const getTaskReport = async () => {
  const records = await Task.findAll({
    include: [
      { model: Employee, as: "assignee", attributes: ["fullName"] },
      { model: Employee, as: "assigner", attributes: ["fullName"] },
    ],
    order: [["createdAt", "DESC"]],
  });

  return records.map((r) => ({
    title: r.title,
    status: r.status,
    priority: r.priority,
    dueDate: r.dueDate,
    assignedTo: r.assignee?.fullName,
    assignedBy: r.assigner?.fullName,
  }));
};

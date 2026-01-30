// src/services/manager.service.js
import { Op } from "sequelize";
import { Employee, Attendance, User } from "../models/index.js";

export const getTeamAttendanceService = async (user, date = null) => {
  const searchDate = date || new Date().toISOString().slice(0, 10);
  const startOfMonth = new Date(searchDate);
  startOfMonth.setDate(1);
  const startOfMonthStr = startOfMonth.toISOString().slice(0, 10);

  const employeeWhere = {};
  /* 
  // User requested to allow Managers to handle ALL users
  if (user.role === "MANAGER") {
    const managerEmp = await Employee.findByPk(user.employeeId);
    if (!managerEmp) throw new Error("Manager profile not found");
    employeeWhere.department = managerEmp.department;
  }
  */

  const employees = await Employee.findAll({
    where: employeeWhere,
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "email"],
        required: false,
      },
      // Fetch today's record
      {
        model: Attendance,
        as: "attendanceRecords",
        where: { date: searchDate },
        required: false,
      },
    ],
    order: [["fullName", "ASC"]],
  });

  // Fetch month's attendance for all these employees to calculate score
  const employeeIds = employees.map(e => e.id);
  const monthlyAttendance = await Attendance.findAll({
    where: {
      employeeId: employeeIds,
      date: { [Op.gte]: startOfMonthStr, [Op.lte]: searchDate }
    }
  });

  // Calculate distinct working days so far in this month (simple approximation: max unique dates found in DB or just usage of current date day)
  // Converting searchDate to day number
  const daysSoFar = new Date(searchDate).getDate();

  return employees.map((emp) => {
    const record = emp.attendanceRecords?.[0] || null;

    // Determine status based on attendance record
    let status = "ABSENT";
    if (record) {
      if (record.status) {
        status = record.status.toUpperCase();
      } else if (record.markIn && record.markOut) {
        status = "PRESENT";
      } else if (record.markIn && !record.markOut) {
        status = "PRESENT_NO_LOGOUT";
      } else {
        status = "ABSENT";
      }
    }

    // Calculate Score
    // Filter this employee's records
    const empRecords = monthlyAttendance.filter(r => r.employeeId === emp.id);
    // Count "good" days (Present, Late, Half-day counts as 0.5 maybe? keeping it simple for now)
    const presentCount = empRecords.filter(r =>
      ['PRESENT', 'LATE', 'HALF_DAY', 'PRESENT_NO_LOGOUT'].includes(r.status?.toUpperCase())
    ).length;

    // Prevent division by zero, default to 100 if daysSoFar is 0 (start of month)
    // Capping at 100 in case of extra records
    const score = daysSoFar > 0 ? Math.min(100, Math.round((presentCount / daysSoFar) * 100)) : 100;

    return {
      id: record?.id,
      employeeId: emp.id,
      fullName: emp.fullName,
      employeeCode: emp.employeeCode,
      department: emp.department,
      designation: emp.designation,
      email: emp.user?.email || null,
      phone: emp.phone,
      status: status,
      markIn: record?.markIn,
      markOut: record?.markOut,
      notes: record?.notes || null,
      attendanceScore: score, // Added Field
    };
  });
};

export const markTeamAttendanceService = async (payload) => {
  const { employeeId, status, date, notes } = payload;
  const searchDate = date || new Date().toISOString().slice(0, 10);

  let record = await Attendance.findOne({
    where: { employeeId, date: searchDate }
  });

  if (record) {
    record.status = status.toUpperCase();
    record.notes = notes;
    // Auto-fill times if marking present and they are null
    if (status.toUpperCase() === 'PRESENT') {
      if (!record.markIn) record.markIn = new Date(`${searchDate}T09:00:00`);
      if (!record.markOut) record.markOut = new Date(`${searchDate}T18:00:00`);
    } else if (status.toUpperCase() === 'ABSENT') {
      record.markIn = null;
      record.markOut = null;
    }
    await record.save();
  } else {
    let markIn = null;
    let markOut = null;
    if (status.toUpperCase() === 'PRESENT') {
      markIn = new Date(`${searchDate}T09:00:00`);
      markOut = new Date(`${searchDate}T18:00:00`);
    }
    record = await Attendance.create({
      employeeId,
      date: searchDate,
      status: status.toUpperCase(),
      notes,
      markIn,
      markOut
    });
  }
  return record;
};

export const getTeamAttendanceAnalyticsService = async (user) => {
  const employeeWhere = {};
  if (user.role === "MANAGER") {
    const managerEmp = await Employee.findByPk(user.employeeId);
    if (!managerEmp) throw new Error("Manager profile not found");
    employeeWhere.department = managerEmp.department;
  }

  const teamEmployees = await Employee.findAll({
    where: employeeWhere,
    attributes: ['id', 'fullName', 'department']
  });

  const employeeIds = teamEmployees.map(e => e.id);
  const totalEmployees = teamEmployees.length;

  if (totalEmployees === 0) return { trends: {}, departmentStats: [] };

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [weeklyAttendance, monthlyAttendance] = await Promise.all([
    Attendance.findAll({
      where: {
        employeeId: employeeIds,
        date: { [Op.gte]: startOfWeek.toISOString().slice(0, 10) }
      }
    }),
    Attendance.findAll({
      where: {
        employeeId: employeeIds,
        date: { [Op.gte]: startOfMonth.toISOString().slice(0, 10) }
      }
    })
  ]);

  // Attendance rate = (Present Records) / (Expected Records)
  // Simplified for now: count distinct active days vs total team size * days
  const calculateRate = (records, daysCount) => {
    if (daysCount === 0 || totalEmployees === 0) return 0;
    const presentRecords = records.filter(r => r.status === 'PRESENT' || r.status === 'LATE').length;
    return Math.round((presentRecords / (totalEmployees * daysCount)) * 100);
  };

  const daysThisWeek = today.getDay() + 1;
  const daysThisMonth = today.getDate();

  const weeklyRate = calculateRate(weeklyAttendance, daysThisWeek);
  const monthlyRate = calculateRate(monthlyAttendance, daysThisMonth);
  const lateCount = monthlyAttendance.filter(r => r.status === 'LATE').length;
  const lateRate = totalEmployees > 0 ? Math.round((lateCount / (totalEmployees * daysThisMonth)) * 100) : 0;

  // Department Stats
  const deptMap = {};
  teamEmployees.forEach(e => {
    if (!deptMap[e.department]) deptMap[e.department] = { count: 0, present: 0 };
    deptMap[e.department].count++;
  });

  const todayStr = today.toISOString().slice(0, 10);
  const todaysAttendance = await Attendance.findAll({
    where: { employeeId: employeeIds, date: todayStr }
  });

  todaysAttendance.forEach(a => {
    const emp = teamEmployees.find(e => e.id === a.employeeId);
    if (emp && (a.status === 'PRESENT' || a.status === 'LATE')) {
      deptMap[emp.department].present++;
    }
  });

  const departmentStats = Object.keys(deptMap).map(name => ({
    name,
    present: Math.round((deptMap[name].present / deptMap[name].count) * 100),
    employees: deptMap[name].count
  }));

  return {
    trends: {
      weekly: weeklyRate,
      monthly: monthlyRate,
      late: lateRate
    },
    departmentStats
  };
};

export const getTeamMonthlyAttendanceService = async (user, month, year) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-${daysInMonth}`;

  const employeeWhere = {};
  if (user.role === "MANAGER") {
    const managerEmp = await Employee.findByPk(user.employeeId);
    if (!managerEmp) throw new Error("Manager profile not found");
    employeeWhere.department = managerEmp.department;
  }

  const employees = await Employee.findAll({
    where: employeeWhere,
    attributes: ['id', 'fullName', 'department'],
    order: [['fullName', 'ASC']]
  });

  const employeeIds = employees.map(e => e.id);

  const attendance = await Attendance.findAll({
    where: {
      employeeId: employeeIds,
      date: {
        [Op.between]: [startDate, endDate]
      }
    }
  });

  return employees.map(emp => {
    const records = attendance.filter(a => a.employeeId === emp.id);
    return {
      id: emp.id,
      fullName: emp.fullName,
      department: emp.department,
      attendance: records.map(r => ({
        date: r.date,
        status: r.status,
        markIn: r.markIn,
        markOut: r.markOut
      }))
    };
  });
};

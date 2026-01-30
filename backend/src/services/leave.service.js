import {
  Employee,
  LeaveRequest,
  LeaveType,
  EmployeeLeaveBalance,
} from "../models/index.js";
import { Op } from "sequelize";
import { createNotification } from "./notification.service.js";
import { sendEmail } from "../utils/email.js";

const CURRENT_YEAR = new Date().getFullYear();

// Helper: calculate number of leave days
const calculateDays = (fromDate, toDate) => {
  const start = new Date(fromDate);
  const end = new Date(toDate);
  return Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
};

// ================= EMPLOYEE =================

// Apply for leave
export const applyLeaveService = async (employeeId, data) => {
  const { leaveType, fromDate, toDate, reason } = data;

  if (!leaveType || !fromDate || !toDate) {
    throw new Error("leaveType, fromDate and toDate are required");
  }

  const days = calculateDays(fromDate, toDate);

  // 1️⃣ Validate leave type
  // Accept either code or name for flexibility
  const type = await LeaveType.findOne({ where: { [Op.or]: [{ code: leaveType }, { name: leaveType }] } });
  if (!type) {
    throw new Error("Invalid leave type");
  }

  // 2️⃣ Check leave balance
  const balance = await EmployeeLeaveBalance.findOne({
    where: {
      employeeId,
      leaveTypeId: type.id,
      year: CURRENT_YEAR,
    },
  });

  if (!balance || balance.remaining < days) {
    throw new Error("Insufficient leave balance");
  }

  // 3️⃣ Get employee profile
  const employee = await Employee.findByPk(employeeId);
  if (!employee) {
    throw new Error("Employee not found");
  }

  // 4️⃣ LEAVE COLLISION CHECK (exclude self)
  const collisions = await LeaveRequest.findAll({
    where: {
      employeeId: { [Op.ne]: employeeId },
      status: { [Op.in]: ["PENDING", "APPROVED"] },
      fromDate: { [Op.lte]: toDate },
      toDate: { [Op.gte]: fromDate },
    },
    include: [
      {
        model: Employee,
        as: "employee",
        where: {
          department: employee.department,
          designation: employee.designation,
        },
      },
    ],
  });

  const hasCollision = collisions.length > 0;
  const collisionCount = collisions.length;
  // Auto leave approval rule
  const shouldAutoApproveLeave = ({ days, hasCollision }) => {
    // Rule 1: Only 1-day leave
    if (days > 1) return false;

    // Rule 2: No collision
    if (hasCollision) return false;

    return true;
  };

  // 🔹 AUTO APPROVAL CHECK
  const autoApprove = shouldAutoApproveLeave({
    days,
    hasCollision,
  });

  let finalStatus = "PENDING";

  // If auto-approved → deduct balance immediately
  if (autoApprove) {
    finalStatus = "APPROVED";

    balance.used += days;
    balance.remaining -= days;
    await balance.save();
  }

  // 5️⃣ Create leave request
  const leave = await LeaveRequest.create({
    employeeId,
    leaveType,
    fromDate,
    toDate,
    reason,
    status: finalStatus,
    hasCollision,
    collisionCount,
  });

  // 6️⃣ Notify managers of the department
  if (autoApprove) {
    // 🔔 Notify employee (auto-approved)
    await createNotification({
      userId: employee.userId,
      title: "Leave Auto-Approved",
      message: "Your leave has been automatically approved",
      type: "LEAVE",
    });
  } else {
    // 🔔 Notify managers (manual approval)
    const managers = await Employee.findAll({
      where: {
        department: employee.department,
        designation: { [Op.like]: "%Manager%" },
      },
    });

    for (const manager of managers) {
      await createNotification({
        userId: manager.userId,
        title: "New Leave Request",
        message: `${employee.fullName} applied for leave`,
        type: "LEAVE",
      });
    }

    // Send email to all involved managers (if emails available)
    const managerEmails = (
      await Promise.all(
        managers.map(async (m) => {
          const user = await m.getUser();
          return user ? user.email : null;
        })
      )
    ).filter(Boolean);

    if (managerEmails.length > 0) {
      await sendEmail({
        to: managerEmails.join(","),
        subject: "New Leave Request",
        text: `${employee.fullName} has applied for leave.`,
      });
    }
  }

  return leave;
};

// Employee: my leave history
export const getMyLeavesService = async (employeeId) => {
  return LeaveRequest.findAll({
    where: { employeeId },
    order: [["fromDate", "DESC"]],
  });
};

// ================= MANAGER / ADMIN =================

// Pending leaves (with collision info)
export const getPendingLeavesService = async (user) => {
  const whereLeave = { status: "PENDING" };

  const include = [
    {
      model: Employee,
      as: "employee",
      attributes: ["id", "fullName", "department", "designation"],
    },
  ];

  if (user.role === "MANAGER") {
    if (!user.employeeId) {
      throw new Error("Manager employee profile not linked");
    }

    const managerEmp = await Employee.findByPk(user.employeeId);
    if (!managerEmp) {
      throw new Error("Manager employee profile not found");
    }

    include[0].where = { department: managerEmp.department };
  }

  const leaves = await LeaveRequest.findAll({
    where: whereLeave,
    include,
    order: [["fromDate", "ASC"]],
  });

  // Filter out any orphaned leave requests that don't have an employee join
  const filtered = leaves.filter((l) => l.employee);
  if (filtered.length !== leaves.length) {
    // Log once when orphaned records are found so admins can inspect
    console.warn(`Filtered ${leaves.length - filtered.length} orphaned leave requests without employee profile`);
  }

  // Return Sequelize instances (with included employee) so controller can map/format
  return filtered;
};

// All leaves (for Admin/Manager View)
export const getAllLeavesService = async (user, filters = {}) => {
  const whereLeave = {};

  if (filters.status && filters.status !== 'all') {
    whereLeave.status = filters.status.toUpperCase();
  }

  const include = [
    {
      model: Employee,
      as: "employee",
      attributes: ["id", "fullName", "department", "designation", "employeeCode"],
    },
  ];

  if (user.role === "MANAGER") {
    if (!user.employeeId) {
      throw new Error("Manager employee profile not linked");
    }

    const managerEmp = await Employee.findByPk(user.employeeId);
    if (!managerEmp) {
      throw new Error("Manager employee profile not found");
    }

    include[0].where = { department: managerEmp.department };
  }

  const leaves = await LeaveRequest.findAll({
    where: whereLeave,
    include,
    order: [["createdAt", "DESC"]],
  });

  return leaves;
};

// Approve / Reject leave
export const updateLeaveStatusService = async (user, leaveId, newStatus) => {
  if (!["APPROVED", "REJECTED"].includes(newStatus)) {
    throw new Error("Invalid leave status");
  }

  const leave = await LeaveRequest.findByPk(leaveId, {
    include: [{ model: Employee, as: "employee" }],
  });

  if (!leave) {
    throw new Error("Leave request not found");
  }

  if (leave.status !== "PENDING") {
    throw new Error("Leave already processed");
  }

  // Manager department check
  if (user.role === "MANAGER") {
    const managerEmp = await Employee.findByPk(user.employeeId);
    if (!managerEmp || managerEmp.department !== leave.employee.department) {
      throw new Error("Not allowed to approve/reject this leave");
    }
  }

  // If APPROVED → deduct balance
  if (newStatus === "APPROVED") {
    const days = calculateDays(leave.fromDate, leave.toDate);

    const type = await LeaveType.findOne({
      where: { code: leave.leaveType },
    });

    const balance = await EmployeeLeaveBalance.findOne({
      where: {
        employeeId: leave.employeeId,
        leaveTypeId: type.id,
        year: CURRENT_YEAR,
      },
    });

    if (!balance || balance.remaining < days) {
      throw new Error("Insufficient leave balance");
    }

    balance.used += days;
    balance.remaining -= days;
    await balance.save();
  }

  leave.status = newStatus;
  leave.approverId = user.employeeId || null;
  await leave.save();

  // Notify employee
  await createNotification({
    userId: leave.employee.userId,
    title: "Leave Status Updated",
    message: `Your leave has been ${newStatus}`,
    type: "LEAVE",
  });

  // Send email if employee user has an email
  const empUser = await leave.employee.getUser();
  if (empUser && empUser.email) {
    await sendEmail({
      to: empUser.email,
      subject: "Leave Status Update",
      text: `Your leave has been ${newStatus}.`,
    });
  }

  return leave;
};

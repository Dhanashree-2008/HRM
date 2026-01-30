// src/controllers/leave.controller.js
import {
  applyLeaveService,
  getMyLeavesService,
  getPendingLeavesService,
  getAllLeavesService,
  updateLeaveStatusService,
} from "../services/leave.service.js";

export const applyLeaveController = async (req, res) => {
  try {
    const employeeId = req.user.employeeId;
    const leave = await applyLeaveService(employeeId, req.body);
    res.status(201).json({
      message: "Leave applied successfully",
      leave,
    });
  } catch (err) {
    console.error("Apply leave error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

export const myLeavesController = async (req, res) => {
  try {
    const employeeId = req.user.employeeId;
    const leaves = await getMyLeavesService(employeeId);
    res.json(leaves);
  } catch (err) {
    console.error("My leaves error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

export const pendingLeavesController = async (req, res) => {
  try {
    const user = req.user;
    const leaves = await getPendingLeavesService(user);

    const response = leaves.map((leave) => ({
      id: leave.id,
      leaveType: leave.leaveType,
      fromDate: leave.fromDate,
      toDate: leave.toDate,
      status: leave.status,
      reason: leave.reason,
      employee: {
        id: leave.employee?.id ?? null,
        fullName: leave.employee?.fullName ?? "Unknown",
        employeeCode: leave.employee?.employeeCode ?? "-",
        department: leave.employee?.department ?? "-",
        designation: leave.employee?.designation ?? "-",
      },
    }));

    res.json(response);
  } catch (err) {
    console.error("Pending leaves error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

export const getAllLeavesController = async (req, res) => {
  try {
    const user = req.user;
    const { status } = req.query;
    const leaves = await getAllLeavesService(user, { status });

    const response = leaves.map((leave) => ({
      id: leave.id,
      leaveType: leave.leaveType,
      fromDate: leave.fromDate,
      toDate: leave.toDate,
      status: leave.status,
      reason: leave.reason,
      createdAt: leave.createdAt,
      employee: {
        id: leave.employee?.id ?? null,
        fullName: leave.employee?.fullName ?? "Unknown",
        employeeCode: leave.employee?.employeeCode ?? "-",
        department: leave.employee?.department ?? "-",
        designation: leave.employee?.designation ?? "-",
      },
    }));

    res.json(response);
  } catch (err) {
    console.error("All leaves error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

export const approveLeaveController = async (req, res) => {
  try {
    const user = req.user;
    const leaveId = req.params.id;
    const leave = await updateLeaveStatusService(user, leaveId, "APPROVED");
    res.json({ message: "Leave approved", leave });
  } catch (err) {
    console.error("Approve leave error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

export const rejectLeaveController = async (req, res) => {
  try {
    const user = req.user;
    const leaveId = req.params.id;
    const leave = await updateLeaveStatusService(user, leaveId, "REJECTED");
    res.json({ message: "Leave rejected", leave });
  } catch (err) {
    console.error("Reject leave error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

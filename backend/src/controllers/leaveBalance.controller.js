import { getMyLeaveBalanceService } from "../services/leaveBalance.service.js";

export const myLeaveBalanceController = async (req, res) => {
  try {
    const balances = await getMyLeaveBalanceService(req.user.employeeId);

    const response = balances.map((b) => ({
      leaveType: b.LeaveType.name,
      code: b.LeaveType.code,
      total: b.total,
      used: b.used,
      remaining: b.remaining,
    }));

    res.json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getLeaveBalanceByEmployeeIdController = async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (!employeeId) return res.status(400).json({ message: "Employee ID required" });

    const balances = await getMyLeaveBalanceService(employeeId);

    const response = balances.map((b) => ({
      leaveType: b.LeaveType.name,
      code: b.LeaveType.code,
      total: b.total,
      used: b.used,
      remaining: b.remaining,
    }));

    res.json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

import {
  initLeaveBalanceForAllEmployeesService,
} from "../services/leaveBalance.service.js";

export const initLeaveBalanceForAllEmployeesController = async (req, res) => {
  try {
    const result = await initLeaveBalanceForAllEmployeesService();

    res.json({
      message: "Leave balances initialized for all employees",
      result,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

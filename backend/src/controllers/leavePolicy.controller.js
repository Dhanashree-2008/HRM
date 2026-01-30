// src/controllers/leavePolicy.controller.js
import {
  getLeavePolicyService,
  updateLeaveTypePolicyService,
  createLeaveTypeService,
  getHolidaysForPolicyService,
} from "../services/leavePolicy.service.js";

export const getLeavePolicyController = async (req, res) => {
  try {
    const leaveTypes = await getLeavePolicyService();
    res.json(leaveTypes);
  } catch (err) {
    console.error("Get leave policy error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateLeaveTypePolicyController = async (req, res) => {
  try {
    const { id } = req.params;
    const leaveType = await updateLeaveTypePolicyService(id, req.body);
    res.json({
      message: "Leave type policy updated successfully",
      leaveType,
    });
  } catch (err) {
    console.error("Update leave policy error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

export const createLeaveTypeController = async (req, res) => {
  try {
    const leaveType = await createLeaveTypeService(req.body);
    res.status(201).json({
      message: "Leave type created successfully",
      leaveType,
    });
  } catch (err) {
    console.error("Create leave type error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

export const getHolidaysForPolicyController = async (req, res) => {
  try {
    const { year } = req.query;
    const holidays = await getHolidaysForPolicyService(year);
    res.json(holidays);
  } catch (err) {
    console.error("Get holidays for policy error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};




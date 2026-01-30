import {
  createLeaveTypeService,
  getLeaveTypesService,
} from "../services/leaveType.service.js";

export const createLeaveTypeController = async (req, res) => {
  try {
    const leaveType = await createLeaveTypeService(req.body);
    res.status(201).json({ message: "Leave type created", leaveType });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getLeaveTypesController = async (req, res) => {
  try {
    const types = await getLeaveTypesService();
    res.json(types);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

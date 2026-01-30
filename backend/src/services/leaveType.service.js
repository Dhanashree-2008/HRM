import { LeaveType } from "../models/index.js";

export const createLeaveTypeService = async (data) => {
  const { name, code, yearlyLimit } = data;

  if (!name || !code || !yearlyLimit) {
    throw new Error("All fields are required");
  }

  return LeaveType.create({ name, code, yearlyLimit });
};

export const getLeaveTypesService = async () => {
  return LeaveType.findAll({ where: { isActive: true } });
};

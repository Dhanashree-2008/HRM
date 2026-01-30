// src/services/leavePolicy.service.js
import { LeaveType, Holiday } from "../models/index.js";
import { Op } from "sequelize";

// Get all leave types with policy configuration
export const getLeavePolicyService = async () => {
  const leaveTypes = await LeaveType.findAll({
    where: { isActive: true },
    order: [["name", "ASC"]],
  });

  return leaveTypes;
};

// Update leave type policy
export const updateLeaveTypePolicyService = async (leaveTypeId, policyData) => {
  const leaveType = await LeaveType.findByPk(leaveTypeId);
  if (!leaveType) throw new Error("Leave type not found");

  await leaveType.update({
    name: policyData.name,
    code: policyData.code,
    yearlyLimit: policyData.yearlyLimit,
    allowCarryForward: policyData.allowCarryForward,
    maxCarryForward: policyData.maxCarryForward,
    autoApproveDays: policyData.autoApproveDays,
    requireDocumentation: policyData.requireDocumentation,
    minNoticeDays: policyData.minNoticeDays,
    maxConsecutiveDays: policyData.maxConsecutiveDays,
    accrualRate: policyData.accrualRate,
    maxAccumulation: policyData.maxAccumulation,
    isActive: policyData.isActive !== undefined ? policyData.isActive : leaveType.isActive,
  });

  return leaveType;
};

// Create leave type
export const createLeaveTypeService = async (data) => {
  // Check duplicate code
  const existing = await LeaveType.findOne({ where: { code: data.code } });
  if (existing) throw new Error("Leave type code already exists");

  return await LeaveType.create({
    name: data.name,
    code: data.code,
    yearlyLimit: data.yearlyLimit,
    allowCarryForward: data.allowCarryForward || false,
    maxCarryForward: data.maxCarryForward,
    autoApproveDays: data.autoApproveDays,
    requireDocumentation: data.requireDocumentation || false,
    minNoticeDays: data.minNoticeDays,
    maxConsecutiveDays: data.maxConsecutiveDays,
    accrualRate: data.accrualRate,
    maxAccumulation: data.maxAccumulation,
    isActive: true,
  });
};

// Get holidays for leave policy (exclusions)
export const getHolidaysForPolicyService = async (year) => {
  const currentYear = year || new Date().getFullYear();
  
  return await Holiday.findAll({
    where: {
      isActive: true,
      [Op.or]: [
        { year: currentYear },
        { isRecurring: true },
      ],
    },
    order: [["date", "ASC"]],
  });
};




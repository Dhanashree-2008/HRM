import { EmployeeLeaveBalance, LeaveType } from "../models/index.js";
import { Employee } from "../models/index.js";

export const getMyLeaveBalanceService = async (employeeId) => {
  return EmployeeLeaveBalance.findAll({
    where: { employeeId },
    include: [
      {
        model: LeaveType,
        attributes: ["name", "code", "yearlyLimit"],
      },
    ],
  });
};


export const initLeaveBalanceForAllEmployeesService = async () => {
  const CURRENT_YEAR = new Date().getFullYear();

  const employees = await Employee.findAll();
  const leaveTypes = await LeaveType.findAll({
    where: { isActive: true },
  });

  let totalCreated = 0;

  for (const employee of employees) {
    for (const type of leaveTypes) {
      const existing = await EmployeeLeaveBalance.findOne({
        where: {
          employeeId: employee.id,
          leaveTypeId: type.id,
          year: CURRENT_YEAR,
        },
      });

      if (!existing) {
        await EmployeeLeaveBalance.create({
          employeeId: employee.id,
          leaveTypeId: type.id,
          year: CURRENT_YEAR,
          total: type.yearlyLimit,
          used: 0,
          remaining: type.yearlyLimit,
        });
        totalCreated++;
      }
    }
  }

  return {
    employeesProcessed: employees.length,
    leaveTypesProcessed: leaveTypes.length,
    balancesCreated: totalCreated,
  };
};

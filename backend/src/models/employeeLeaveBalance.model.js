import { DataTypes } from "sequelize";

export const defineEmployeeLeaveBalanceModel = (sequelize) => {
  const EmployeeLeaveBalance = sequelize.define(
    "EmployeeLeaveBalance",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      leaveTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      used: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      remaining: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "employee_leave_balances",
      timestamps: true,
    }
  );

  return EmployeeLeaveBalance;
};

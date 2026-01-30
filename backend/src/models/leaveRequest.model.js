// src/models/leaveRequest.model.js
import { DataTypes } from "sequelize";

export const defineLeaveRequestModel = (sequelize) => {
  const LeaveRequest = sequelize.define(
    "LeaveRequest",
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
      leaveType: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      fromDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      toDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
        defaultValue: "PENDING",
      },
      approverId: {
        // can store manager/admin userId or employeeId
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      hasCollision: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      collisionCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "leave_requests",
      timestamps: true,
    }
  );

  return LeaveRequest;
};

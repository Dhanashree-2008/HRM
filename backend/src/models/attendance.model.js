// src/models/attendance.model.js
import { DataTypes } from "sequelize";

export const defineAttendanceModel = (sequelize) => {
  const Attendance = sequelize.define(
    "Attendance",
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
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      markIn: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      markOut: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "PRESENT",
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "attendance",
      timestamps: true,
    }
  );

  return Attendance;
};

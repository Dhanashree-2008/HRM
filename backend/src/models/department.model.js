// src/models/department.model.js
import { DataTypes } from "sequelize";

export const defineDepartmentModel = (sequelize) => {
  const Department = sequelize.define(
    "Department",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      code: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      headEmployeeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "employees",
          key: "id",
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "departments",
      timestamps: true,
    }
  );

  return Department;
};




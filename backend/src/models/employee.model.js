// src/models/employee.model.js
import { DataTypes } from "sequelize";

export const defineEmployeeModel = (sequelize) => {
  const Employee = sequelize.define(
    "Employee",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Initially nullable to avoid breaking existing records
        references: {
          model: "roles",
          key: "id",
        },
      },
      employeeCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      fullName: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      designation: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      department: {
        type: DataTypes.STRING(100), // later you can switch to department table
        allowNull: true,
      },
      dateOfJoining: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      // Personal Information
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      personalEmail: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM("Male", "Female", "Other", "Prefer not to say"),
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      // Employment Details
      employmentType: {
        type: DataTypes.ENUM("Full-time", "Part-time", "Contract", "Intern", "Freelance"),
        allowNull: true,
        defaultValue: "Full-time",
      },
      shift: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("Active", "Inactive", "On Leave", "Terminated"),
        allowNull: true,
        defaultValue: "Active",
      },
      managerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "employees",
          key: "id",
        },
      },
      qualifications: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      experience: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      skills: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      profileImage: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      resumeUrl: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      basicSalary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
    },
    {
      tableName: "employees",
      timestamps: true,
    }
  );

  return Employee;
};

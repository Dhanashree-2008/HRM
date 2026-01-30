// src/models/job.model.js
import { DataTypes } from "sequelize";

export const defineJobModel = (sequelize) => {
  const Job = sequelize.define(
    "Job",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      department: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      jobType: {
        type: DataTypes.ENUM("Full-time", "Part-time", "Contract", "Intern"),
        allowNull: false,
        defaultValue: "Full-time",
      },
      location: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      salaryRangeMin: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      salaryRangeMax: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      experienceMin: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      experienceMax: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      requirements: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      responsibilities: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      skills: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      deadline: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      openings: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      status: {
        type: DataTypes.ENUM("Draft", "Active", "Closed", "Cancelled"),
        defaultValue: "Draft",
      },
      postedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      tableName: "jobs",
      timestamps: true,
    }
  );

  return Job;
};




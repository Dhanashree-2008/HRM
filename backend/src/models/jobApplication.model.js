// src/models/jobApplication.model.js
import { DataTypes } from "sequelize";

export const defineJobApplicationModel = (sequelize) => {
  const JobApplication = sequelize.define(
    "JobApplication",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "jobs",
          key: "id",
        },
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      resumeUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      coverLetter: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      experience: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      currentCompany: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      currentSalary: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      expectedSalary: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      noticePeriod: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("New", "Reviewed", "Shortlisted", "Interview", "Hired", "Rejected"),
        defaultValue: "New",
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 5,
        },
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cvSummary: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      matchScore: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 100,
        },
      },
    },
    {
      tableName: "job_applications",
      timestamps: true,
    }
  );

  return JobApplication;
};




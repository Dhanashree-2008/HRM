import { DataTypes } from "sequelize";

export const defineWorklogModel = (sequelize) => {
  const Worklog = sequelize.define(
    "Worklog",
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
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      hoursWorked: {
        type: DataTypes.DECIMAL(4,1), // example 7.5
        allowNull: true,
      },
    },
    {
      tableName: "worklogs",
      timestamps: true,
    }
  );

  return Worklog;
};

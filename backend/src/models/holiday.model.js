// src/models/holiday.model.js
import { DataTypes } from "sequelize";

export const defineHolidayModel = (sequelize) => {
  const Holiday = sequelize.define(
    "Holiday",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("National", "Regional", "Company", "Optional"),
        allowNull: false,
        defaultValue: "National",
      },
      isRecurring: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: true, // null for recurring holidays
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "holidays",
      timestamps: true,
    }
  );

  return Holiday;
};




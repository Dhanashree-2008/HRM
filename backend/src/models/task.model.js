import { DataTypes } from "sequelize";

export const defineTaskModel = (sequelize) => {
  const Task = sequelize.define(
    "Task",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      assignedToEmployeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      assignedByEmployeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("PENDING", "IN_PROGRESS", "COMPLETED"),
        defaultValue: "PENDING",
      },
      priority: {
        type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH"),
        defaultValue: "MEDIUM",
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      tableName: "tasks",
      timestamps: true,
    }
  );

  return Task;
};

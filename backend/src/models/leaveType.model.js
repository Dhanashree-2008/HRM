import { DataTypes } from "sequelize";

export const defineLeaveTypeModel = (sequelize) => {
  const LeaveType = sequelize.define(
    "LeaveType",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
      },
      yearlyLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // Policy Configuration
      allowCarryForward: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      maxCarryForward: {
        type: DataTypes.INTEGER,
        allowNull: true, // Max days that can be carried forward
      },
      autoApproveDays: {
        type: DataTypes.INTEGER,
        allowNull: true, // Auto-approve if days <= this value (e.g., 1 day)
      },
      requireDocumentation: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      minNoticeDays: {
        type: DataTypes.INTEGER,
        allowNull: true, // Minimum notice period in days
      },
      maxConsecutiveDays: {
        type: DataTypes.INTEGER,
        allowNull: true, // Max consecutive days allowed
      },
      accrualRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true, // Days per month (e.g., 1.67 for 20 days/year)
      },
      maxAccumulation: {
        type: DataTypes.INTEGER,
        allowNull: true, // Maximum accumulation limit
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "leave_types",
      timestamps: true,
    }
  );

  return LeaveType;
};

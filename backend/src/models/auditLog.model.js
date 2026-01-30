// src/models/auditLog.model.js
import { DataTypes } from "sequelize";

export const defineAuditLogModel = (sequelize) => {
  const AuditLog = sequelize.define(
    "AuditLog",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      action: {
        type: DataTypes.STRING(100),
        allowNull: false, // e.g., "CREATE_EMPLOYEE", "UPDATE_LEAVE_POLICY", "APPROVE_LEAVE"
      },
      entityType: {
        type: DataTypes.STRING(50),
        allowNull: false, // e.g., "EMPLOYEE", "LEAVE_REQUEST", "DEPARTMENT"
      },
      entityId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      changes: {
        type: DataTypes.JSON,
        allowNull: true, // Store before/after values
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      userAgent: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
    },
    {
      tableName: "audit_logs",
      timestamps: true,
    }
  );

  return AuditLog;
};




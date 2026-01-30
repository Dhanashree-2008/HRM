// src/services/auditLog.service.js
import { Op } from "sequelize";
import { AuditLog, User, Employee } from "../models/index.js";

// Create audit log entry
export const createAuditLog = async (data) => {
  const {
    userId,
    action,
    entityType,
    entityId,
    description,
    changes,
    ipAddress,
    userAgent,
  } = data;

  return await AuditLog.create({
    userId,
    action,
    entityType,
    entityId,
    description,
    changes,
    ipAddress,
    userAgent,
  });
};

// Get audit logs with filters
export const getAuditLogsService = async (filters = {}) => {
  const {
    userId,
    entityType,
    action,
    startDate,
    endDate,
    limit = 100,
    offset = 0,
  } = filters;

  const where = {};
  if (userId) where.userId = userId;
  if (entityType) where.entityType = entityType;
  if (action) where.action = action;
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt[Op.gte] = startDate;
    if (endDate) where.createdAt[Op.lte] = endDate;
  }

  const logs = await AuditLog.findAll({
    where,
    include: [
      {
        model: User,
        attributes: ["id", "email", "role"],
        include: [
          {
            model: Employee,
            as: "employeeProfile",
            attributes: ["id", "fullName", "employeeCode"],
            required: false,
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  const total = await AuditLog.count({ where });

  return { logs, total };
};

// Get audit log by ID
export const getAuditLogByIdService = async (logId) => {
  return await AuditLog.findByPk(logId, {
    include: [
      {
        model: User,
        attributes: ["id", "email", "role"],
        include: [
          {
            model: Employee,
            as: "employeeProfile",
            attributes: ["id", "fullName", "employeeCode"],
            required: false,
          },
        ],
      },
    ],
  });
};


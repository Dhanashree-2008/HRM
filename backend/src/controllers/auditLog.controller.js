// src/controllers/auditLog.controller.js
import {
  getAuditLogsService,
  getAuditLogByIdService,
} from "../services/auditLog.service.js";

export const getAuditLogsController = async (req, res) => {
  try {
    const { userId, entityType, action, startDate, endDate, limit, offset } = req.query;
    const result = await getAuditLogsService({
      userId: userId ? parseInt(userId) : undefined,
      entityType,
      action,
      startDate,
      endDate,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });
    res.json(result);
  } catch (err) {
    console.error("Get audit logs error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAuditLogByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await getAuditLogByIdService(id);
    res.json(log);
  } catch (err) {
    console.error("Get audit log error:", err.message);
    res.status(404).json({ message: err.message });
  }
};




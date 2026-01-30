// src/routes/auditLog.routes.js
import { Router } from "express";
import {
  getAuditLogsController,
  getAuditLogByIdController,
} from "../controllers/auditLog.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";

const router = Router();

// Admin only
router.use(authMiddleware);
router.use(checkRole(["ADMIN"]));

router.get("/", getAuditLogsController);
router.get("/:id", getAuditLogByIdController);

export default router;




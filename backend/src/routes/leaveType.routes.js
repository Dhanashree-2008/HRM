import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import {
  createLeaveTypeController,
  getLeaveTypesController,
} from "../controllers/leaveType.controller.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  checkRole(["ADMIN"]),
  createLeaveTypeController
);

router.get(
  "/",
  authMiddleware,
  checkRole(["ADMIN", "EMPLOYEE", "MANAGER"]),
  getLeaveTypesController
);

export default router;

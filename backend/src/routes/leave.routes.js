// src/routes/leave.routes.js
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import {
  applyLeaveController,
  myLeavesController,
  pendingLeavesController,
  getAllLeavesController,
  approveLeaveController,
  rejectLeaveController,
} from "../controllers/leave.controller.js";

const router = Router();

// EMPLOYEE: apply leave
router.post(
  "/apply",
  authMiddleware,
  checkRole(["EMPLOYEE", "MANAGER"]),
  applyLeaveController
);

// EMPLOYEE: my leave history
router.get(
  "/my",
  authMiddleware,
  checkRole(["EMPLOYEE"]),
  myLeavesController
);

// MANAGER + ADMIN: pending leave list
router.get(
  "/pending",
  authMiddleware,
  checkRole(["MANAGER", "ADMIN"]),
  pendingLeavesController
);

// MANAGER + ADMIN: all leave list
router.get(
  "/all",
  authMiddleware,
  checkRole(["MANAGER", "ADMIN"]),
  getAllLeavesController
);

// MANAGER + ADMIN: approve
router.post(
  "/:id/approve",
  authMiddleware,
  checkRole(["MANAGER", "ADMIN"]),
  approveLeaveController
);

// MANAGER + ADMIN: reject
router.post(
  "/:id/reject",
  authMiddleware,
  checkRole(["MANAGER", "ADMIN"]),
  rejectLeaveController
);

export default router;

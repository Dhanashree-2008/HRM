// src/routes/manager.routes.js
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import {
  getTeamAttendanceController,
  markAttendanceController,
  getTeamAttendanceAnalyticsController,
  getTeamMonthlyAttendanceController
} from "../controllers/manager.controller.js";

const router = Router();

// MANAGER + ADMIN access
router.get(
  "/attendance",
  authMiddleware,
  checkRole(["MANAGER", "ADMIN"]),
  getTeamAttendanceController
);

router.get(
  "/attendance/monthly",
  authMiddleware,
  checkRole(["MANAGER", "ADMIN"]),
  getTeamMonthlyAttendanceController
);

// Today's attendance (convenience route)
router.get(
  "/attendance/today",
  authMiddleware,
  checkRole(["MANAGER", "ADMIN"]),
  async (req, res) => {
    // Call the same controller but force today's date
    req.query.date = new Date().toISOString().slice(0, 10);
    return getTeamAttendanceController(req, res);
  }
);

router.post(
  "/attendance/mark",
  authMiddleware,
  checkRole(["MANAGER", "ADMIN"]),
  markAttendanceController
);

router.get(
  "/attendance/analytics",
  authMiddleware,
  checkRole(["MANAGER", "ADMIN"]),
  getTeamAttendanceAnalyticsController
);

export default router;

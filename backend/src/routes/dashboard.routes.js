// src/routes/dashboard.routes.js
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import {
  adminDashboardController,
  managerDashboardController,
} from "../controllers/dashboard.controller.js";

const router = Router();

// ADMIN dashboard
router.get(
  "/admin",
  authMiddleware,
  checkRole(["ADMIN"]),
  adminDashboardController
);

// MANAGER dashboard
router.get(
  "/manager",
  authMiddleware,
  checkRole(["MANAGER"]),
  managerDashboardController
);

export default router;

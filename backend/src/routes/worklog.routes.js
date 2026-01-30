import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import {
  addWorklogController,
  myWorklogsController,
  teamWorklogsController,
} from "../controllers/worklog.controller.js";

const router = Router();

// Employee: add worklog
router.post(
  "/add",
  authMiddleware,
  checkRole(["EMPLOYEE"]),
  addWorklogController
);

// Employee: view own logs
router.get(
  "/my",
  authMiddleware,
  checkRole(["EMPLOYEE"]),
  myWorklogsController
);

// Manager + Admin: view team logs
router.get(
  "/team",
  authMiddleware,
  checkRole(["MANAGER", "ADMIN"]),
  teamWorklogsController
);

export default router;

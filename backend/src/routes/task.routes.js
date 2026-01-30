import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import {
  createTaskController,
  myTasksController,
  teamTasksController,
  updateTaskStatusController,
} from "../controllers/task.controller.js";

const router = Router();

// MANAGER + ADMIN + EMPLOYEE: create task
router.post(
  "/",
  authMiddleware,
  checkRole(["MANAGER", "ADMIN", "EMPLOYEE"]),
  createTaskController
);


// EMPLOYEE: my tasks
router.get(
  "/my",
  authMiddleware,
  checkRole(["EMPLOYEE"]),
  myTasksController
);

// MANAGER + ADMIN: team tasks
router.get(
  "/team",
  authMiddleware,
  checkRole(["MANAGER", "ADMIN"]),
  teamTasksController
);

// EMPLOYEE (or Manager/Admin): update status
router.patch(
  "/:id/status",
  authMiddleware,
  checkRole(["EMPLOYEE", "MANAGER", "ADMIN"]),
  updateTaskStatusController
);

export default router;

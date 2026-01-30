// src/routes/department.routes.js
import { Router } from "express";
import {
  createDepartmentController,
  getDepartmentsController,
  getDepartmentByIdController,
  updateDepartmentController,
  deleteDepartmentController,
} from "../controllers/department.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";

const router = Router();

// All routes require admin
router.use(authMiddleware);

// Routes
// Allow Manager and Admin to view departments
router.get("/", checkRole(["ADMIN", "MANAGER"]), getDepartmentsController);
router.get("/:id", checkRole(["ADMIN", "MANAGER"]), getDepartmentByIdController);

// Restricted to Admin and Manager
router.post("/", checkRole(["ADMIN", "MANAGER"]), createDepartmentController);
router.put("/:id", checkRole(["ADMIN"]), updateDepartmentController);
router.delete("/:id", checkRole(["ADMIN"]), deleteDepartmentController);

export default router;




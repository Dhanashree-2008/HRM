import { Router } from "express";
import {
  createEmployeeController,
  listEmployeesController,
  getEmployeeByIdController,
  updateEmployeeController,
  deactivateEmployeeController,
  activateEmployeeController,
  uploadProfileController,
  uploadResumeController
} from "../controllers/admin.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 12 * 1024 * 1024 } }); // 12MB max

const router = Router();

// ADMIN → Create Employee
router.post(
  "/employees",
  authMiddleware,
  checkRole(["ADMIN"]),
  createEmployeeController
);

// ADMIN → List Employees
router.get(
  "/employees",
  authMiddleware,
  checkRole(["ADMIN", "MANAGER"]),
  listEmployeesController
);

// ADMIN → Get Employee by ID
router.get(
  "/employees/:id",
  authMiddleware,
  checkRole(["ADMIN", "MANAGER"]),
  getEmployeeByIdController
);

// ADMIN → Update Employee
router.put(
  "/employees/:id",
  authMiddleware,
  checkRole(["ADMIN"]),
  updateEmployeeController
);

// ADMIN → Deactivate Employee
router.post(
  "/employees/:id/deactivate",
  authMiddleware,
  checkRole(["ADMIN"]),
  deactivateEmployeeController
);

// ADMIN → Activate Employee
router.post(
  "/employees/:id/activate",
  authMiddleware,
  checkRole(["ADMIN"]),
  activateEmployeeController
);

// ADMIN / MANAGER → Upload profile image
router.post(
  "/employees/:id/upload-profile",
  authMiddleware,
  checkRole(["ADMIN", "MANAGER"]),
  upload.single("profile"),
  uploadProfileController
);

// ADMIN / MANAGER → Upload resume
router.post(
  "/employees/:id/upload-resume",
  authMiddleware,
  checkRole(["ADMIN", "MANAGER"]),
  upload.single("resume"),
  uploadResumeController
);

export default router;

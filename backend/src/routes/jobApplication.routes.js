// src/routes/jobApplication.routes.js
import { Router } from "express";
import {
  createJobApplicationController,
  getJobApplicationsController,
  getJobApplicationByIdController,
  updateApplicationStatusController,
} from "../controllers/jobApplication.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import { uploadResume } from "../middlewares/upload.middleware.js";

const router = Router();

// Public route - job seeker applies
router.post("/", uploadResume.single("resume"), createJobApplicationController);

// Admin routes
router.use(authMiddleware);
router.use(checkRole(["ADMIN", "MANAGER"]));

router.get("/", getJobApplicationsController);
router.get("/:id", getJobApplicationByIdController);
router.put("/:id", updateApplicationStatusController);

export default router;




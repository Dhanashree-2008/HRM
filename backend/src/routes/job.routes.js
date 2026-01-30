// src/routes/job.routes.js
import { Router } from "express";
import {
  createJobController,
  getJobsController,
  getJobByIdController,
  updateJobController,
  deleteJobController,
} from "../controllers/job.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";

const router = Router();

// Public routes (for job seekers)
router.get("/public", getJobsController); // isPublic=true
router.get("/public/:id", getJobByIdController); // isPublic=true

// Admin routes
router.use(authMiddleware);
router.use(checkRole(["ADMIN", "MANAGER"]));

router.post("/", createJobController);
router.get("/", getJobsController); // Admin view
router.get("/:id", getJobByIdController);
router.put("/:id", updateJobController);
router.delete("/:id", deleteJobController);

export default router;




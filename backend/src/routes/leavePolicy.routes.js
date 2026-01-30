// src/routes/leavePolicy.routes.js
import { Router } from "express";
import {
  getLeavePolicyController,
  updateLeaveTypePolicyController,
  createLeaveTypeController,
  getHolidaysForPolicyController,
} from "../controllers/leavePolicy.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";

const router = Router();

// Get policy - accessible to all authenticated users
router.get("/", authMiddleware, getLeavePolicyController);
router.get("/holidays", authMiddleware, getHolidaysForPolicyController);

// Create/Update - admin only
router.use(authMiddleware);
router.use(checkRole(["ADMIN"]));

router.post("/leave-types", createLeaveTypeController);
router.put("/leave-types/:id", updateLeaveTypePolicyController);

export default router;




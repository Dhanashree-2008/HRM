// src/routes/holiday.routes.js
import { Router } from "express";
import {
  createHolidayController,
  getHolidaysController,
  updateHolidayController,
  deleteHolidayController,
} from "../controllers/holiday.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";

const router = Router();

// Get holidays - accessible to all authenticated users
router.get("/", authMiddleware, getHolidaysController);

// Create/Update/Delete - admin only
router.use(authMiddleware);
router.use(checkRole(["ADMIN"]));

router.post("/", createHolidayController);
router.put("/:id", updateHolidayController);
router.delete("/:id", deleteHolidayController);

export default router;




import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  markInController,
  markOutController,
  myAttendanceController,
  getAllAttendanceController,
  getAttendanceByEmployeeIdController,
} from "../controllers/attendance.controller.js";

const router = Router();

router.put("/mark-in", authMiddleware, markInController);
router.put("/mark-out", authMiddleware, markOutController);
router.get("/getAttendance", authMiddleware, myAttendanceController);
router.get("/all", authMiddleware, getAllAttendanceController); 
router.get("/:employeeId", authMiddleware, getAttendanceByEmployeeIdController);

export default router;

import { Router } from "express";
import { employeeDashboardController } from "../controllers/employee.dashboard.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/employee", authMiddleware, employeeDashboardController);

export default router;

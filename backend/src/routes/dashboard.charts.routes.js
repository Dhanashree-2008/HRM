import { Router } from "express";
import {
  adminChartsController,
  managerChartsController,
} from "../controllers/dashboard.charts.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


const router = Router();

router.get("/admin", authMiddleware, adminChartsController);
router.get("/manager", authMiddleware, managerChartsController);

export default router;

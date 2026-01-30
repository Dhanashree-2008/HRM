import { Router } from "express";
import { authMiddleware, authorize } from "../middlewares/auth.middleware.js";
import {
    generatePayslip,
    getAllPayslips,
    publishPayslip,
    getPayslipById
} from "../controllers/payslip.controller.js";

const router = Router();

// Endpoint for employees to get their own payslips (handled by getAllPayslips with role logic)
router.get("/my", authMiddleware, getAllPayslips);

// Admin endpoints
router.post("/generate", authMiddleware, authorize("ADMIN"), generatePayslip);
router.put("/:id/publish", authMiddleware, authorize("ADMIN"), publishPayslip);
router.get("/", authMiddleware, authorize("ADMIN"), getAllPayslips);
router.get("/:id", authMiddleware, getPayslipById);

export default router;

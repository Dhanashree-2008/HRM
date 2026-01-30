
import { Router } from "express";
import { resetPasswordController } from "../controllers/auth.controller.js";

const router = Router();

// Route: /api/reset-password/:token
router.post("/:token", resetPasswordController);

export default router;

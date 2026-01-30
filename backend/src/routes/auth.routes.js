import { Router } from "express";
import { loginController, meController, updateMeController, forgotPasswordController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Login
router.post("/login", loginController);

// Forgot Password
router.post("/forgot-password", forgotPasswordController);

// Current logged-in user
router.get("/getUser", authMiddleware, meController);
router.put("/profile", authMiddleware, updateMeController);

export default router;
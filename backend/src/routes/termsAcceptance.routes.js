// src/routes/termsAcceptance.routes.js
import { Router } from "express";
import {
  getTermsDocumentsController,
  getUserAcceptanceStatusController,
  acceptTermsController,
  getUserAcceptanceHistoryController,
} from "../controllers/termsAcceptance.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get("/documents", getTermsDocumentsController);
router.get("/status", getUserAcceptanceStatusController);
router.post("/accept", acceptTermsController);
router.get("/history", getUserAcceptanceHistoryController);

export default router;




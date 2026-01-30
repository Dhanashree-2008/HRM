import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  listNotificationsController,
  markReadController,
  markAllReadController,
  deleteNotificationController,
  clearAllNotificationsController,
} from "../controllers/notification.controller.js";

const router = Router();

router.use(authMiddleware);
router.get("/", listNotificationsController);
router.patch("/:id/read", markReadController);
router.patch("/read-all", markAllReadController);
router.delete("/:id", deleteNotificationController);
router.post("/clear", clearAllNotificationsController);

export default router;

import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { uploadImageMiddleware } from "../middlewares/imageUpload.middleware.js";
import { uploadImageController } from "../controllers/upload.controller.js";

const router = Router();

router.post("/", authenticate, uploadImageMiddleware.single("file"), uploadImageController);

export default router;

import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import {
    getCompanySettingsController,
    updateCompanySettingsController,
} from "../controllers/setting.controller.js";

const router = Router();

router.get("/", authenticate, getCompanySettingsController);
router.put("/", authenticate, authorize(["ADMIN"]), updateCompanySettingsController);

export default router;

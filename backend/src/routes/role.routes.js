import express from "express";
import {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
} from "../controllers/role.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);
router.use(checkRole(["ADMIN", "MANAGER"])); // Ensure admins and managers can manage roles

router.get("/", getAllRoles);
router.get("/:id", getRoleById);
router.post("/", createRole);
router.put("/:id", updateRole);
router.delete("/:id", deleteRole);

export default router;

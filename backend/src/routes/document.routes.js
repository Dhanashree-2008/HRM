import { Router } from "express";
import multer from "multer";
import { uploadDocument, getAllDocuments, deleteDocument, getStats, getMyDocuments, getDocumentsByEmployeeIdController } from "../controllers/document.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Configure multer for memory storage (handled in controller)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Routes
// Note: Apply authMiddleware to protected routes
router.post("/upload", authMiddleware, upload.single("file"), uploadDocument);
router.get("/", authMiddleware, getAllDocuments);
router.delete("/:id", authMiddleware, deleteDocument);
router.get("/stats", authMiddleware, getStats);

// Specific employee documents
router.get("/my", authMiddleware, getMyDocuments);
router.get("/employee/:employeeId", authMiddleware, getDocumentsByEmployeeIdController);

export default router;

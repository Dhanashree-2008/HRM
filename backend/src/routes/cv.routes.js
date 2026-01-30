import express from "express";
import multer from "multer";
import {
  summarizeUrlController,
  summarizeTextController,
  summarizeUploadController,
  getRecentSummariesController,
  getSummaryByIdController,
  deleteSummaryController,
} from "../controllers/cv.controller.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only PDF/DOC/DOCX allowed"));
    }
    cb(null, true);
  },
});

// Routes
router.post("/summarize/upload", upload.single("cv"), summarizeUploadController);
router.post("/summarize/url", summarizeUrlController);
router.post("/summarize/text", summarizeTextController);

router.get("/summaries/recent", getRecentSummariesController);
router.get("/summaries/:id", getSummaryByIdController);
router.delete("/summaries/:id", deleteSummaryController);


export default router;

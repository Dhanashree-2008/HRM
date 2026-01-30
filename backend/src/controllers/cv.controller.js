
// ============================================
// src/controllers/cv.controller.js (UPDATED)
// ============================================

import {
  summarizeFromUrl,
  summarizeFromText,
  summarizeUpload
} from "../services/cv.service.js";

// In-memory storage for summaries (use database in production)
let cvSummaries = [];
let summaryIdCounter = 1;

/**
 * Upload and summarize CV file
 */
export const summarizeUploadController = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded"
      });
    }

    const { jobPosition, applicationId } = req.body;

    const result = await summarizeUpload({
      fileBuffer: file.buffer,
      filename: file.originalname,
      jobPosition: jobPosition || 'General Position',
      applicationId
    });

    // Store summary with ID and timestamp
    if (result.success) {
      const summaryWithMetadata = {
        id: summaryIdCounter++,
        ...result.summary,
        jobPosition: jobPosition || 'General Position',
        applicationId: applicationId || null,
        filename: file.originalname,
        processedAt: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      };

      cvSummaries.unshift(summaryWithMetadata);

      // Keep only last 50 summaries in memory
      if (cvSummaries.length > 50) {
        cvSummaries = cvSummaries.slice(0, 50);
      }

      result.summary = summaryWithMetadata;
    }

    res.json(result);

  } catch (err) {
    console.error("CV summarize (upload) error:", err.message);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * Summarize CV from URL
 */
export const summarizeUrlController = async (req, res) => {
  try {
    const { cvUrl, jobPosition, applicationId } = req.body;

    if (!cvUrl) {
      return res.status(400).json({
        success: false,
        error: "cvUrl is required"
      });
    }

    const result = await summarizeFromUrl({
      cvUrl,
      jobPosition: jobPosition || 'General Position',
      applicationId
    });

    if (result.success) {
      const summaryWithMetadata = {
        id: summaryIdCounter++,
        ...result.summary,
        jobPosition: jobPosition || 'General Position',
        applicationId: applicationId || null,
        processedAt: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      };

      cvSummaries.unshift(summaryWithMetadata);

      if (cvSummaries.length > 50) {
        cvSummaries = cvSummaries.slice(0, 50);
      }

      result.summary = summaryWithMetadata;
    }

    res.json(result);

  } catch (err) {
    console.error("CV summarize (url) error:", err.message);
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * Summarize CV from plain text
 */
export const summarizeTextController = async (req, res) => {
  try {
    const { text, jobPosition, applicationId } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: "text is required"
      });
    }

    const result = await summarizeFromText({
      text,
      jobPosition: jobPosition || 'General Position',
      applicationId
    });

    if (result.success) {
      const summaryWithMetadata = {
        id: summaryIdCounter++,
        ...result.summary,
        jobPosition: jobPosition || 'General Position',
        applicationId: applicationId || null,
        processedAt: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      };

      cvSummaries.unshift(summaryWithMetadata);

      if (cvSummaries.length > 50) {
        cvSummaries = cvSummaries.slice(0, 50);
      }

      result.summary = summaryWithMetadata;
    }

    res.json(result);

  } catch (err) {
    console.error("CV summarize (text) error:", err.message);
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * Test Gemini API connection
 */


/**
 * Get recent CV summaries
 */
export const getRecentSummariesController = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const recentSummaries = cvSummaries.slice(0, limit);

    res.json({
      success: true,
      summaries: recentSummaries,
      total: cvSummaries.length
    });
  } catch (err) {
    console.error("Get recent summaries error:", err.message);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * Get specific CV summary by ID
 */
export const getSummaryByIdController = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const summary = cvSummaries.find(s => s.id === id);

    if (!summary) {
      return res.status(404).json({
        success: false,
        error: "Summary not found"
      });
    }

    res.json({
      success: true,
      summary
    });
  } catch (err) {
    console.error("Get summary by ID error:", err.message);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * Delete a CV summary
 */
export const deleteSummaryController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const index = cvSummaries.findIndex(s => s.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: "Summary not found"
      });
    }

    cvSummaries.splice(index, 1);

    res.json({
      success: true,
      message: "Summary deleted successfully"
    });
  } catch (err) {
    console.error("Delete summary error:", err.message);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};


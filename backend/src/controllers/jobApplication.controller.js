// src/controllers/jobApplication.controller.js
import {
  createJobApplicationService,
  getJobApplicationsService,
  getJobApplicationByIdService,
  updateApplicationStatusService,
} from "../services/jobApplication.service.js";

// Public endpoint - job seeker applies
export const createJobApplicationController = async (req, res) => {
  try {
    const applicationData = { ...req.body };

    // Add resume file path if uploaded
    if (req.file) {
      // Store relative path for frontend access
      applicationData.resumeUrl = `/uploads/resumes/${req.file.filename}`;
    }

    const application = await createJobApplicationService(applicationData);
    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (err) {
    console.error("Create application error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// Admin/Manager - get applications
export const getJobApplicationsController = async (req, res) => {
  try {
    const { jobId, status, limit, offset } = req.query;
    const result = await getJobApplicationsService({
      jobId,
      status,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });
    res.json(result);
  } catch (err) {
    console.error("Get applications error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getJobApplicationByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await getJobApplicationByIdService(id);
    res.json(application);
  } catch (err) {
    console.error("Get application error:", err.message);
    res.status(404).json({ message: err.message });
  }
};

export const updateApplicationStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await updateApplicationStatusService(id, req.body);
    res.json({
      message: "Application updated successfully",
      application,
    });
  } catch (err) {
    console.error("Update application error:", err.message);
    res.status(400).json({ message: err.message });
  }
};




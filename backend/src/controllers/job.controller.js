// src/controllers/job.controller.js
import {
  createJobService,
  getJobsService,
  getJobByIdService,
  updateJobService,
  deleteJobService,
} from "../services/job.service.js";

export const createJobController = async (req, res) => {
  try {
    const job = await createJobService(req.user.id, req.body);
    res.status(201).json({
      message: "Job posting created successfully",
      job,
    });
  } catch (err) {
    console.error("Create job error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

export const getJobsController = async (req, res) => {
  try {
    const { status, department, isPublic } = req.query;
    const jobs = await getJobsService({ status, department, isPublic: isPublic === "true" });
    res.json(jobs);
  } catch (err) {
    console.error("Get jobs error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getJobByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const isPublic = req.query.isPublic === "true";
    const job = await getJobByIdService(id, isPublic);
    res.json(job);
  } catch (err) {
    console.error("Get job error:", err.message);
    res.status(404).json({ message: err.message });
  }
};

export const updateJobController = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await updateJobService(id, req.body);
    res.json({
      message: "Job updated successfully",
      job,
    });
  } catch (err) {
    console.error("Update job error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

export const deleteJobController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteJobService(id);
    res.json(result);
  } catch (err) {
    console.error("Delete job error:", err.message);
    res.status(400).json({ message: err.message });
  }
};




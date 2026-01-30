// src/services/job.service.js
import { Op } from "sequelize";
import { Job, JobApplication, User } from "../models/index.js";

// Create job posting
export const createJobService = async (userId, data) => {
  return await Job.create({
    ...data,
    postedBy: userId,
  });
};

// Get all jobs (with filters)
export const getJobsService = async (filters = {}) => {
  const { status, department, isPublic = false } = filters;
  
  const where = {};
  if (status) where.status = status;
  if (department) where.department = department;
  
  // For public (job seeker) view, only show active jobs
  if (isPublic) {
    where.status = "Active";
    where.deadline = { [Op.gte]: new Date().toISOString().slice(0, 10) };
  }

  return await Job.findAll({
    where,
    include: [
      {
        model: User,
        as: "poster",
        attributes: ["id", "email"],
        required: false,
      },
      {
        model: JobApplication,
        as: "applications",
        required: false,
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

// Get job by ID
export const getJobByIdService = async (jobId, isPublic = false) => {
  const where = { id: jobId };
  if (isPublic) {
    where.status = "Active";
  }

  const job = await Job.findOne({
    where,
    include: [
      {
        model: User,
        as: "poster",
        attributes: ["id", "email"],
        required: false,
      },
    ],
  });

  if (!job) throw new Error("Job not found");
  return job;
};

// Update job
export const updateJobService = async (jobId, data) => {
  const job = await Job.findByPk(jobId);
  if (!job) throw new Error("Job not found");

  await job.update(data);
  return job;
};

// Delete job
export const deleteJobService = async (jobId) => {
  const job = await Job.findByPk(jobId);
  if (!job) throw new Error("Job not found");

  await job.destroy();
  return { message: "Job deleted successfully" };
};




// src/services/jobApplication.service.js
import { Op } from "sequelize";
import { JobApplication, Job } from "../models/index.js";

// Create job application (public - job seeker)
export const createJobApplicationService = async (data) => {
  const { jobId, ...applicationData } = data;

  // Verify job exists and is active
  const job = await Job.findByPk(jobId);
  if (!job) throw new Error("Job not found");
  if (job.status !== "Active") throw new Error("Job is not accepting applications");
  if (job.deadline && new Date(job.deadline) < new Date()) {
    throw new Error("Application deadline has passed");
  }

  // Check if email already applied for this job
  const existing = await JobApplication.findOne({
    where: { jobId, email: applicationData.email },
  });
  if (existing) throw new Error("You have already applied for this position");

  return await JobApplication.create({
    jobId,
    ...applicationData,
    status: "New",
  });
};

// Get applications for a job (admin/manager)
export const getJobApplicationsService = async (filters = {}) => {
  const { jobId, status, limit = 100, offset = 0 } = filters;

  const where = {};
  if (jobId) where.jobId = jobId;
  if (status) where.status = status;

  const applications = await JobApplication.findAll({
    where,
    include: [
      {
        model: Job,
        as: "job",
        attributes: ["id", "title", "department"],
      },
    ],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  const total = await JobApplication.count({ where });

  return { applications, total };
};

// Get application by ID
export const getJobApplicationByIdService = async (applicationId) => {
  const application = await JobApplication.findByPk(applicationId, {
    include: [
      {
        model: Job,
        as: "job",
        attributes: ["id", "title", "department", "description", "requirements"],
      },
    ],
  });

  if (!application) throw new Error("Application not found");
  return application;
};

// Update application status (admin)
export const updateApplicationStatusService = async (applicationId, data) => {
  const application = await JobApplication.findByPk(applicationId);
  if (!application) throw new Error("Application not found");

  await application.update({
    status: data.status,
    rating: data.rating,
    notes: data.notes,
    cvSummary: data.cvSummary,
    matchScore: data.matchScore,
  });

  return application;
};




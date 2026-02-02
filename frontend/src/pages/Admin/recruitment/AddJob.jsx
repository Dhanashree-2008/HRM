import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiArrowLeft, FiSave, FiBriefcase, FiUsers, FiDollarSign, FiMapPin, FiCalendar } from "react-icons/fi";
import { Link } from "react-router-dom";

import { toast } from "react-hot-toast";
import jobService from "../../../services/jobService";
import { useNavigate, useParams } from "react-router-dom";

const AddJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    jobType: "Full-time",
    location: "",
    salaryRangeMin: "",
    salaryRangeMax: "",
    experienceMin: "",
    experienceMax: "",
    description: "",
    requirements: "",
    responsibilities: "",
    skills: "",
    deadline: "",
    openings: "1",
    status: "Draft"
  });

  useEffect(() => {
    if (id) {
      const fetchJob = async () => {
        try {
          const data = await jobService.getJobById(id);
          // Format date to YYYY-MM-DD for input[type=date]
          const formattedData = {
            ...data,
            title: data.title || "",
            department: data.department || "",
            jobType: data.jobType || data.type || "Full-time",
            location: data.location || "",
            salaryRangeMin: data.salaryRangeMin || "",
            salaryRangeMax: data.salaryRangeMax || "",
            experienceMin: data.experienceMin || "",
            experienceMax: data.experienceMax || "",
            description: data.description || "",
            requirements: data.requirements || "",
            responsibilities: data.responsibilities || "",
            skills: data.skills || "",
            openings: data.openings || "1",
            status: data.status || "Draft",
            deadline: data.deadline ? new Date(data.deadline).toISOString().split('T')[0] : ""
          };
          setFormData(formattedData);
        } catch (error) {
          console.error("Error fetching job details:", error);
          toast.error("Failed to load job details");
        }
      };
      fetchJob();
    }
  }, [id]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleTextAreaChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Job title is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.requirements.trim()) newErrors.requirements = "Requirements are required";
    if (!formData.deadline) newErrors.deadline = "Application deadline is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      try {
        setIsSubmitting(true);
        if (id) {
          await jobService.updateJob(id, formData);
          toast.success("Job posting updated successfully!");
        } else {
          await jobService.createJob(formData);
          toast.success("Job posting created successfully!");
        }
        navigate("/admin/recruitment/jobs");
      } catch (error) {
        console.error("Error creating job:", error);
        toast.error("Failed to create job posting");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  /* Removed hardcoded departments */
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/departments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDepartments(res.data.map(d => d.name)); // Assuming we just want names for the dropdown
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  const jobTypes = ["Full-time", "Part-time", "Contract", "Intern"];
  const experienceOptions = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];

  return (
    <div className="w-full">
      {/*  Header */}
      <div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 p-8">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/admin/recruitment/jobs"
              className="p-2 rounded-lg hover:bg-white/10 text-white"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-300">
                {id ? "Edit Job Posting" : "Create Job Posting"}
              </h1>
              <p className="text-slate-300">
                {id ? "Update the job details and requirements." : "Post a new job opening and attract qualified candidates."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Job Details */}
        <div className="lg:col-span-2 space-y-8">

          {/* ===================== BASIC INFORMATION ===================== */}
          <div className="relative">
            <div className="relative bg-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-6 border-b border-slate-700 pb-3">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Job Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Job Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Backend Developer"
                    className={`w-full h-11 px-4 bg-slate-800 border ${errors.title ? "border-rose-500" : "border-slate-700"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30 text-white`}
                  />
                  {errors.title && <p className="mt-1 text-xs text-rose-400">{errors.title}</p>}
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Department <span className="text-rose-400">*</span>
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={`w-full h-11 px-4 bg-slate-800 border ${errors.department ? "border-rose-500" : "border-slate-700"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30 text-white`}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Job Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Job Type
                  </label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30 text-white"
                  >
                    {jobTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Mumbai / Remote"
                    className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30 text-white"
                  />
                </div>

                {/* Salary */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Salary Range
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      name="salaryRangeMin"
                      value={formData.salaryRangeMin}
                      onChange={handleChange}
                      placeholder="Min"
                      className="flex-1 h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500/30"
                    />
                    <input
                      type="number"
                      name="salaryRangeMax"
                      value={formData.salaryRangeMax}
                      onChange={handleChange}
                      placeholder="Max"
                      className="flex-1 h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500/30"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Leave empty if negotiable</p>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Experience (Years)
                  </label>
                  <div className="flex gap-3">
                    <select
                      name="experienceMin"
                      value={formData.experienceMin}
                      onChange={handleChange}
                      className="flex-1 h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white"
                    >
                      <option value="">Min</option>
                      {experienceOptions.map((exp) => (
                        <option key={exp} value={exp}>{exp}</option>
                      ))}
                    </select>
                    <select
                      name="experienceMax"
                      value={formData.experienceMax}
                      onChange={handleChange}
                      className="flex-1 h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white"
                    >
                      <option value="">Max</option>
                      {experienceOptions.map((exp) => (
                        <option key={exp} value={exp}>{exp}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Application Deadline <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className={`w-full h-11 px-4 bg-slate-800 border ${errors.deadline ? "border-rose-500" : "border-slate-700"
                      } rounded-lg text-white focus:ring-2 focus:ring-cyan-500/30`}
                  />
                </div>

                {/* Openings */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Number of Openings
                  </label>
                  <input
                    type="number"
                    name="openings"
                    value={formData.openings}
                    onChange={handleChange}
                    min="1"
                    className="w-full h-11 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500/30"
                  />
                </div>

              </div>
            </div>
          </div>

          {/* ===================== DESCRIPTION ===================== */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Job Description *</h3>
            <textarea
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleTextAreaChange}
              placeholder="Describe the role, team, and benefits..."
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500/30"
            />
          </div>

          {/* ===================== REQUIREMENTS ===================== */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Requirements *</h3>
            <textarea
              name="requirements"
              rows={5}
              value={formData.requirements}
              onChange={handleTextAreaChange}
              placeholder="Required qualifications, experience, tools..."
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500/30"
            />
          </div>

          {/* ===================== RESPONSIBILITIES & SKILLS ===================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Responsibilities</h3>
              <textarea
                name="responsibilities"
                rows={5}
                value={formData.responsibilities}
                onChange={handleTextAreaChange}
                placeholder="Key duties and responsibilities..."
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Skills</h3>
              <textarea
                name="skills"
                rows={5}
                value={formData.skills}
                onChange={handleTextAreaChange}
                placeholder="e.g. Node.js, SQL, REST APIs, Problem Solving"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>
          </div>
        </div>


        {/* Right Column - Preview & Actions */}
        <div className="space-y-6">
          {/* Preview Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Job Preview</h3>
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-white/10">
                  <p className="text-sm text-slate-400 mb-1">Job Title</p>
                  <p className="font-medium text-white">
                    {formData.title || "New Job Position"}
                  </p>
                </div>
                <div className="p-4 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-white/10">
                  <p className="text-sm text-slate-400 mb-1">Department & Type</p>
                  <div className="flex gap-2">
                    {formData.department && (
                      <span className="px-2 py-1 text-xs bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded">
                        {formData.department}
                      </span>
                    )}
                    {formData.jobType && (
                      <span className="px-2 py-1 text-xs bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded">
                        {formData.jobType}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-white/10">
                  <p className="text-sm text-slate-400 mb-1">Salary Range</p>
                  <p className="font-medium text-white">
                    {formData.salaryRangeMin && formData.salaryRangeMax
                      ? `₹${formData.salaryRangeMin} - ₹${formData.salaryRangeMax}`
                      : "Not specified"
                    }
                  </p>
                </div>
                <div className="p-4 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-white/10">
                  <p className="text-sm text-slate-400 mb-1">Experience</p>
                  <p className="font-medium text-white">
                    {formData.experienceMin || formData.experienceMax
                      ? `${formData.experienceMin || "0"} - ${formData.experienceMax || "Any"} years`
                      : "Not specified"
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status & Actions Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Status & Actions</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Posting Status
                  </label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="Draft"
                        checked={formData.status === "Draft"}
                        onChange={handleChange}
                        className="text-cyan-500 focus:ring-cyan-500/20"
                      />
                      <span className="px-4 py-2 rounded-lg border border-white/20 bg-slate-800/50 text-white font-medium">
                        Save as Draft
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="Active"
                        checked={formData.status === "Active"}
                        onChange={handleChange}
                        className="text-cyan-500 focus:ring-cyan-500/20"
                      />
                      <span className="px-4 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-medium">
                        Publish Now
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg shadow hover:shadow-md font-medium transition-all ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {formData.status === "Draft" ? "Saving..." : "Publishing..."}
                      </>
                    ) : (
                      <>
                        <FiSave className="w-5 h-5" />
                        {formData.status === "Draft" ? "Save as Draft" : "Publish Job"}
                      </>
                    )}
                  </button>

                  <Link
                    to="/admin/recruitment/jobs"
                    className="w-full mt-3 block px-4 py-3 border border-white/20 text-white text-center rounded-lg hover:bg-slate-800/50 font-medium"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-6">
            <h4 className="font-medium text-white mb-3">Tips for Better Job Postings</h4>
            <ul className="text-sm text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <FiBriefcase className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span>Use clear, specific job titles</span>
              </li>
              <li className="flex items-start gap-2">
                <FiBriefcase className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span>Include salary range to attract candidates</span>
              </li>
              <li className="flex items-start gap-2">
                <FiBriefcase className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span>List must-have vs nice-to-have skills</span>
              </li>
              <li className="flex items-start gap-2">
                <FiBriefcase className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span>Highlight company culture and benefits</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddJob;
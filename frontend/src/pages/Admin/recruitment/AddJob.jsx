import React, { useState } from "react";
import { FiArrowLeft, FiSave, FiBriefcase, FiUsers, FiDollarSign, FiMapPin, FiCalendar } from "react-icons/fi";
import { Link } from "react-router-dom";

const AddJob = () => {
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

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleTextAreaChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      setTimeout(() => {
        console.log("Job data to save:", formData);
        setIsSubmitting(false);
        alert("Job posting created successfully!");
      }, 1500);
    } else {
      setErrors(validationErrors);
    }
  };

  const departments = ["IT", "HR", "Finance", "Marketing", "Operations", "Sales"];
  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];
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
                Create Job Posting
              </h1>
              <p className="text-slate-300">
                Post a new job opening and attract qualified candidates.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Job Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Basic Information</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    <span className="flex items-center gap-2">
                      <FiBriefcase className="w-4 h-4 text-cyan-400" />
                      Job Title *
                    </span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-slate-800/50 border ${
                      errors.title ? "border-rose-500" : "border-white/20"
                    } rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-slate-400 transition-all`}
                    placeholder="e.g., Senior Frontend Developer"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-rose-400">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Department *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-slate-800/50 border ${
                      errors.department ? "border-rose-500" : "border-white/20"
                    } rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white transition-all`}
                  >
                    <option value="" className="bg-slate-800">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept} className="bg-slate-800">{dept}</option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="mt-1 text-sm text-rose-400">{errors.department}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Job Type
                  </label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/20 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white transition-all"
                  >
                    {jobTypes.map(type => (
                      <option key={type} value={type} className="bg-slate-800">{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    <span className="flex items-center gap-2">
                      <FiMapPin className="w-4 h-4 text-cyan-400" />
                      Location
                    </span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/20 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-slate-400 transition-all"
                    placeholder="e.g., Mumbai, Remote"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    <span className="flex items-center gap-2">
                      <FiDollarSign className="w-4 h-4 text-cyan-400" />
                      Salary Range
                    </span>
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      name="salaryRangeMin"
                      value={formData.salaryRangeMin}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 bg-slate-800/50 border border-white/20 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-slate-400 transition-all"
                      placeholder="Min"
                    />
                    <span className="self-center text-slate-400">-</span>
                    <input
                      type="number"
                      name="salaryRangeMax"
                      value={formData.salaryRangeMax}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 bg-slate-800/50 border border-white/20 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-slate-400 transition-all"
                      placeholder="Max"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Leave empty for negotiable</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Experience (Years)
                  </label>
                  <div className="flex gap-3">
                    <select
                      name="experienceMin"
                      value={formData.experienceMin}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 bg-slate-800/50 border border-white/20 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white"
                    >
                      <option value="" className="bg-slate-800">Min</option>
                      {experienceOptions.map(exp => (
                        <option key={exp} value={exp} className="bg-slate-800">{exp}</option>
                      ))}
                    </select>
                    <span className="self-center text-slate-400">to</span>
                    <select
                      name="experienceMax"
                      value={formData.experienceMax}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 bg-slate-800/50 border border-white/20 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white"
                    >
                      <option value="" className="bg-slate-800">Max</option>
                      {experienceOptions.map(exp => (
                        <option key={exp} value={exp} className="bg-slate-800">{exp}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    <span className="flex items-center gap-2">
                      <FiCalendar className="w-4 h-4 text-cyan-400" />
                      Application Deadline *
                    </span>
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-slate-800/50 border ${
                      errors.deadline ? "border-rose-500" : "border-white/20"
                    } rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white transition-all`}
                  />
                  {errors.deadline && (
                    <p className="mt-1 text-sm text-rose-400">{errors.deadline}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    <span className="flex items-center gap-2">
                      <FiUsers className="w-4 h-4 text-cyan-400" />
                      Number of Openings
                    </span>
                  </label>
                  <input
                    type="number"
                    name="openings"
                    value={formData.openings}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/20 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-slate-400 transition-all"
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Job Description Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Job Description *</h3>
              <textarea
                value={formData.description}
                onChange={(e) => handleTextAreaChange("description", e.target.value)}
                rows="4"
                className={`w-full px-4 py-3 bg-slate-800/50 border ${
                  errors.description ? "border-rose-500" : "border-white/20"
                } rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-slate-400 transition-all`}
                placeholder="Describe the job role, company culture, and benefits..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-rose-400">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Requirements Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Requirements *</h3>
              <textarea
                value={formData.requirements}
                onChange={(e) => handleTextAreaChange("requirements", e.target.value)}
                rows="4"
                className={`w-full px-4 py-3 bg-slate-800/50 border ${
                  errors.requirements ? "border-rose-500" : "border-white/20"
                } rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-slate-400 transition-all`}
                placeholder="List the required qualifications, experience, and skills..."
              />
              {errors.requirements && (
                <p className="mt-1 text-sm text-rose-400">{errors.requirements}</p>
              )}
            </div>
          </div>

          {/* Responsibilities & Skills */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">Responsibilities</h3>
                <textarea
                  value={formData.responsibilities}
                  onChange={(e) => handleTextAreaChange("responsibilities", e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/20 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-slate-400 transition-all"
                  placeholder="Key responsibilities and daily tasks..."
                />
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">Skills</h3>
                <textarea
                  value={formData.skills}
                  onChange={(e) => handleTextAreaChange("skills", e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/20 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-slate-400 transition-all"
                  placeholder="Technical and soft skills required (comma separated)..."
                />
              </div>
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
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg shadow hover:shadow-md font-medium transition-all ${
                      isSubmitting ? "opacity-75 cursor-not-allowed" : ""
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
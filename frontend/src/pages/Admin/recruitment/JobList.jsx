import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiFilter, FiBriefcase, FiUsers, FiClock, FiEdit2, FiEye, FiTrash2, FiTrendingUp } from "react-icons/fi";

const JobList = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const jobs = [
    { 
      id: 1, 
      title: "Frontend Developer", 
      department: "IT", 
      type: "Full-time",
      location: "Mumbai, Remote",
      applicants: 24,
      status: "Active",
      postedDate: "2024-11-15",
      deadline: "2024-12-15",
    },
    { 
      id: 2, 
      title: "HR Executive", 
      department: "HR", 
      type: "Full-time",
      location: "Delhi",
      applicants: 18,
      status: "Active",
      postedDate: "2024-11-10",
      deadline: "2024-12-10",
    },
    { 
      id: 3, 
      title: "Senior Accountant", 
      department: "Finance", 
      type: "Full-time",
      location: "Bangalore",
      applicants: 12,
      status: "Closed",
      postedDate: "2024-10-28",
      deadline: "2024-11-28",
    },
    { 
      id: 4, 
      title: "Marketing Manager", 
      department: "Marketing", 
      type: "Contract",
      location: "Remote",
      applicants: 8,
      status: "Draft",
      postedDate: "2024-11-05",
      deadline: "2024-12-05",
    },
    { 
      id: 5, 
      title: "DevOps Engineer", 
      department: "IT", 
      type: "Full-time",
      location: "Pune",
      applicants: 15,
      status: "Active",
      postedDate: "2024-11-20",
      deadline: "2024-12-20",
    },
  ];

  const filtered = jobs
    .filter(job => 
      job.title.toLowerCase().includes(search.toLowerCase().trim()) ||
      job.department.toLowerCase().includes(search.toLowerCase().trim())
    )
    .filter(job => 
      statusFilter === "All" ? true : job.status === statusFilter
    )
    .filter(job => 
      departmentFilter === "All" ? true : job.department === departmentFilter
    );

  const getStatusColor = (status) => {
    switch(status) {
      case "Active": return "bg-gradient-to-r from-emerald-500 to-green-500 text-white";
      case "Closed": return "bg-gradient-to-r from-rose-500 to-red-500 text-white";
      case "Draft": return "bg-gradient-to-r from-slate-500 to-slate-600 text-white";
      default: return "bg-gradient-to-r from-slate-500 to-slate-600 text-white";
    }
  };

  const getDepartmentColor = (department) => {
    switch(department) {
      case "IT": return "bg-gradient-to-r from-cyan-500 to-blue-500";
      case "HR": return "bg-gradient-to-r from-pink-500 to-rose-500";
      case "Finance": return "bg-gradient-to-r from-emerald-500 to-green-500";
      case "Marketing": return "bg-gradient-to-r from-purple-500 to-pink-500";
      default: return "bg-gradient-to-r from-slate-500 to-slate-600";
    }
  };

  return (
    <div className="w-full">
      {/*  Header */}
      <div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 p-8">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-300">
                Job Openings
              </h1>
              <p className="text-slate-300">
                Manage and track all job postings and applications.
              </p>
            </div>
            <Link
              to="/admin/recruitment/add-job"
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg shadow hover:shadow-md transition-all duration-300 font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Job Posting
              </div>
            </Link>
          </div>

          {/*  Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Active Jobs</p>
                    <h3 className="text-3xl font-bold text-white mt-2">8</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <FiBriefcase className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Applicants</p>
                    <h3 className="text-3xl font-bold text-white mt-2">124</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                    <FiUsers className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Interviews</p>
                    <h3 className="text-3xl font-bold text-white mt-2">18</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <FiClock className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Hiring Rate</p>
                    <h3 className="text-3xl font-bold text-white mt-2">68%</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <FiTrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="relative group mb-6">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-white/10">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search jobs by title or department..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-white/20 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-slate-400 transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                className="px-4 py-3 bg-slate-800/50 border border-white/20 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All" className="bg-slate-800">All Status</option>
                <option value="Active" className="bg-slate-800">Active</option>
                <option value="Closed" className="bg-slate-800">Closed</option>
                <option value="Draft" className="bg-slate-800">Draft</option>
              </select>
              <select
                className="px-4 py-3 bg-slate-800/50 border border-white/20 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="All" className="bg-slate-800">All Departments</option>
                <option value="IT" className="bg-slate-800">IT</option>
                <option value="HR" className="bg-slate-800">HR</option>
                <option value="Finance" className="bg-slate-800">Finance</option>
                <option value="Marketing" className="bg-slate-800">Marketing</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border border-white/20 rounded-lg hover:bg-slate-700/50 text-white">
                <FiFilter className="w-4 h-4" />
                More Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="p-4 border-b border-white/10 text-left text-sm font-semibold text-white">
                    Job Title
                  </th>
                  <th className="p-4 border-b border-white/10 text-left text-sm font-semibold text-white">
                    Department
                  </th>
                  <th className="p-4 border-b border-white/10 text-left text-sm font-semibold text-white">
                    Applicants
                  </th>
                  <th className="p-4 border-b border-white/10 text-left text-sm font-semibold text-white">
                    Posted Date
                  </th>
                  <th className="p-4 border-b border-white/10 text-left text-sm font-semibold text-white">
                    Deadline
                  </th>
                  <th className="p-4 border-b border-white/10 text-left text-sm font-semibold text-white">
                    Status
                  </th>
                  <th className="p-4 border-b border-white/10 text-left text-sm font-semibold text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-800/30 transition-colors group/row">
                    <td className="p-4 border-b border-white/10">
                      <div>
                        <p className="font-medium text-white">{job.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                            {job.type}
                          </span>
                          <span className="text-xs text-slate-400">{job.location}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 border-b border-white/10">
                      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm text-white ${getDepartmentColor(job.department)}`}>
                        {job.department}
                      </span>
                    </td>
                    <td className="p-4 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <FiUsers className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-white">{job.applicants}</span>
                        <Link 
                          to={`/admin/recruitment/applications?job=${job.id}`}
                          className="text-xs text-cyan-400 hover:text-cyan-300"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                    <td className="p-4 border-b border-white/10">
                      <p className="text-white">{job.postedDate}</p>
                    </td>
                    <td className="p-4 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <FiClock className="w-4 h-4 text-slate-400" />
                        <span className={`font-medium ${
                          new Date(job.deadline) < new Date() && job.status === "Active"
                            ? "text-rose-400"
                            : "text-white"
                        }`}>
                          {job.deadline}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 border-b border-white/10">
                      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                        <span className={`w-2 h-2 rounded-full bg-white`}></span>
                        {job.status}
                      </span>
                    </td>
                    <td className="p-4 border-b border-white/10">
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/recruitment/jobs/${job.id}`}
                          className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors"
                          title="View"
                        >
                          <FiEye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/recruitment/edit-job/${job.id}`}
                          className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </Link>
                        <button className="p-2 rounded-lg hover:bg-slate-700/50 text-rose-400 hover:text-rose-300 transition-colors">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center">
                      <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 border border-white/10 flex items-center justify-center">
                          <FiBriefcase className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">No job openings found</h3>
                        <p className="text-slate-400 mb-4">Try adjusting your search or filter criteria</p>
                        <Link
                          to="/admin/recruitment/add-job"
                          className="text-cyan-400 hover:text-cyan-300 font-medium"
                        >
                          Create your first job posting
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Showing <span className="font-medium text-white">1-{filtered.length}</span> of{" "}
              <span className="font-medium text-white">{jobs.length}</span> jobs
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-2 bg-slate-800/50 border border-white/20 text-slate-300 rounded-lg hover:bg-slate-700/50 disabled:opacity-50">
                Previous
              </button>
              <button className="px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-md">
                1
              </button>
              <button className="px-3 py-2 bg-slate-800/50 border border-white/20 text-slate-300 rounded-lg hover:bg-slate-700/50">
                2
              </button>
              <button className="px-3 py-2 bg-slate-800/50 border border-white/20 text-slate-300 rounded-lg hover:bg-slate-700/50">
                3
              </button>
              <button className="px-3 py-2 bg-slate-800/50 border border-white/20 text-slate-300 rounded-lg hover:bg-slate-700/50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobList;
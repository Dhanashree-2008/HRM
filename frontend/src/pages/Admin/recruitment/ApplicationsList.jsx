import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiFilter, FiUser, FiMail, FiPhone, FiCalendar, FiDownload, FiEye, FiCheck, FiX, FiTrendingUp } from "react-icons/fi";

const ApplicationsList = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [jobFilter, setJobFilter] = useState("All");

  const applications = [
    { 
      id: 1, 
      name: "Amit Verma", 
      email: "amit.verma@example.com",
      phone: "+91 98765 43210",
      appliedFor: "Frontend Developer", 
      appliedDate: "2024-11-20",
      status: "New",
      experience: "3 years",
      currentCompany: "TechCorp",
      matchScore: 85,
    },
    { 
      id: 2, 
      name: "Neha Singh", 
      email: "neha.singh@example.com",
      phone: "+91 98765 43211",
      appliedFor: "HR Executive", 
      appliedDate: "2024-11-18",
      status: "Reviewed",
      experience: "2 years",
      currentCompany: "HR Solutions",
      matchScore: 72,
    },
    { 
      id: 3, 
      name: "Rajesh Kumar", 
      email: "rajesh.kumar@example.com",
      phone: "+91 98765 43212",
      appliedFor: "Senior Accountant", 
      appliedDate: "2024-11-15",
      status: "Interview",
      experience: "5 years",
      currentCompany: "Finance Pro",
      matchScore: 90,
    },
    { 
      id: 4, 
      name: "Sneha Patel", 
      email: "sneha.patel@example.com",
      phone: "+91 98765 43213",
      appliedFor: "DevOps Engineer", 
      appliedDate: "2024-11-12",
      status: "Rejected",
      experience: "4 years",
      currentCompany: "CloudTech",
      matchScore: 65,
    },
    { 
      id: 5, 
      name: "Vikram Sharma", 
      email: "vikram.sharma@example.com",
      phone: "+91 98765 43214",
      appliedFor: "Frontend Developer", 
      appliedDate: "2024-11-10",
      status: "Hired",
      experience: "6 years",
      currentCompany: "WebWorks",
      matchScore: 95,
    },
  ];

  const filtered = applications
    .filter(app => 
      app.name.toLowerCase().includes(search.toLowerCase().trim()) ||
      app.appliedFor.toLowerCase().includes(search.toLowerCase().trim())
    )
    .filter(app => 
      statusFilter === "All" ? true : app.status === statusFilter
    )
    .filter(app => 
      jobFilter === "All" ? true : app.appliedFor === jobFilter
    );

  const getStatusColor = (status) => {
    switch(status) {
      case "New": return "bg-gradient-to-r from-cyan-500 to-blue-500 text-white";
      case "Reviewed": return "bg-gradient-to-r from-amber-500 to-orange-500 text-white";
      case "Interview": return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
      case "Hired": return "bg-gradient-to-r from-emerald-500 to-green-500 text-white";
      case "Rejected": return "bg-gradient-to-r from-rose-500 to-red-500 text-white";
      default: return "bg-gradient-to-r from-slate-500 to-slate-600 text-white";
    }
  };

  const getMatchColor = (score) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-rose-400";
  };

  const handleStatusChange = (id, newStatus) => {
    console.log(`Changing application ${id} status to ${newStatus}`);
  };

  const uniqueJobs = ["All", ...new Set(applications.map(app => app.appliedFor))];

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
                Job Applications
              </h1>
              <p className="text-slate-300">
                Review and manage all job applications.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 border border-white/20 text-white rounded-lg hover:bg-slate-700/50 font-medium">
                  <FiDownload className="w-4 h-4" />
                  Export
                </div>
              </button>
            </div>
          </div>

          {/*  Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total</p>
                    <h3 className="text-3xl font-bold text-white mt-2">{applications.length}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <FiUser className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">New</p>
                    <h3 className="text-3xl font-bold text-white mt-2">1</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">!</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Interview</p>
                    <h3 className="text-3xl font-bold text-white mt-2">1</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <FiCalendar className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Hired</p>
                    <h3 className="text-3xl font-bold text-white mt-2">1</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                    <FiCheck className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Avg. Match</p>
                    <h3 className="text-3xl font-bold text-white mt-2">81%</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
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
                  placeholder="Search applications by name or job title..."
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
                <option value="New" className="bg-slate-800">New</option>
                <option value="Reviewed" className="bg-slate-800">Reviewed</option>
                <option value="Interview" className="bg-slate-800">Interview</option>
                <option value="Hired" className="bg-slate-800">Hired</option>
                <option value="Rejected" className="bg-slate-800">Rejected</option>
              </select>
              <select
                className="px-4 py-3 bg-slate-800/50 border border-white/20 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white"
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
              >
                {uniqueJobs.map(job => (
                  <option key={job} value={job} className="bg-slate-800">{job}</option>
                ))}
              </select>
              <button className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border border-white/20 rounded-lg hover:bg-slate-700/50 text-white">
                <FiFilter className="w-4 h-4" />
                More Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="p-4 border-b border-white/10 text-left text-sm font-semibold text-white">
                    Candidate
                  </th>
                  <th className="p-4 border-b border-white/10 text-left text-sm font-semibold text-white">
                    Applied For
                  </th>
                  <th className="p-4 border-b border-white/10 text-left text-sm font-semibold text-white">
                    Experience
                  </th>
                  <th className="p-4 border-b border-white/10 text-left text-sm font-semibold text-white">
                    Match Score
                  </th>
                  <th className="p-4 border-b border-white/10 text-left text-sm font-semibold text-white">
                    Applied Date
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
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/30 transition-colors group/row">
                    <td className="p-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                          {app.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{app.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <FiMail className="w-3 h-3 text-slate-400" />
                            <span className="text-xs text-slate-400">{app.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 border-b border-white/10">
                      <div>
                        <p className="font-medium text-white">{app.appliedFor}</p>
                        <p className="text-sm text-slate-400">{app.currentCompany}</p>
                      </div>
                    </td>
                    <td className="p-4 border-b border-white/10">
                      <p className="font-medium text-white">{app.experience}</p>
                    </td>
                    <td className="p-4 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              app.matchScore >= 80 ? "bg-gradient-to-r from-emerald-500 to-green-500" :
                              app.matchScore >= 60 ? "bg-gradient-to-r from-amber-500 to-orange-500" :
                              "bg-gradient-to-r from-rose-500 to-red-500"
                            }`}
                            style={{ width: `${app.matchScore}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${getMatchColor(app.matchScore)}`}>
                          {app.matchScore}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="w-4 h-4 text-slate-400" />
                        <span className="text-white">{app.appliedDate}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">7 days ago</p>
                    </td>
                    <td className="p-4 border-b border-white/10">
                      <div className="flex flex-col gap-2">
                        <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                        <div className="flex gap-1">
                          {["New", "Reviewed", "Interview", "Hired", "Rejected"].map(status => (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(app.id, status)}
                              className={`text-xs px-2 py-1 rounded ${
                                app.status === status 
                                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white" 
                                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                              }`}
                            >
                              {status.charAt(0)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 border-b border-white/10">
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/recruitment/applications/${app.id}`}
                          className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </Link>
                        <button className="p-2 rounded-lg hover:bg-slate-700/50 text-emerald-400 hover:text-emerald-300 transition-colors" title="Approve">
                          <FiCheck className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-slate-700/50 text-rose-400 hover:text-rose-300 transition-colors" title="Reject">
                          <FiX className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-slate-700/50 text-cyan-400 hover:text-cyan-300 transition-colors" title="Download CV">
                          <FiDownload className="w-4 h-4" />
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
                          <FiUser className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">No applications found</h3>
                        <p className="text-slate-400 mb-4">Try adjusting your search or filter criteria</p>
                        <button
                          onClick={() => {
                            setSearch("");
                            setStatusFilter("All");
                            setJobFilter("All");
                          }}
                          className="text-cyan-400 hover:text-cyan-300 font-medium"
                        >
                          Clear all filters
                        </button>
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
              <span className="font-medium text-white">{applications.length}</span> applications
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

export default ApplicationsList;
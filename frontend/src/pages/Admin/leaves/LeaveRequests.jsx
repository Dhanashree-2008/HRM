import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiCalendar, FiCheck, FiX, FiClock, FiUser, FiDownload, FiFilter, FiPieChart, FiBarChart2 } from "react-icons/fi";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme, getThemeClasses } from "../../../contexts/ThemeContext";

const LeaveRequests = () => {
  const darkMode = useTheme();
  const theme = getThemeClasses(darkMode);
  const [filter, setFilter] = useState("all");
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const cardBorder = darkMode ? 'border-gray-700' : 'border-gray-200';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const inputBg = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const inputBorder = darkMode ? 'border-gray-700' : 'border-gray-300';
  const hoverBg = darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100';

  const formatDate = (d) => {
    try {
      return String(d).slice(0, 10);
    } catch {
      return d;
    }
  };

  const calculateDays = (from, to) => {
    try {
      const start = new Date(from);
      const end = new Date(to);
      const ms = end - start;
      const days = Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
      return `${days} days`;
    } catch {
      return "";
    }
  };

  const initials = (name) => {
    if (!name) return "NA";
    const parts = String(name).trim().split(/\s+/);
    return parts.slice(0, 2).map(p => p[0]).join("").toUpperCase();
  };

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/leave/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (res.data || []).map((l) => ({
        id: l.id,
        employee: l.employee?.fullName || "Unknown",
        employeeId: l.employee?.employeeCode || "-",
        department: l.employee?.department || "-",
        leaveType: l.leaveType,
        fromDate: formatDate(l.fromDate),
        toDate: formatDate(l.toDate),
        duration: calculateDays(l.fromDate, l.toDate),
        reason: l.reason || "",
        status: (l.status || "PENDING").toLowerCase(),
        appliedOn: formatDate(l.createdAt || l.fromDate), // Use createdAt if available
        avatar: initials(l.employee?.fullName || "User"),
      }));
      setLeaveRequests(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const filteredRequests = leaveRequests.filter(req => {
    if (filter === "all") return true;
    return req.status === filter;
  });

  const stats = {
    total: leaveRequests.length,
    pending: leaveRequests.filter(req => req.status === "pending").length,
    approved: leaveRequests.filter(req => req.status === "approved").length,
    rejected: leaveRequests.filter(req => req.status === "rejected").length,
  };

  // Data for charts
  const leaveTypeData = [
    { name: "Earned Leave", value: leaveRequests.filter(r => r.leaveType === "Earned Leave").length, color: "#8B5CF6" },
    { name: "Sick Leave", value: leaveRequests.filter(r => r.leaveType === "Sick Leave").length, color: "#10B981" },
    { name: "Casual Leave", value: leaveRequests.filter(r => r.leaveType === "Casual Leave").length, color: "#3B82F6" },
    { name: "Maternity Leave", value: leaveRequests.filter(r => r.leaveType === "Maternity Leave").length, color: "#EC4899" },
  ];

  const departmentLeaveData = [
    { name: "IT", pending: leaveRequests.filter(r => r.department === "IT" && r.status === "pending").length, approved: leaveRequests.filter(r => r.department === "IT" && r.status === "approved").length, color: "#8B5CF6" },
    { name: "HR", pending: leaveRequests.filter(r => r.department === "HR" && r.status === "pending").length, approved: leaveRequests.filter(r => r.department === "HR" && r.status === "approved").length, color: "#10B981" },
    { name: "Finance", pending: leaveRequests.filter(r => r.department === "Finance" && r.status === "pending").length, approved: leaveRequests.filter(r => r.department === "Finance" && r.status === "approved").length, color: "#3B82F6" },
    { name: "Marketing", pending: leaveRequests.filter(r => r.department === "Marketing" && r.status === "pending").length, approved: leaveRequests.filter(r => r.department === "Marketing" && r.status === "approved").length, color: "#F59E0B" },
    { name: "Operations", pending: leaveRequests.filter(r => r.department === "Operations" && r.status === "pending").length, approved: leaveRequests.filter(r => r.department === "Operations" && r.status === "approved").length, color: "#EC4899" },
  ];

  const monthlyTrendData = React.useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const trends = months.map(m => ({ month: m, requests: 0, approved: 0 }));

    leaveRequests.forEach(req => {
      const d = new Date(req.appliedOn);
      if (!isNaN(d.getTime())) {
        const mIndex = d.getMonth();
        trends[mIndex].requests++;
        if (req.status === 'approved') trends[mIndex].approved++;
      }
    });

    // Filter to show maybe only months with data or current year? For now show all 12
    return trends;
  }, [leaveRequests]);

  const statusDistribution = [
    { name: "Pending", value: stats.pending, color: "#F59E0B" },
    { name: "Approved", value: stats.approved, color: "#10B981" },
    { name: "Rejected", value: stats.rejected, color: "#EF4444" },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} p-3 border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg shadow-lg`}>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const toggleSelectRequest = (id) => {
    setSelectedRequests(prev =>
      prev.includes(id)
        ? prev.filter(reqId => reqId !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedRequests.length === filteredRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(filteredRequests.map(req => req.id));
    }
  };

  const approveRequest = (id) => {
    const token = localStorage.getItem("token");
    axios.post(`/api/leave/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setLeaveRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "approved" } : r));
        setSelectedRequests((prev) => prev.filter((rid) => rid !== id));
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Approve failed");
      });
  };

  const rejectRequest = (id) => {
    const token = localStorage.getItem("token");
    axios.post(`/api/leave/${id}/reject`, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setLeaveRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "rejected" } : r));
        setSelectedRequests((prev) => prev.filter((rid) => rid !== id));
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Reject failed");
      });
  };

  const bulkApprove = () => {
    const token = localStorage.getItem("token");
    const ids = [...selectedRequests];
    if (ids.length === 0) return;
    Promise.all(ids.map((id) => axios.post(`/api/leave/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } })))
      .then(() => {
        setLeaveRequests((prev) => prev.map((r) => ids.includes(r.id) ? { ...r, status: "approved" } : r));
        setSelectedRequests([]);
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Bulk approve failed");
      });
  };

  const bulkReject = () => {
    const token = localStorage.getItem("token");
    const ids = [...selectedRequests];
    if (ids.length === 0) return;
    Promise.all(ids.map((id) => axios.post(`/api/leave/${id}/reject`, {}, { headers: { Authorization: `Bearer ${token}` } })))
      .then(() => {
        setLeaveRequests((prev) => prev.map((r) => ids.includes(r.id) ? { ...r, status: "rejected" } : r));
        setSelectedRequests([]);
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Bulk reject failed");
      });
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${textPrimary}`}>
              Leave Requests
            </h1>
            <p className={textSecondary}>
              Review and manage employee leave requests with visual analytics.
            </p>
          </div>

          <div className="flex gap-3">
            <button className={`flex items-center gap-2 px-4 py-2.5 ${inputBg} border ${inputBorder} ${textPrimary} rounded-lg ${hoverBg} font-medium`}>
              <FiDownload className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Status Distribution Pie Chart */}
        <div className={`${cardBg} rounded-xl p-6 border ${cardBorder}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-lg font-semibold ${textPrimary}`}>Status Distribution</h3>
              <p className={`text-sm ${textSecondary}`}>Breakdown of leave requests</p>
            </div>
            <FiPieChart className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <div className="h-64" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {statusDistribution.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-white" style={{ color: item.color }}>
                  {item.value}
                </div>
                <div className={`text-sm ${textSecondary}`}>{item.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Types Bar Chart */}
        <div className={`${cardBg} rounded-xl p-6 border ${cardBorder}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-lg font-semibold ${textPrimary}`}>Leave Types</h3>
              <p className={`text-sm ${textSecondary}`}>Distribution by leave type</p>
            </div>
            <FiBarChart2 className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <div className="h-64" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={leaveTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#E5E7EB"} />
                <XAxis dataKey="name" stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
                <YAxis stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]}>
                  {leaveTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Second Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Department Comparison */}
        <div className={`${cardBg} rounded-xl p-6 border ${cardBorder}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-lg font-semibold ${textPrimary}`}>Department Analysis</h3>
              <p className={`text-sm ${textSecondary}`}>Pending vs Approved by department</p>
            </div>
            <FiBarChart2 className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <div className="h-64" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={departmentLeaveData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#E5E7EB"} />
                <XAxis dataKey="name" stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
                <YAxis stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="pending" name="Pending" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="approved" name="Approved" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className={`${cardBg} rounded-xl p-6 border ${cardBorder}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-lg font-semibold ${textPrimary}`}>Monthly Trends</h3>
              <p className={`text-sm ${textSecondary}`}>Last 6 months leave activity</p>
            </div>
            <FiBarChart2 className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <div className="h-64" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#E5E7EB"} />
                <XAxis dataKey="month" stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
                <YAxis stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="requests" name="Total Requests" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="approved" name="Approved" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className={`${cardBg} p-5 rounded-xl border ${cardBorder}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total Requests</p>
              <h3 className={`text-2xl font-bold ${textPrimary} mt-1`}>{stats.total}</h3>
            </div>
            <FiCalendar className={`w-8 h-8 ${textSecondary}`} />
          </div>
        </div>

        <div className={`${cardBg} p-5 rounded-xl border ${darkMode ? 'border-amber-500/30' : 'border-amber-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600 dark:text-amber-300">Pending</p>
              <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-300 mt-1">{stats.pending}</h3>
            </div>
            <FiClock className="w-8 h-8 text-amber-500" />
          </div>
        </div>

        <div className={`${cardBg} p-5 rounded-xl border ${darkMode ? 'border-emerald-500/30' : 'border-emerald-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 dark:text-emerald-300">Approved</p>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-300 mt-1">{stats.approved}</h3>
            </div>
            <FiCheck className="w-8 h-8 text-emerald-500" />
          </div>
        </div>

        <div className={`${cardBg} p-5 rounded-xl border ${darkMode ? 'border-rose-500/30' : 'border-rose-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-rose-600 dark:text-rose-300">Rejected</p>
              <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-300 mt-1">{stats.rejected}</h3>
            </div>
            <FiX className="w-8 h-8 text-rose-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`${cardBg} rounded-xl p-6 border ${cardBorder} mb-6`}>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex-1">
            <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
              Filter by Status
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === "all"
                  ? "bg-purple-600 text-white"
                  : `${inputBg} ${textSecondary} hover:text-white border ${inputBorder}`
                  }`}
              >
                All Requests ({stats.total})
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === "pending"
                  ? "bg-amber-500 text-white"
                  : `${inputBg} ${textSecondary} hover:text-white border ${inputBorder}`
                  }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setFilter("approved")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === "approved"
                  ? "bg-emerald-500 text-white"
                  : `${inputBg} ${textSecondary} hover:text-white border ${inputBorder}`
                  }`}
              >
                Approved ({stats.approved})
              </button>
              <button
                onClick={() => setFilter("rejected")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === "rejected"
                  ? "bg-rose-500 text-white"
                  : `${inputBg} ${textSecondary} hover:text-white border ${inputBorder}`
                  }`}
              >
                Rejected ({stats.rejected})
              </button>
            </div>
          </div>

          {/* Date Range */}
          <div className="flex gap-2">
            <div>
              <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
                From Date
              </label>
              <input
                type="date"
                className={`w-full px-4 py-2 ${inputBg} border ${inputBorder} ${textPrimary} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
                To Date
              </label>
              <input
                type="date"
                className={`w-full px-4 py-2 ${inputBg} border ${inputBorder} ${textPrimary} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
              />
            </div>
          </div>
        </div>

        {/* Batch Actions */}
        {selectedRequests.length > 0 && (
          <div className={`mt-4 p-4 ${darkMode ? 'bg-purple-500/10' : 'bg-purple-50'} rounded-lg border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'} flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-purple-600' : 'bg-purple-500'} text-white flex items-center justify-center`}>
                {selectedRequests.length}
              </div>
              <span className={`font-medium ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                {selectedRequests.length} request{selectedRequests.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={bulkApprove}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600"
              >
                Approve All
              </button>
              <button
                onClick={bulkReject}
                className="px-4 py-2 bg-rose-500 text-white rounded-lg text-sm hover:bg-rose-600"
              >
                Reject All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Leave Requests Table */}
      <div className={`${cardBg} rounded-xl p-1 border ${cardBorder} mb-8`}>
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full">
            <thead className={darkMode ? 'bg-gray-900' : 'bg-gray-50'}>
              <tr>
                <th className="p-4 border-b border-gray-700 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRequests.length === filteredRequests.length && filteredRequests.length > 0}
                    onChange={selectAll}
                    className={`rounded ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'} text-purple-500 focus:ring-purple-500`}
                  />
                </th>
                <th className={`p-4 border-b ${cardBorder} text-left text-sm font-semibold ${textSecondary}`}>
                  Employee
                </th>
                <th className={`p-4 border-b ${cardBorder} text-left text-sm font-semibold ${textSecondary}`}>
                  Leave Type
                </th>
                <th className={`p-4 border-b ${cardBorder} text-left text-sm font-semibold ${textSecondary}`}>
                  Duration
                </th>
                <th className={`p-4 border-b ${cardBorder} text-left text-sm font-semibold ${textSecondary}`}>
                  Reason
                </th>
                <th className={`p-4 border-b ${cardBorder} text-left text-sm font-semibold ${textSecondary}`}>
                  Applied On
                </th>
                <th className={`p-4 border-b ${cardBorder} text-left text-sm font-semibold ${textSecondary}`}>
                  Status
                </th>
                <th className={`p-4 border-b ${cardBorder} text-left text-sm font-semibold ${textSecondary}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req.id} className={`${darkMode ? 'hover:bg-gray-900/50' : 'hover:bg-gray-50'} transition-colors`}>
                  <td className={`p-4 border-b ${cardBorder}`}>
                    <input
                      type="checkbox"
                      checked={selectedRequests.includes(req.id)}
                      onChange={() => toggleSelectRequest(req.id)}
                      className={`rounded ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'} text-purple-500 focus:ring-purple-500`}
                    />
                  </td>
                  <td className={`p-4 border-b ${cardBorder}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 flex items-center justify-center text-white font-bold">
                        {req.avatar}
                      </div>
                      <div>
                        <p className={`font-medium ${textPrimary}`}>{req.employee}</p>
                        <p className={`text-sm ${textSecondary}`}>{req.employeeId} • {req.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className={`p-4 border-b ${cardBorder}`}>
                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${req.leaveType === "Earned Leave" ? `${darkMode ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}` :
                      req.leaveType === "Sick Leave" ? `${darkMode ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-700 border-amber-200'}` :
                        req.leaveType === "Maternity Leave" ? `${darkMode ? 'bg-pink-500/20 text-pink-400 border-pink-500/30' : 'bg-pink-100 text-pink-700 border-pink-200'}` :
                          `${darkMode ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-purple-100 text-purple-700 border-purple-200'}`
                      }`}>
                      {req.leaveType}
                    </span>
                  </td>
                  <td className={`p-4 border-b ${cardBorder}`}>
                    <div>
                      <p className={`font-medium ${textPrimary}`}>{req.duration}</p>
                      <p className={`text-sm ${textSecondary}`}>{req.fromDate} to {req.toDate}</p>
                    </div>
                  </td>
                  <td className={`p-4 border-b ${cardBorder}`}>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{req.reason}</p>
                  </td>
                  <td className={`p-4 border-b ${cardBorder}`}>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{req.appliedOn}</p>
                  </td>
                  <td className={`p-4 border-b ${cardBorder}`}>
                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border ${req.status === "pending" ? `${darkMode ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-700 border-amber-200'}` :
                      req.status === "approved" ? `${darkMode ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}` :
                        `${darkMode ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-rose-100 text-rose-700 border-rose-200'}`
                      }`}>
                      <span className={`w-2 h-2 rounded-full ${req.status === "pending" ? "bg-amber-500" :
                        req.status === "approved" ? "bg-emerald-500" : "bg-rose-500"
                        }`}></span>
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                  </td>
                  <td className={`p-4 border-b ${cardBorder}`}>
                    {req.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveRequest(req.id)}
                          className="px-3 py-1.5 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectRequest(req.id)}
                          className="px-3 py-1.5 bg-rose-500 text-white text-sm rounded-lg hover:bg-rose-600"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => req.status === "approved" ? rejectRequest(req.id) : approveRequest(req.id)}
                        className={`px-3 py-1.5 border ${inputBorder} ${textSecondary} text-sm rounded-lg ${hoverBg}`}
                      >
                        {req.status === "approved" ? "Mark as Rejected" : "Mark as Approved"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredRequests.length === 0 && (
          <div className="p-8 text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${inputBg} flex items-center justify-center`}>
              <FiCalendar className={`w-8 h-8 ${textSecondary}`} />
            </div>
            <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>No leave requests found</h3>
            <p className={textSecondary}>There are no leave requests matching your filters</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 gap-6">
        {/* Leave Balance Summary */}
        {/* Leave Balance Summary - REMOVED (Not relevant for global admin view without context) 
            Instead we can show maybe recent rejections or just make the upcoming full width
        */}


        {/* Upcoming Leaves */}
        <div className={`${cardBg} rounded-xl p-6 border ${cardBorder}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${textPrimary}`}>Upcoming Approved Leaves</h3>
            <button
              onClick={() => setFilter("approved")}
              className={`text-sm ${darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'} font-medium`}
            >
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {leaveRequests
              .filter(req => {
                if (req.status !== "approved") return false;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const leaveDate = new Date(req.fromDate);
                return leaveDate >= today;
              })
              .sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate))
              .slice(0, 5)
              .map((req, index) => (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'hover:bg-gray-900/50' : 'hover:bg-gray-50'} transition-colors`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 flex items-center justify-center text-white font-bold">
                      {req.avatar}
                    </div>
                    <div>
                      <p className={`font-medium ${textPrimary}`}>{req.employee}</p>
                      <p className={`text-sm ${textSecondary}`}>{req.leaveType} • {req.duration}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${textPrimary}`}>{req.fromDate}</p>
                    <p className={`text-xs ${textSecondary}`}>to {req.toDate}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequests;

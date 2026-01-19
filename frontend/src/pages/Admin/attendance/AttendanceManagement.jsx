import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiCalendar, FiCheck, FiX, FiClock, FiUser, FiDownload, FiFilter } from "react-icons/fi";
import { useTheme, getThemeClasses } from "../../../contexts/ThemeContext";

const AttendanceManagement = () => {
  const [filter, setFilter] = useState("all"); // all | present | absent | present_no_logout
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const darkMode = useTheme();
  const themeClasses = getThemeClasses(darkMode);

  const initials = (name) => {
    if (!name) return "NA";
    return name.split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase();
  };

  const fetchTodayAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/manager/attendance/today", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (res.data || []).map((e, idx) => ({
        id: idx + 1,
        name: e.fullName,
        employeeCode: e.employeeCode,
        department: e.department,
        designation: e.designation,
        status: e.status, // PRESENT | ABSENT | PRESENT_NO_LOGOUT
        markIn: e.markIn ? new Date(e.markIn).toLocaleTimeString() : null,
        markOut: e.markOut ? new Date(e.markOut).toLocaleTimeString() : null,
        avatar: initials(e.fullName),
      }));
      setEmployees(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const filteredEmployees = employees.filter(emp => {
    if (filter === "all") return true;
    if (filter === "present") return emp.status === "PRESENT";
    if (filter === "present_no_logout") return emp.status === "PRESENT_NO_LOGOUT";
    if (filter === "absent") return emp.status === "ABSENT";
    return true;
  });

  const stats = {
    total: employees.length,
    present: employees.filter(e => e.status === "PRESENT").length,
    presentNoLogout: employees.filter(e => e.status === "PRESENT_NO_LOGOUT").length,
    absent: employees.filter(e => e.status === "ABSENT").length,
  };

  const refresh = () => fetchTodayAttendance();

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${themeClasses.text.primary}`}>
              Attendance Management
            </h1>
            <p className={themeClasses.text.secondary}>
              View today's attendance across departments. Admin sees all; Managers see their department.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button className={`flex items-center gap-2 px-4 py-2.5 ${themeClasses.bg.secondary} border ${themeClasses.border.primary} ${themeClasses.text.primary} rounded-lg hover:${darkMode ? 'bg-gray-700' : 'bg-gray-300'} font-medium`}>
              <FiDownload className="w-4 h-4" />
              Export CSV
            </button>
            <button onClick={refresh} className={`px-4 py-2.5 border ${themeClasses.border.primary} ${themeClasses.text.primary} rounded-lg hover:${darkMode ? 'bg-gray-700' : 'bg-gray-300'} font-medium`}>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className={`${themeClasses.bg.secondary} p-5 rounded-xl border ${themeClasses.border.primary}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${themeClasses.text.secondary}`}>Total Employees</p>
              <h3 className={`text-2xl font-bold ${themeClasses.text.primary} mt-1`}>{stats.total}</h3>
            </div>
            <FiCalendar className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        <div className={`${themeClasses.bg.secondary} p-5 rounded-xl border ${themeClasses.border.primary}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-300">Present</p>
              <h3 className="text-2xl font-bold text-emerald-300 mt-1">{stats.present}</h3>
            </div>
            <FiCheck className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
        
        <div className={`${themeClasses.bg.secondary} p-5 rounded-xl border ${themeClasses.border.primary}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-300">Present (No Logout)</p>
              <h3 className="text-2xl font-bold text-amber-300 mt-1">{stats.presentNoLogout}</h3>
            </div>
            <FiClock className="w-8 h-8 text-amber-400" />
          </div>
        </div>
        
        <div className={`${themeClasses.bg.secondary} p-5 rounded-xl border ${themeClasses.border.primary}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-rose-300">Absent</p>
              <h3 className="text-2xl font-bold text-rose-300 mt-1">{stats.absent}</h3>
            </div>
            <FiX className="w-8 h-8 text-rose-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary} mb-6`}>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex-1">
            <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
              Filter by Status
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "all"
                    ? "bg-purple-600 text-white"
                    : `${themeClasses.bg.tertiary} ${themeClasses.text.secondary} hover:${themeClasses.text.primary} border ${themeClasses.border.primary}`
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setFilter("present")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "present"
                    ? "bg-emerald-500 text-white"
                    : `${themeClasses.bg.tertiary} ${themeClasses.text.secondary} hover:${themeClasses.text.primary} border ${themeClasses.border.primary}`
                }`}
              >
                Present ({stats.present})
              </button>
              <button
                onClick={() => setFilter("present_no_logout")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "present_no_logout"
                    ? "bg-amber-500 text-white"
                    : `${themeClasses.bg.tertiary} ${themeClasses.text.secondary} hover:${themeClasses.text.primary} border ${themeClasses.border.primary}`
                }`}
              >
                No Logout ({stats.presentNoLogout})
              </button>
              <button
                onClick={() => setFilter("absent")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "absent"
                    ? "bg-rose-500 text-white"
                    : `${themeClasses.bg.tertiary} ${themeClasses.text.secondary} hover:${themeClasses.text.primary} border ${themeClasses.border.primary}`
                }`}
              >
                Absent ({stats.absent})
              </button>
            </div>
          </div>
          
          {/* Date Range */}
          <div className="flex gap-2">
            <div>
              <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                From Date
              </label>
              <input
                type="date"
                className={`w-full px-4 py-2 ${themeClasses.input.bg} border ${themeClasses.input.border} ${themeClasses.input.text} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                To Date
              </label>
              <input
                type="date"
                className={`w-full px-4 py-2 ${themeClasses.input.bg} border ${themeClasses.input.border} ${themeClasses.input.text} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
              />
            </div>
          </div>
        </div>

        {/* Batch Actions */}
        {selectedRequests.length > 0 && (
          <div className="mt-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
                {selectedRequests.length}
              </div>
              <span className="text-purple-300 font-medium">
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

      {/* Attendance Table */}
      <div className={`${themeClasses.bg.secondary} rounded-xl p-1 border ${themeClasses.border.primary} mb-8`}>
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full">
            <thead className={themeClasses.bg.tertiary}>
              <tr>
                <th className={`p-4 border-b ${themeClasses.border.primary} text-left text-sm font-semibold ${themeClasses.text.secondary}`}>
                  Employee
                </th>
                <th className={`p-4 border-b ${themeClasses.border.primary} text-left text-sm font-semibold ${themeClasses.text.secondary}`}>
                  Status
                </th>
                <th className={`p-4 border-b ${themeClasses.border.primary} text-left text-sm font-semibold ${themeClasses.text.secondary}`}>
                  Mark In
                </th>
                <th className={`p-4 border-b ${themeClasses.border.primary} text-left text-sm font-semibold ${themeClasses.text.secondary}`}>
                  Mark Out
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="p-4" colSpan={4}>Loading...</td></tr>
              ) : error ? (
                <tr><td className="p-4 text-rose-400" colSpan={4}>{error}</td></tr>
              ) : filteredEmployees.length === 0 ? (
                <tr><td className="p-4" colSpan={4}>No employees found for filters</td></tr>
              ) : filteredEmployees.map((emp) => (
                <tr key={emp.id} className={`hover:${themeClasses.bg.tertiary}/50 transition-colors`}>
                  <td className={`p-4 border-b ${themeClasses.border.primary}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 flex items-center justify-center text-white font-bold">
                        {emp.avatar}
                      </div>
                      <div>
                        <p className={`font-medium ${themeClasses.text.primary}`}>{emp.name}</p>
                        <p className={`text-sm ${themeClasses.text.secondary}`}>{emp.employeeCode} • {emp.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className={`p-4 border-b ${themeClasses.border.primary}`}>
                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                      emp.status === "PRESENT" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                      emp.status === "PRESENT_NO_LOGOUT" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                      "bg-rose-500/20 text-rose-400 border-rose-500/30"
                    }`}>
                      {emp.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className={`p-4 border-b ${themeClasses.border.primary}`}>
                    <p className={themeClasses.text.primary}>{emp.markIn || "-"}</p>
                  </td>
                  <td className={`p-4 border-b ${themeClasses.border.primary}`}>
                    <p className={themeClasses.text.primary}>{emp.markOut || "-"}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredRequests.length === 0 && (
          <div className="p-8 text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${themeClasses.bg.tertiary} flex items-center justify-center`}>
              <FiCalendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className={`text-lg font-medium ${themeClasses.text.primary} mb-2`}>No leave requests found</h3>
            <p className={themeClasses.text.secondary}>There are no leave requests matching your filters</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leave Balance Summary */}
        <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary}`}>
          <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>Leave Balance Summary</h3>
          <div className="space-y-4">
            {[
              { type: "Earned Leave", total: 20, used: 8, remaining: 12 },
              { type: "Sick Leave", total: 12, used: 4, remaining: 8 },
              { type: "Casual Leave", total: 15, used: 6, remaining: 9 },
            ].map((leave, index) => (
              <div key={index} className={`p-3 rounded-lg border ${themeClasses.border.primary}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`font-medium ${themeClasses.text.primary}`}>{leave.type}</span>
                  <span className={`font-bold ${themeClasses.text.primary}`}>{leave.remaining} days left</span>
                </div>
                <div className={`flex justify-between text-sm ${themeClasses.text.secondary} mb-1`}>
                  <span>Used: {leave.used}</span>
                  <span>Total: {leave.total}</span>
                </div>
                <div className={`h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-full overflow-hidden`}>
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-400"
                    style={{ width: `${(leave.used/leave.total)*100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Leaves */}
        <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Recent Present Employees</h3>
            <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
              View All →
            </button>
          </div>
          
          <div className="space-y-3">
            {employees
              .filter(e => e.status === "PRESENT")
              .slice(0, 3)
              .map((emp, index) => (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg hover:${themeClasses.bg.tertiary}/50 transition-colors`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 flex items-center justify-center text-white font-bold">
                      {emp.avatar}
                    </div>
                    <div>
                      <p className={`font-medium ${themeClasses.text.primary}`}>{emp.name}</p>
                      <p className={`text-sm ${themeClasses.text.secondary}`}>{emp.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{emp.markIn || "-"}</p>
                    <p className="text-xs text-gray-400">logout: {emp.markOut || "-"}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagement;

import React, { useState, useEffect, useMemo } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight, FiDownload, FiUsers, FiTrendingUp, FiTrendingDown, FiClock, FiPieChart } from "react-icons/fi";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme, getThemeClasses } from "../../../contexts/ThemeContext";
import axios from "axios";

const MonthlyAttendance = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [viewMode, setViewMode] = useState("calendar");
  const [employees, setEmployees] = useState([]);
  const [rawAttendance, setRawAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const darkMode = useTheme();
  const themeClasses = getThemeClasses(darkMode);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentMonthName = months[currentMonth.getMonth()];
  const currentYear = currentMonth.getFullYear();

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch Employees
        const empRes = await axios.get("http://localhost:5000/api/admin/employees", { headers });
        // Res is a list of users, map to employees
        const validEmployees = empRes.data
          .filter(u => u.employee)
          .map(u => ({
            id: u.employee.id,
            fullName: u.employee.fullName,
            firstName: u.employee.fullName.split(' ')[0],
            lastName: u.employee.fullName.split(' ').slice(1).join(' '),
            department: u.employee.department
          }));
        setEmployees(validEmployees);

        // Fetch Attendance for Month
        const monthParam = currentMonth.getMonth() + 1; // 1-12
        const yearParam = currentMonth.getFullYear();
        const attRes = await axios.get(`http://localhost:5000/api/attendance/all?month=${monthParam}&year=${yearParam}`, { headers });
        setRawAttendance(attRes.data);

      } catch (error) {
        console.error("Failed to fetch attendance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentMonth]);

  // Process Data for UI
  const processedData = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth.getMonth() + 1, 0).getDate();
    const data = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(currentYear, currentMonth.getMonth(), day);
      const dateStr = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
      const dayOfWeek = dateObj.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      const dayEmployees = employees.map(emp => {
        // Find attendance record for this employee on this date
        const record = rawAttendance.find(r =>
          r.employeeId === emp.id && r.date === dateStr
        );

        let status = isWeekend ? 'weekend' : 'absent';
        let checkIn = '-';
        let checkOut = '-';

        if (record) {
          status = 'present';
          if (record.markIn) {
            const inTime = new Date(record.markIn);
            checkIn = inTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

            // Simple Late Check (e.g., after 09:15)
            if (inTime.getHours() > 9 || (inTime.getHours() === 9 && inTime.getMinutes() > 15)) {
              // status = 'late'; // Determine if we want a separate status or just flag it
            }
          }
          if (record.markOut) {
            const outTime = new Date(record.markOut);
            checkOut = outTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
          }
        }

        // TODO: Integrate Leave Records to override 'absent' with 'leave'

        return {
          id: emp.id,
          name: emp.fullName,
          department: emp.department || 'N/A', // Adjust based on employee model
          status,
          checkIn,
          checkOut,
          isLate: false // derived from checkIn logic if needed
        };
      });

      // Filter if specific employee selected
      const filteredEmployees = selectedEmployee === 'all'
        ? dayEmployees
        : dayEmployees.filter(e => e.id === parseInt(selectedEmployee));

      data.push({
        day,
        date: dateStr,
        isWeekend,
        employees: filteredEmployees
      });
    }
    return data;
  }, [currentMonth, employees, rawAttendance, selectedEmployee]);

  // Calculate Stats
  const stats = useMemo(() => {
    let totalWorkingDays = 0;
    let presentDays = 0;
    let absentDays = 0;
    let leaveDays = 0;
    let lateArrivals = 0;

    processedData.forEach(day => {
      if (!day.isWeekend) {
        totalWorkingDays++; // This is effectively days * employees count if we aggregate
        // But typically stats are "User Days". 
        // Let's summing up counts across all employees across all days
        day.employees.forEach(emp => {
          if (emp.status === 'present') presentDays++;
          if (emp.status === 'absent') absentDays++;
          if (emp.status === 'leave') leaveDays++;
          // late check
        });
      }
    });

    // Normalize "Total Working Days" relative to one employee for display? 
    // Or aggregate? The design shows aggregate numbers.
    // Let's just return aggregate counts.

    return {
      workingDays: processedData.filter(d => !d.isWeekend).length, // Days in month excluding weekends
      presentDays,
      absentDays,
      leaveDays,
      lateArrivals
    };

  }, [processedData]);

  const attendanceDistribution = [
    { name: "Present", value: stats.presentDays, color: "#10B981" },
    { name: "Absent", value: stats.absentDays, color: "#EF4444" },
    // { name: "Late", value: stats.lateArrivals, color: "#F59E0B" },
    { name: "Leave", value: stats.leaveDays, color: "#3B82F6" },
    // { name: "Weekend", value: 0, color: "#8B5CF6" },
  ].filter(d => d.value > 0);

  const departmentPerformance = useMemo(() => {
    const deptMap = {};

    // Count total possible days and present days per department
    processedData.forEach(day => {
      if (day.isWeekend) return;
      day.employees.forEach(emp => {
        if (!deptMap[emp.department]) {
          deptMap[emp.department] = { present: 0, total: 0 };
        }
        deptMap[emp.department].total++;
        if (emp.status === 'present') {
          deptMap[emp.department].present++;
        }
      });
    });

    return Object.keys(deptMap).map(dept => ({
      department: dept,
      attendance: deptMap[dept].total > 0 ? Math.round((deptMap[dept].present / deptMap[dept].total) * 100) : 0,
      late: 0, // Implement if needed
      absent: 0
    }));
  }, [processedData]);


  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'absent': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'leave': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'weekend': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return '✓';
      case 'absent': return '✗';
      case 'leave': return 'L';
      case 'weekend': return 'W';
      default: return '-';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${themeClasses.bg.primary} p-3 border ${themeClasses.border.primary} rounded-lg shadow-lg`}>
          <p className={themeClasses.text.primary}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };


  if (loading && employees.length === 0) {
    return <div className="p-8 text-center text-gray-500">Loading attendance data...</div>;
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${themeClasses.text.primary}`}>
              Monthly Attendance Analytics
            </h1>
            <p className={themeClasses.text.secondary}>
              Comprehensive monthly attendance analysis with visual insights.
            </p>
          </div>

          <div className="flex gap-3">
            <button className={`flex items-center gap-2 px-4 py-2.5 ${themeClasses.bg.secondary} border ${themeClasses.border.primary} ${themeClasses.text.primary} rounded-lg hover:${darkMode ? 'bg-gray-700' : 'bg-gray-300'} font-medium`}>
              <FiDownload className="w-4 h-4" />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Attendance Distribution Pie Chart */}
        <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Attendance Distribution</h3>
              <p className={themeClasses.text.secondary}>Current month breakdown</p>
            </div>
            <FiPieChart className="w-6 h-6 text-purple-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attendanceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Performance Bar Chart */}
        <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Department Performance</h3>
              <p className={themeClasses.text.secondary}>Attendance rate by department</p>
            </div>
            <FiTrendingUp className="w-6 h-6 text-purple-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                <XAxis dataKey="department" stroke={darkMode ? "#9CA3AF" : "#4b5563"} />
                <YAxis stroke={darkMode ? "#9CA3AF" : "#4b5563"} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="attendance" name="Attendance %" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Month Navigation */}
      <div className={`${themeClasses.bg.secondary} rounded-xl border ${themeClasses.border.primary} p-6 mb-8`}>
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          {/* Month Selector */}
          <div className="flex items-center gap-4">
            <button
              onClick={prevMonth}
              className={`p-2 rounded-lg hover:${darkMode ? 'bg-gray-700' : 'bg-gray-300'} transition-colors`}
            >
              <FiChevronLeft className="w-5 h-5 text-white" />
            </button>

            <div className="text-center">
              <h2 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
                {currentMonthName} {currentYear}
              </h2>
              <p className={themeClasses.text.primary}>Attendance Overview</p>
            </div>

            <button
              onClick={nextMonth}
              className={`p-2 rounded-lg hover:${darkMode ? 'bg-gray-700' : 'bg-gray-300'} transition-colors`}
            >
              <FiChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className={`px-4 py-2.5 ${themeClasses.input.bg} border ${themeClasses.input.border} ${themeClasses.input.text} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
            >
              <option value="all" className={darkMode ? 'bg-gray-900' : 'bg-white'}>All Employees</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id} className={darkMode ? 'bg-gray-900' : 'bg-white'}>{emp.fullName}</option>
              ))}
            </select>

            <div className={`${themeClasses.bg.tertiary} p-1 rounded-lg border ${themeClasses.border.primary}`}>
              <button
                onClick={() => setViewMode("calendar")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === "calendar"
                  ? "bg-purple-600 text-white"
                  : `${themeClasses.text.secondary} hover:${themeClasses.text.primary}`
                  }`}
              >
                Calendar View
              </button>
              <button
                onClick={() => setViewMode("summary")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === "summary"
                  ? "bg-purple-600 text-white"
                  : `${themeClasses.text.secondary} hover:${themeClasses.text.primary}`
                  }`}
              >
                Summary View
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
          <div className={`${themeClasses.bg.tertiary} p-4 rounded-lg border ${themeClasses.border.primary}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <FiCalendar className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className={`text-sm ${themeClasses.text.secondary}`}>Working Month Days</p>
                <p className={`text-xl font-bold ${themeClasses.text.primary}`}>{stats.workingDays}</p>
              </div>
            </div>
          </div>
          <div className="bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <FiTrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-emerald-300">Total Present</p>
                <p className="text-xl font-bold text-emerald-300">{stats.presentDays}</p>
              </div>
            </div>
          </div>
          <div className="bg-rose-500/10 p-4 rounded-lg border border-rose-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
                <FiTrendingDown className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <p className="text-sm text-rose-300">Total Absent</p>
                <p className="text-xl font-bold text-rose-300">{stats.absentDays}</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <FiUsers className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-purple-300">Total Leave</p>
                <p className="text-xl font-bold text-purple-300">{stats.leaveDays}</p>
              </div>
            </div>
          </div>
          <div className="bg-amber-500/10 p-4 rounded-lg border border-amber-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <FiClock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-amber-300">Total Late</p>
                <p className="text-xl font-bold text-amber-300">{stats.lateArrivals}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Table */}
      {viewMode === "calendar" && (
        <div className={`${themeClasses.bg.secondary} rounded-xl p-1 border ${themeClasses.border.primary} mb-8`}>
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full">
              <thead className={themeClasses.bg.tertiary}>
                <tr>
                  <th className={`p-4 text-left text-sm font-semibold ${themeClasses.text.secondary} border-b ${themeClasses.border.primary}`}>Employee</th>
                  {processedData.map((day) => (
                    <th key={day.day} className={`p-4 text-center border-b ${themeClasses.border.primary}`}>
                      <div className={`text-sm font-medium ${day.isWeekend ? 'text-gray-500' : themeClasses.text.secondary}`}>
                        {day.day}
                      </div>
                      <div className={`text-xs ${day.isWeekend ? 'text-gray-500' : themeClasses.text.muted}`}>
                        {day.isWeekend ? 'WE' : 'WD'}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {processedData[0]?.employees.map(baseEmp => (
                  <tr key={baseEmp.id} className={`hover:${themeClasses.bg.tertiary}/50 transition-colors border-b ${themeClasses.border.primary}`}>
                    <td className={`p-4 sticky left-0 ${themeClasses.bg.tertiary}`}>
                      <div className="min-w-[200px]">
                        <p className={`font-medium ${themeClasses.text.primary}`}>{baseEmp.name}</p>
                        <p className={`text-sm ${themeClasses.text.secondary}`}>{baseEmp.department}</p>
                      </div>
                    </td>
                    {processedData.map(day => {
                      const employeeDay = day.employees.find(e => e.id === baseEmp.id);
                      return (
                        <td key={day.day} className="p-2 text-center">
                          <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-medium border ${getStatusColor(employeeDay?.status || '')
                            }`}>
                            {getStatusIcon(employeeDay?.status || '')}
                          </div>
                          {employeeDay?.status === 'present' && !day.isWeekend && (
                            <div className="text-xs text-gray-400 mt-1">
                              {employeeDay.checkIn}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary View */}
      {viewMode === "summary" && (
        <div className={`${themeClasses.bg.secondary} rounded-xl p-1 border ${themeClasses.border.primary} mb-8`}>
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full">
              <thead className={themeClasses.bg.tertiary}>
                <tr>
                  <th className={`p-4 text-left text-sm font-semibold ${themeClasses.text.secondary}`}>Employee</th>
                  <th className={`p-4 text-left text-sm font-semibold ${themeClasses.text.secondary}`}>Department</th>
                  <th className={`p-4 text-left text-sm font-semibold ${themeClasses.text.secondary}`}>Present</th>
                  <th className={`p-4 text-left text-sm font-semibold ${themeClasses.text.secondary}`}>Absent</th>
                  <th className={`p-4 text-left text-sm font-semibold ${themeClasses.text.secondary}`}>Leave</th>
                  <th className={`p-4 text-left text-sm font-semibold ${themeClasses.text.secondary}`}>Late Days</th>
                  <th className={`p-4 text-left text-sm font-semibold ${themeClasses.text.secondary}`}>Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => {
                  // Aggregate data for this employee
                  let presentCount = 0;
                  let absentCount = 0;
                  let leaveCount = 0;
                  let lateCount = 0;

                  processedData.forEach(day => {
                    if (day.isWeekend) return;
                    const empDay = day.employees.find(e => e.id === emp.id);
                    if (empDay) {
                      if (empDay.status === 'present') presentCount++;
                      if (empDay.status === 'absent') absentCount++;
                      if (empDay.status === 'leave') leaveCount++;
                      // late check
                    }
                  });

                  const totalWorkingDays = processedData.filter(d => !d.isWeekend).length;
                  const attendancePercentage = totalWorkingDays > 0 ? Math.round((presentCount / totalWorkingDays) * 100) : 0;

                  return (
                    <tr key={emp.id} className={`hover:${themeClasses.bg.tertiary}/50 transition-colors border-b ${themeClasses.border.primary}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 flex items-center justify-center text-white font-bold">
                            {emp.fullName ? emp.fullName[0] : ''}
                          </div>
                          <div>
                            <p className={`font-medium ${themeClasses.text.primary}`}>{emp.fullName}</p>
                            <p className={`text-sm ${themeClasses.text.secondary}`}>EMP{emp.id.toString().padStart(3, '0')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 ${themeClasses.bg.tertiary} ${themeClasses.text.secondary} rounded-full text-sm border ${themeClasses.border.primary}`}>
                          {emp.department || 'N/A'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-xl font-bold text-emerald-400">{presentCount}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-xl font-bold text-rose-400">{absentCount}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-xl font-bold text-purple-400">{leaveCount}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-xl font-bold text-amber-400">{lateCount}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className={`h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-full overflow-hidden`}>
                              <div
                                className={`h-full rounded-full ${attendancePercentage >= 90 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                                  attendancePercentage >= 75 ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-gradient-to-r from-rose-500 to-rose-400'
                                  }`}
                                style={{ width: `${attendancePercentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className={`text-lg font-bold ${attendancePercentage >= 90 ? 'text-emerald-400' :
                            attendancePercentage >= 75 ? 'text-amber-400' : 'text-rose-400'
                            }`}>
                            {attendancePercentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary} mb-8`}>
        <h3 className={`text-sm font-semibold ${themeClasses.text.primary} mb-4`}>Attendance Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">✓</div>
            <span className={`text-sm ${themeClasses.text.primary}`}>Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">✗</div>
            <span className={`text-sm ${themeClasses.text.primary}`}>Absent</span>
          </div>
          {/*
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">L</div>
                        <span className={`text-sm ${themeClasses.text.primary}`}>Leave</span>
                    </div>
                    */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30 flex items-center justify-center">W</div>
            <span className={`text-sm ${themeClasses.text.primary}`}>Weekend/Holiday</span>
          </div>
        </div>
      </div>
      {/* Actions... */}
    </div>
  );
};

export default MonthlyAttendance;

import React, { useState, useEffect } from "react";
import { 
  FiDownload, FiFilter, FiCalendar, FiTrendingUp, 
  FiTrendingDown, FiUsers, FiClock, FiBarChart2,
  FiPieChart, FiActivity, FiTarget, FiAward
} from "react-icons/fi";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadialBarChart, RadialBar
} from 'recharts';
import { useTheme, getThemeClasses } from "../../../contexts/ThemeContext";

const AttendanceReports = () => {
  const [reportType, setReportType] = useState("daily");
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const darkMode = useTheme();
  const themeClasses = getThemeClasses(darkMode);

  const departments = [
    { id: "all", name: "All Departments" },
    { id: "it", name: "IT" },
    { id: "hr", name: "HR" },
    { id: "finance", name: "Finance" },
    { id: "marketing", name: "Marketing" },
  ];

  const reportStats = {
    totalEmployees: 24,
    averageAttendance: 92.5,
    totalLateArrivals: 18,
    totalAbsences: 12,
    totalLeaves: 8,
    totalOvertime: 45,
  };

  const [trendData, setTrendData] = useState([
    { month: "Jan", attendance: 0, late: 0, absent: 0, overtime: 0 },
    { month: "Feb", attendance: 0, late: 0, absent: 0, overtime: 0 },
    { month: "Mar", attendance: 0, late: 0, absent: 0, overtime: 0 },
    { month: "Apr", attendance: 0, late: 0, absent: 0, overtime: 0 },
    { month: "May", attendance: 0, late: 0, absent: 0, overtime: 0 },
    { month: "Jun", attendance: 0, late: 0, absent: 0, overtime: 0 },
  ]);

  const departmentStats = [
    { name: "IT", employees: 8, attendance: 95, late: 2, absent: 1, value: 95 },
    { name: "HR", employees: 4, attendance: 98, late: 0, absent: 0, value: 98 },
    { name: "Finance", employees: 6, attendance: 90, late: 3, absent: 2, value: 90 },
    { name: "Marketing", employees: 6, attendance: 92, late: 1, absent: 1, value: 92 },
  ];

  // Daily attendance pattern
  const dailyPatternData = [
    { hour: "9 AM", attendance: 85, late: 15 },
    { hour: "10 AM", attendance: 95, late: 5 },
    { hour: "11 AM", attendance: 98, late: 2 },
    { hour: "12 PM", attendance: 92, late: 8 },
    { hour: "1 PM", attendance: 88, late: 12 },
    { hour: "2 PM", attendance: 96, late: 4 },
    { hour: "3 PM", attendance: 94, late: 6 },
    { hour: "4 PM", attendance: 90, late: 10 },
    { hour: "5 PM", attendance: 82, late: 18 },
  ];

  // Attendance distribution
  const attendanceDistribution = [
    { name: "Present", value: 85, color: "#10b981" },
    { name: "Late", value: 8, color: "#f59e0b" },
    { name: "Absent", value: 4, color: "#ef4444" },
    { name: "Leave", value: 3, color: "#3b82f6" },
  ];

  // Overtime comparison
  const overtimeData = [
    { department: "IT", hours: 15 },
    { department: "HR", hours: 8 },
    { department: "Finance", hours: 12 },
    { department: "Marketing", hours: 10 },
  ];

  // Weekly performance
  const weeklyPerformance = [
    { day: "Mon", attendance: 91, target: 95 },
    { day: "Tue", attendance: 93, target: 95 },
    { day: "Wed", attendance: 94, target: 95 },
    { day: "Thu", attendance: 92, target: 95 },
    { day: "Fri", attendance: 90, target: 95 },
    { day: "Sat", attendance: 88, target: 90 },
    { day: "Sun", attendance: 85, target: 85 },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

  const generateReport = () => {
    console.log("Generating report:", {
      reportType,
      dateRange,
      departmentFilter
    });
  };

  const exportReport = async (format) => {
    if (format !== "csv") {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/reports/attendance", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "attendance_report.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV export failed:", err);
    }
  };

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/dashboard/charts/admin", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const mapped = data.attendance?.map(m => ({
          month: months[(Number(m.month) - 1) % 12],
          attendance: Number(m.count),
          late: 0,
          absent: 0,
          overtime: 0
        })) || [];
        setTrendData(mapped.length ? mapped : trendData);
      } catch (err) {
        console.error("Failed to load charts:", err);
      }
    };
    fetchReportData();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${themeClasses.bg.primary} p-3 rounded-lg border ${themeClasses.border.primary}`}>
          <p className={themeClasses.text.primary}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${themeClasses.text.primary}`}>
              Attendance Analytics
            </h1>
            <p className={themeClasses.text.secondary}>
              Comprehensive attendance reports and visual analytics dashboard
            </p>
          </div>
          <FiBarChart2 className="w-12 h-12 text-purple-400/50" />
        </div>
      </div>

      {/* Report Controls */}
      <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary} mb-8`}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Report Type */}
          <div>
            <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className={`w-full px-4 py-3 ${themeClasses.input.bg} border ${themeClasses.input.border} ${themeClasses.input.text} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
            >
              <option value="daily" className={darkMode ? 'bg-gray-900' : 'bg-white'}>Daily Report</option>
              <option value="weekly" className={darkMode ? 'bg-gray-900' : 'bg-white'}>Weekly Summary</option>
              <option value="monthly" className={darkMode ? 'bg-gray-900' : 'bg-white'}>Monthly Report</option>
              <option value="quarterly" className={darkMode ? 'bg-gray-900' : 'bg-white'}>Quarterly Analysis</option>
              <option value="yearly" className={darkMode ? 'bg-gray-900' : 'bg-white'}>Yearly Overview</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className={`w-full px-4 py-3 ${themeClasses.input.bg} border ${themeClasses.input.border} ${themeClasses.input.text} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
              End Date
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className={`w-full px-4 py-3 ${themeClasses.input.bg} border ${themeClasses.input.border} ${themeClasses.input.text} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
            />
          </div>

          {/* Department Filter */}
          <div>
            <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
              Department
            </label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className={`w-full px-4 py-3 ${themeClasses.input.bg} border ${themeClasses.input.border} ${themeClasses.input.text} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
            >
              {departments.map(dept => (
                <option key={dept.id} value={dept.id} className={darkMode ? 'bg-gray-900' : 'bg-white'}>{dept.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={generateReport}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
          >
            <FiFilter className="w-5 h-5" />
            Generate Report
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={() => exportReport("pdf")}
              className={`flex items-center gap-2 px-4 py-3 ${themeClasses.input.bg} border ${themeClasses.input.border} ${themeClasses.text.primary} rounded-lg hover:${darkMode ? 'bg-gray-800' : 'bg-gray-200'} font-medium`}
            >
              <FiDownload className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={() => exportReport("excel")}
              className={`flex items-center gap-2 px-4 py-3 ${themeClasses.input.bg} border ${themeClasses.input.border} ${themeClasses.text.primary} rounded-lg hover:${darkMode ? 'bg-gray-800' : 'bg-gray-200'} font-medium`}
            >
              <FiDownload className="w-4 h-4" />
              Excel
            </button>
            <button
              onClick={() => exportReport("csv")}
              className={`flex items-center gap-2 px-4 py-3 ${themeClasses.input.bg} border ${themeClasses.input.border} ${themeClasses.text.primary} rounded-lg hover:${darkMode ? 'bg-gray-800' : 'bg-gray-200'} font-medium`}
            >
              <FiDownload className="w-4 h-4" />
              CSV
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: "Total Employees", value: reportStats.totalEmployees, icon: FiUsers, color: "purple", trend: "up" },
          { label: "Avg Attendance", value: `${reportStats.averageAttendance}%`, icon: FiTrendingUp, color: "emerald", trend: "up" },
          { label: "Late Arrivals", value: reportStats.totalLateArrivals, icon: FiTrendingDown, color: "amber", trend: "down" },
          { label: "Total Absences", value: reportStats.totalAbsences, icon: FiActivity, color: "rose", trend: "down" },
          { label: "Leave Days", value: reportStats.totalLeaves, icon: FiCalendar, color: "cyan", trend: "neutral" },
          { label: "Overtime Hours", value: `${reportStats.totalOvertime}h`, icon: FiClock, color: "purple", trend: "up" },
        ].map((metric, index) => (
          <div key={index} className={`${themeClasses.bg.secondary} p-5 rounded-xl border ${themeClasses.border.primary}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${metric.color === 'purple' ? 'text-purple-300' : metric.color === 'emerald' ? 'text-emerald-300' : metric.color === 'amber' ? 'text-amber-300' : metric.color === 'rose' ? 'text-rose-300' : 'text-cyan-300'}`}>
                  {metric.label}
                </p>
                <div className="flex items-baseline gap-1">
                  <h3 className={`text-2xl font-bold ${metric.color === 'purple' ? 'text-purple-300' : metric.color === 'emerald' ? 'text-emerald-300' : metric.color === 'amber' ? 'text-amber-300' : metric.color === 'rose' ? 'text-rose-300' : 'text-cyan-300'} mt-1`}>
                    {metric.value}
                  </h3>
                  {metric.trend === 'up' && <FiTrendingUp className={`w-4 h-4 ${metric.color === 'purple' ? 'text-purple-400' : metric.color === 'emerald' ? 'text-emerald-400' : metric.color === 'amber' ? 'text-amber-400' : metric.color === 'rose' ? 'text-rose-400' : 'text-cyan-400'}`} />}
                  {metric.trend === 'down' && <FiTrendingDown className={`w-4 h-4 ${metric.color === 'purple' ? 'text-purple-400' : metric.color === 'emerald' ? 'text-emerald-400' : metric.color === 'amber' ? 'text-amber-400' : metric.color === 'rose' ? 'text-rose-400' : 'text-cyan-400'}`} />}
                </div>
              </div>
              <metric.icon className={`w-8 h-8 ${metric.color === 'purple' ? 'text-purple-400' : metric.color === 'emerald' ? 'text-emerald-400' : metric.color === 'amber' ? 'text-amber-400' : metric.color === 'rose' ? 'text-rose-400' : 'text-cyan-400'}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Trend Chart */}
        <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary}`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Monthly Attendance Trend</h3>
              <p className={themeClasses.text.secondary}>Last 6 months performance</p>
            </div>
            <FiActivity className="w-6 h-6 text-purple-400" />
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                <XAxis dataKey="month" stroke={darkMode ? "#9ca3af" : "#4b5563"} />
                <YAxis stroke={darkMode ? "#9ca3af" : "#4b5563"} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="attendance" 
                  name="Attendance %" 
                  stroke="#10b981" 
                  fill="url(#colorAttendance)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="late" 
                  name="Late Arrivals" 
                  stroke="#f59e0b" 
                  fill="url(#colorLate)" 
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorLate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Distribution */}
        <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary}`}>
          <div className="flex justify-between items-center mb-6">
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
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            {attendanceDistribution.map((item, index) => (
              <div key={index} className={`flex items-center gap-2 p-2 rounded-lg ${themeClasses.bg.tertiary}`}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-300">{item.name}</span>
                <span className="ml-auto text-sm font-medium text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Pattern */}
        <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary}`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Daily Attendance Pattern</h3>
              <p className={themeClasses.text.secondary}>Hourly trends</p>
            </div>
            <FiTarget className="w-6 h-6 text-purple-400" />
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyPatternData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                <XAxis dataKey="hour" stroke={darkMode ? "#9ca3af" : "#4b5563"} />
                <YAxis stroke={darkMode ? "#9ca3af" : "#4b5563"} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="attendance" 
                  name="Attendance %" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="late" 
                  name="Late Arrivals" 
                  fill="#f59e0b" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Comparison */}
        <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary}`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Department Performance</h3>
              <p className={themeClasses.text.secondary}>Attendance rate comparison</p>
            </div>
            <FiAward className="w-6 h-6 text-purple-400" />
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                innerRadius="10%" 
                outerRadius="80%" 
                data={departmentStats} 
                startAngle={180} 
                endAngle={0}
              >
                <RadialBar 
                  minAngle={15} 
                  label={{ fill: darkMode ? '#fff' : '#000', position: 'insideStart' }} 
                  background 
                  dataKey="value" 
                />
                <Legend 
                  iconSize={10} 
                  layout="vertical" 
                  verticalAlign="middle" 
                  wrapperStyle={{ right: 0 }}
                />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weekly Performance */}
      <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary} mb-8`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Weekly Performance vs Target</h3>
            <p className={themeClasses.text.secondary}>Current week attendance vs goals</p>
          </div>
          <FiTarget className="w-6 h-6 text-purple-400" />
        </div>
        
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
              <XAxis dataKey="day" stroke={darkMode ? "#9ca3af" : "#4b5563"} />
              <YAxis stroke={darkMode ? "#9ca3af" : "#4b5563"} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="attendance" 
                name="Actual Attendance" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                name="Target" 
                stroke="#10b981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Performance Table */}
      <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary} mb-8`}>
        <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-6`}>Department Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={themeClasses.bg.tertiary}>
              <tr>
                <th className={`p-4 text-left text-sm font-semibold ${themeClasses.text.secondary}`}>Department</th>
                <th className={`p-4 text-left text-sm font-semibold ${themeClasses.text.secondary}`}>Employees</th>
                <th className={`p-4 text-left text-sm font-semibold ${themeClasses.text.secondary}`}>Attendance Rate</th>
                <th className={`p-4 text-left text-sm font-semibold ${themeClasses.text.secondary}`}>Late Arrivals</th>
                <th className={`p-4 text-left text-sm font-semibold ${themeClasses.text.secondary}`}>Absences</th>
                <th className={`p-4 text-left text-sm font-semibold ${themeClasses.text.secondary}`}>Performance</th>
              </tr>
            </thead>
            <tbody>
              {departmentStats.map((dept, index) => (
                <tr key={index} className={`hover:${themeClasses.bg.tertiary}/50 transition-colors border-t ${themeClasses.border.primary}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-purple-400 flex items-center justify-center text-white font-bold">
                        {dept.name.charAt(0)}
                      </div>
                      <div>
                        <p className={`font-medium ${themeClasses.text.primary}`}>{dept.name} Department</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`font-bold ${themeClasses.text.primary}`}>{dept.employees}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className={`h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-full overflow-hidden`}>
                          <div 
                            className={`h-full rounded-full ${
                              dept.attendance >= 95 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                              dept.attendance >= 90 ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-gradient-to-r from-rose-500 to-rose-400'
                            }`}
                            style={{ width: `${dept.attendance}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className={`font-bold ${themeClasses.text.primary}`}>{dept.attendance}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-amber-400">{dept.late}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-rose-400">{dept.absent}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                      dept.attendance >= 95 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      dept.attendance >= 90 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}>
                      {dept.attendance >= 95 ? 'Excellent' :
                       dept.attendance >= 90 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Performers & Overtime Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Performers */}
        <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Top Performers</h3>
            <FiAward className="w-6 h-6 text-purple-400" />
          </div>
          
          <div className="space-y-4">
            {[
              { name: "Simran Kaur", department: "HR", attendance: 100, perfectMonths: 6, trend: "up" },
              { name: "Rahul Sharma", department: "IT", attendance: 98, perfectMonths: 5, trend: "up" },
              { name: "Priya Patel", department: "IT", attendance: 97, perfectMonths: 4, trend: "stable" },
              { name: "Ankit Mehta", department: "Marketing", attendance: 96, perfectMonths: 3, trend: "up" },
            ].map((emp, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg hover:${themeClasses.bg.tertiary}/50 transition-colors border ${themeClasses.border.primary}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 flex items-center justify-center text-white font-bold">
                    {emp.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className={`font-medium ${themeClasses.text.primary}`}>{emp.name}</p>
                    <p className={themeClasses.text.secondary}>{emp.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-400">{emp.attendance}%</p>
                  <p className={`text-xs ${themeClasses.text.muted}`}>{emp.perfectMonths} perfect months</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overtime Comparison */}
        <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Overtime Hours by Department</h3>
            <FiClock className="w-6 h-6 text-purple-400" />
          </div>
          
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overtimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                <XAxis dataKey="department" stroke={darkMode ? "#9ca3af" : "#4b5563"} />
                <YAxis stroke={darkMode ? "#9ca3af" : "#4b5563"} />
                <Tooltip />
                <Bar 
                  dataKey="hours" 
                  name="Overtime Hours" 
                  fill="#f59e0b" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Reports */}
      <div className="mt-8">
        <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>Quick Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { type: "daily", label: "Daily Report", desc: "Today's attendance", icon: FiCalendar, color: "purple" },
            { type: "weekly", label: "Weekly Summary", desc: "Last 7 days", icon: FiCalendar, color: "purple" },
            { type: "monthly", label: "Monthly Report", desc: "Current month", icon: FiCalendar, color: "purple" },
            { action: "export", label: "Export All", desc: "Complete data", icon: FiDownload, color: "purple" },
          ].map((report, index) => (
            <button
              key={index}
              onClick={() => report.action ? exportReport("excel") : setReportType(report.type)}
              className={`p-4 rounded-lg border ${themeClasses.border.primary} ${themeClasses.bg.tertiary} hover:${darkMode ? 'bg-gray-800' : 'bg-gray-200'} transition-colors text-left`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <report.icon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className={`font-medium ${themeClasses.text.primary}`}>{report.label}</p>
                  <p className={themeClasses.text.secondary}>{report.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceReports;

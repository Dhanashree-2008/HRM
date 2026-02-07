import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUsers, FiCalendar, FiDollarSign, FiTrendingUp, FiTrendingDown, FiBarChart2, FiPieChart, FiActivity, FiDownload } from "react-icons/fi";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { useTheme, getThemeClasses } from "../../../contexts/ThemeContext";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";



const AdminAnalytics = () => {
  const darkMode = useTheme();
  const theme = getThemeClasses(darkMode);
  const [timeRange, setTimeRange] = useState("monthly");
  const [dashboard, setDashboard] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeJobsCount, setActiveJobsCount] = useState(null);
  const [error, setError] = useState(null); 

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Color palette based on theme
  const colors = darkMode ? {
    primary: "#3B82F6", // Blue
    secondary: "#10B981", // Emerald
    tertiary: "#8B5CF6", // Purple
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    background: "#0F172A", // slate-900
    card: "#1E293B", // slate-800
    cardHover: "#334155", // slate-700
    border: "#475569", // slate-600
    text: "#F1F5F9", // slate-100
    textMuted: "#94A3B8", // slate-400
    grid: "#334155" // slate-700
  } : {
    primary: "#3B82F6", // Blue
    secondary: "#10B981", // Emerald
    tertiary: "#8B5CF6", // Purple
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    background: "#F8FAFC", // slate-50
    card: "#FFFFFF", // white
    cardHover: "#F1F5F9", // slate-100
    border: "#E2E8F0", // slate-200
    text: "#0F172A", // slate-900
    textMuted: "#64748B", // slate-500
    grid: "#E2E8F0" // slate-200
  };

  // Attendance data for bar chart (monthly present counts)
  const attendanceData = charts?.attendance || [
    { month: "Jan", present: 95 },
    { month: "Feb", present: 96 },
    { month: "Mar", present: 97 },
    { month: "Apr", present: 94 },
    { month: "May", present: 98 },
    { month: "Jun", present: 30 },
    { month: "Jul", present: 20 }
  ];

  // Department distribution for pie chart (fallback)
  const departmentData = charts?.departments?.map((d, i) => ({ name: d.department || 'Unknown', value: Number(d.count), color: [colors.primary, colors.secondary, colors.warning, colors.tertiary, '#EC4899'][i % 5] })) || [
    { name: "IT", value: 35, color: colors.primary },
    { name: "HR", value: 20, color: colors.secondary },
    { name: "Finance", value: 18, color: colors.warning },
    { name: "Marketing", value: 15, color: colors.tertiary },
    { name: "Operations", value: 12, color: "#EC4899" }
  ];

  // Hiring trends for area chart
  const hiringData = charts?.hiring || [
    { month: "Jan", hired: 8, resigned: 2 },
    { month: "Feb", hired: 12, resigned: 1 },
    { month: "Mar", hired: 10, resigned: 3 },
    { month: "Apr", hired: 15, resigned: 2 },
    { month: "May", hired: 8, resigned: 4 },
    { month: "Jun", hired: 14, resigned: 1 },
    { month: "Jul", hired: 12, resigned: 3 }
  ];



  // Leave statistics
  const leaveData = charts?.leaveStats?.map((l, i) => ({
    ...l,
    color: [colors.success, colors.warning, colors.danger, colors.primary][i % 4]
  })) || [
      { type: "Approved", value: 42, color: colors.success },
      { type: "Pending", value: 8, color: colors.warning },
      { type: "Rejected", value: 3, color: colors.danger }
    ];

  // Custom tooltip for charts with theme support
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} p-3 border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg shadow-lg`}>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>{label}</p>
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

  // Chart styling based on theme
  const chartTheme = {
    backgroundColor: colors.card,
    textColor: colors.textMuted,
    gridColor: colors.grid,
    axisColor: colors.textMuted
  };

  const cardBg = darkMode ? 'bg-slate-800' : 'bg-white';
  const cardBorder = darkMode ? 'border-slate-700' : 'border-gray-200';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const inputBg = darkMode ? 'bg-slate-800' : 'bg-gray-50';
  const inputBorder = darkMode ? 'border-slate-700' : 'border-gray-300';
  const hoverBg = darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-50';

  const handleExportPDF = async () => {
      try {
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });
  
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        let yPosition = 15;
  
        // Add title
        pdf.setFontSize(20);
        pdf.text("Admin Dashboard Report", pageWidth / 2, yPosition, {
          align: "center",
        });
        yPosition += 12;
  
        // Add timestamp
        pdf.setFontSize(10);
        pdf.text(
          `Generated on: ${new Date().toLocaleString()}`,
          pageWidth / 2,
          yPosition,
          { align: "center" },
        );
        yPosition += 8;
  
        // Add stats summary
        pdf.setFontSize(12);
        pdf.text("Key Metrics Summary", 15, yPosition);
        yPosition += 8;
  
        pdf.setFontSize(10);
        const stats = [
          `Total Employees: ${dashboard?.totalEmployees || "—"}`,
          `Active Users: ${dashboard?.totalActiveUsers || "—"}`,
          `Today's Attendance: ${dashboard?.presentToday || "—"} (${dashboard?.totalEmployees ? ((dashboard.presentToday / dashboard.totalEmployees) * 100).toFixed(1) : "—"}%)`,
          `Pending Leaves: ${dashboard?.pendingLeaves || "—"}`,
          `On Leave Today: ${dashboard?.onLeaveToday || "—"}`,
          `Departments: ${charts?.departments?.length || "—"}`,
          `Active Jobs: ${activeJobsCount || "—"}`,
        ];
  
        stats.forEach((stat) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 15;
          }
          pdf.text(stat, 15, yPosition);
          yPosition += 6;
        });
  
        yPosition += 4;
  
        // Add Department Data Table
        if (charts?.departments && charts.departments.length > 0) {
          if (yPosition > pageHeight - 40) {
            pdf.addPage();
            yPosition = 15;
          }
  
          pdf.setFontSize(12);
          pdf.text("Department Overview", 15, yPosition);
          yPosition += 8;
  
          pdf.setFontSize(9);
          const deptTableData = [
            ["Department", "Employee Count"],
            ...charts.departments.map((d) => [
              d.department || "N/A",
              String(d.count || 0),
            ]),
          ];
  
          autoTable(pdf, {
            head: [deptTableData[0]],
            body: deptTableData.slice(1),
            startY: yPosition,
            margin: { left: 15, right: 15 },
            theme: "grid",
            headStyles: {
              fillColor: [139, 92, 246],
              textColor: 255,
              fontStyle: "bold",
            },
            bodyStyles: {
              textColor: darkMode ? 255 : 0,
            },
            alternateRowStyles: {
              fillColor: darkMode ? [45, 45, 60] : [240, 240, 245],
            },
          });
  
          yPosition = pdf.internal.pageSize.getHeight() - 20;
        }
  
        // Add Attendance Data
        if (charts?.attendance && charts.attendance.length > 0) {
          if (yPosition > pageHeight - 40) {
            pdf.addPage();
            yPosition = 15;
          }
  
          pdf.setFontSize(12);
          pdf.text("Monthly Attendance Summary", 15, yPosition);
          yPosition += 8;
  
          pdf.setFontSize(9);
          const attendanceTableData = [
            ["Month", "Present Count"],
            ...charts.attendance.map((a) => [
              monthNames[(Number(a.month) - 1) % 12] || "N/A",
              String(a.count || 0),
            ]),
          ];
  
          autoTable(pdf,{
            head: [attendanceTableData[0]],
            body: attendanceTableData.slice(1),
            startY: yPosition,
            margin: { left: 15, right: 15 },
            theme: "grid",
            headStyles: {
              fillColor: [139, 92, 246],
              textColor: 255,
              fontStyle: "bold",
            },
            bodyStyles: {
              textColor: darkMode ? 255 : 0,
            },
            alternateRowStyles: {
              fillColor: darkMode ? [45, 45, 60] : [240, 240, 245],
            },
          });
  
          yPosition = pdf.internal.pageSize.getHeight() - 20;
        }
  
        // Add Leave Data
        if (charts?.leaves && charts.leaves.length > 0) {
          if (yPosition > pageHeight - 40) {
            pdf.addPage();
            yPosition = 15;
          }
  
          pdf.setFontSize(12);
          pdf.text("Leave Request Summary", 15, yPosition);
          yPosition += 8;
  
          pdf.setFontSize(9);
          const leaveTableData = [
            ["Leave Type", "Count"],
            ...charts.leaves.map((l) => [l.type || "N/A", String(l.count || 0)]),
          ];
  
          autoTable(pdf,{
            head: [leaveTableData[0]],
            body: leaveTableData.slice(1),
            startY: yPosition,
            margin: { left: 15, right: 15 },
            theme: "grid",
            headStyles: {
              fillColor: [139, 92, 246],
              textColor: 255,
              fontStyle: "bold",
            },
            bodyStyles: {
              textColor: darkMode ? 255 : 0,
            },
            alternateRowStyles: {
              fillColor: darkMode ? [45, 45, 60] : [240, 240, 245],
            },
          });
        }
  
        // Add recent activities
        if (dashboard?.recentWorklogs && dashboard.recentWorklogs.length > 0) {
          pdf.addPage();
          yPosition = 15;
  
          pdf.setFontSize(12);
          pdf.text("Recent Activities", 15, yPosition);
          yPosition += 8;
  
          pdf.setFontSize(9);
          const activitiesTableData = [
            ["Employee", "Action", "Date"],
            ...dashboard.recentWorklogs
              .slice(0, 10)
              .map((w) => [
                w.employee?.fullName || "Unknown",
                w.description || "Activity",
                w.date || "N/A",
              ]),
          ];
  
          autoTable(pdf, {
            head: [activitiesTableData[0]],
            body: activitiesTableData.slice(1),
            startY: yPosition,
            margin: { left: 15, right: 15 },
            theme: "grid",
            headStyles: {
              fillColor: [139, 92, 246],
              textColor: 255,
              fontStyle: "bold",
            },
            bodyStyles: {
              textColor: darkMode ? 255 : 0,
            },
            alternateRowStyles: {
              fillColor: darkMode ? [45, 45, 60] : [240, 240, 245],
            },
          });
        }
  
        // Save the PDF
        const fileName = `Admin_Dashboard_Report_${new Date().getTime()}.pdf`;
        pdf.save(fileName);
      } catch (err) {
        console.error("Error generating PDF:", err);
        alert("Failed to generate PDF. Please try again.");
      }
    };

  // Fetch dashboard & charts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      try {
        const [dashRes, chartsRes] = await Promise.all([
          axios.get('/api/dashboard/admin', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/dashboard/charts/admin', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setDashboard(dashRes.data);
        // Convert charts data into usable structures
        const chartData = {
          // Map monthly attendance
          attendance: chartsRes.data.attendance?.map((r) => ({
            month: monthNames[(Number(r.month) - 1) % 12] || 'N',
            present: Number(r.count)
          })) || null,

          departments: chartsRes.data.departments || null,

          // Map hiring trends (from hiring service)
          hiring: chartsRes.data.hiring?.map((r) => ({
            month: monthNames[(Number(r.month) - 1) % 12] || 'N',
            hired: Number(r.count),
            resigned: 0 // We assume 0 for now as we didn't impl resigned yet
          })) || null,

          // Map leave stats (from leaveStats service)
          leaveStats: chartsRes.data.leaveStats?.map(l => ({
            type: l.type,
            value: l.count,
            color: colors.success // Logic to assign colors could be improved
          })) || null,

          // Performance from explicit service
          performance: chartsRes.data.performance?.map((p, i) => ({
            month: monthNames[i % 12], // Assuming ordered 1-12 or similar
            attendance: p.attendance,
            productivity: p.productivity,
            quality: p.quality
          })) || null,

          overtime: chartsRes.data.overtime || [],
          training: chartsRes.data.training || null
        };
        setCharts(chartData);
      } catch (err) {
        console.error('Failed to load analytics:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [darkMode]); // Add darkMode dependency if colors needed inside (colors is outside though, but let's stick to empty array or minimal deps)
  // Actually colors is used in mapping leaveStats? Yes.
  // Ideally mapping should happen in render or colors passed.
  // I will remove colors dependency in useEffect and map in render if possible, OR just use constants.
  // But wait, `colors` changes with `darkMode`. 
  // Code structure: `colors` is defined at top of component.
  // If I put mapping in useEffect, I need to depend on `colors` (and thus `darkMode`).
  // Better to store RAW data in state and map in render. 
  // BUT the existing code mapped in useEffect. I will map in render to avoid deep dependency chain issues.
  // Actually, I'll modify the state to store RAW response mostly, and map in render.

  /*
    Wait, the previous code mapped in useEffect:
    `const chartData = { attendance: ... }`
    I will stick to that to minimize diff, but add `colors` to dep array or just map colors in render.
    Mapping `color` in `useEffect` is bad practice if theme changes.
    I'll just map values in `useEffect` and handle colors in render.
  */

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          {loading && (
            <div className="text-sm text-gray-400">Loading analytics...</div>
          )}
          {error && (
            <div className="text-sm text-rose-500">Error loading analytics: {error}</div>
          )}
          <div>
            <h1 className={`text-3xl font-bold ${textPrimary}`}>
              Analytics Dashboard
            </h1>
            <p className={textSecondary}>
              Comprehensive insights into employee performance and organizational metrics
            </p>
          </div>
          <div className="flex gap-3">
            <select
              className={`px-4 py-2.5 ${inputBg} border ${inputBorder} ${textPrimary} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="quarterly">This Quarter</option>
              <option value="yearly">This Year</option>
            </select>
            <button onClick={handleExportPDF} className={`flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors`}>
              <FiDownload className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Employees */}
        <div className={`${cardBg} rounded-xl p-6 border ${cardBorder} shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${textSecondary}`}>Total Employees</p>
              <h3 className={`text-2xl font-bold ${textPrimary} mt-2`}>{dashboard ? dashboard.totalEmployees : '—'}</h3>
              <div className="flex items-center gap-2 mt-2">
                <FiTrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500">{dashboard ? `Active users: ${dashboard.totalActiveUsers}` : '—'}</span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'} flex items-center justify-center`}>
              <FiUsers className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
          </div>
        </div>

        {/* Avg. Attendance */}
        <div className={`${cardBg} rounded-xl p-6 border ${cardBorder} shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${textSecondary}`}>Avg. Attendance</p>
              <h3 className={`text-2xl font-bold ${textPrimary} mt-2`}>{dashboard ? `${((dashboard.presentToday / dashboard.totalEmployees) * 100).toFixed(1)}%` : '—'}</h3>
              <div className="flex items-center gap-2 mt-2">
                <FiTrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500">Present today: {dashboard ? dashboard.presentToday : '—'}</span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-lg ${darkMode ? 'bg-green-900/30' : 'bg-green-100'} flex items-center justify-center`}>
              <FiCalendar className={`w-6 h-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
          </div>
        </div>

        {/* Monthly Turnover */}
        <div className={`${cardBg} rounded-xl p-6 border ${cardBorder} shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${textSecondary}`}>Monthly Turnover</p>
              <h3 className={`text-2xl font-bold ${textPrimary} mt-2`}>{dashboard ? `${dashboard.onLeaveToday || 0}` : '—'}</h3>
              <div className="flex items-center gap-2 mt-2">
                <FiTrendingDown className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-500">On leave today</span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-lg ${darkMode ? 'bg-amber-900/30' : 'bg-amber-100'} flex items-center justify-center`}>
              <FiActivity className={`w-6 h-6 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
            </div>
          </div>
        </div>

        {/* Avg. Performance */}
        <div className={`${cardBg} rounded-xl p-6 border ${cardBorder} shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${textSecondary}`}>Avg. Performance</p>
              <h3 className={`text-2xl font-bold ${textPrimary} mt-2`}>{dashboard ? `${(dashboard.avgPerformance || 4.2).toFixed(1)}/5.0` : '—'}</h3>
              <div className="flex items-center gap-2 mt-2">
                <FiTrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500">{dashboard ? `Avg performance: ${(dashboard.avgPerformance || 4.2).toFixed(1)}` : '—'}</span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-lg ${darkMode ? 'bg-purple-900/30' : 'bg-purple-100'} flex items-center justify-center`}>
              <FiBarChart2 className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Attendance Chart - Bar Chart */}
        <div className={`${cardBg} rounded-xl p-6 border ${cardBorder} shadow-sm`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-lg font-semibold ${textPrimary}`}>Weekly Attendance</h3>
            <button className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>View Details</button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart
                data={attendanceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
                <XAxis
                  dataKey="month"
                  stroke={chartTheme.axisColor}
                  tick={{ fill: chartTheme.textColor }}
                />
                <YAxis
                  stroke={chartTheme.axisColor}
                  tick={{ fill: chartTheme.textColor }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  contentStyle={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                />
                <Legend />
                <Bar
                  dataKey="present"
                  name="Present"
                  fill={colors.primary}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution - Pie Chart */}
        <div className={`${cardBg} rounded-xl p-6 border ${cardBorder} shadow-sm`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-lg font-semibold ${textPrimary}`}>Department Distribution</h3>
            <button className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>View Details</button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Percentage']}
                  contentStyle={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Hiring Trends */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* Hiring Trends - Area Chart */}
        <div className={`${cardBg} rounded-xl p-6 border ${cardBorder} shadow-sm`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-lg font-semibold ${textPrimary}`}>Hiring Trends</h3>
            <button className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>View Details</button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart
                data={hiringData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
                <XAxis
                  dataKey="month"
                  stroke={chartTheme.axisColor}
                  tick={{ fill: chartTheme.textColor }}
                />
                <YAxis
                  stroke={chartTheme.axisColor}
                  tick={{ fill: chartTheme.textColor }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  contentStyle={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="hired"
                  name="Hired"
                  stroke={colors.success}
                  fill={colors.success}
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="resigned"
                  name="Resigned"
                  stroke={colors.danger}
                  fill={colors.danger}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Leave Statistics */}
        <div className={`${cardBg} rounded-xl p-6 border ${cardBorder} shadow-sm`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'} flex items-center justify-center`}>
              <FiCalendar className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <h3 className={`font-semibold ${textPrimary}`}>Leave Statistics</h3>
              <p className={`text-sm ${textSecondary}`}>This month</p>
            </div>
          </div>

          <div className="space-y-3">
            {(charts?.leaves ? charts.leaves : leaveData).map((item, idx) => (
              <div key={idx} className={`flex justify-between items-center p-3 ${darkMode ? 'bg-slate-900/50' : 'bg-gray-50'} rounded-lg`}>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color || (idx === 0 ? colors.success : idx === 1 ? colors.warning : colors.danger) }}></div>
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.type || `Month ${item.month}`}</span>
                </div>
                <span className="font-bold" style={{ color: item.color || '#111' }}>{item.value || item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Overtime Hours */}
        <div className={`${cardBg} rounded-xl p-6 border ${cardBorder} shadow-sm`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-lg ${darkMode ? 'bg-green-900/30' : 'bg-green-100'} flex items-center justify-center`}>
              <FiActivity className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <div>
              <h3 className={`font-semibold ${textPrimary}`}>Overtime Hours</h3>
              <p className={`text-sm ${textSecondary}`}>This month (proxy)</p>
            </div>
          </div>

          {charts?.overtime ? (
            <div className="text-center">
              <div className={`text-3xl font-bold ${textPrimary} mb-2`}>
                {charts.overtime.reduce((acc, curr) => acc + curr.hours, 0)}
              </div>
              <p className={`${textSecondary} mb-4`}>Total hours</p>
              <div>
                {charts.overtime.slice(0, 3).map((dept, i) => (
                  <div key={i} className={`flex justify-between text-sm ${textSecondary} mb-1`}>
                    <span>{dept.department}</span>
                    <span>{dept.hours} hrs</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className={textSecondary}>No overtime data</p>
          )}
        </div>


      </div>

      {/* Recent Worklogs */}
      <div className={`${cardBg} rounded-xl p-6 border ${cardBorder} shadow-sm mb-8`}>
        <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>Recent Worklogs</h3>
        {dashboard?.recentWorklogs && dashboard.recentWorklogs.length > 0 ? (
          <div className="space-y-3">
            {dashboard.recentWorklogs.map((w) => (
              <div key={w.id} className={`p-3 rounded ${darkMode ? 'bg-slate-900/50' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className={`font-semibold ${textPrimary}`}>{w.employee?.fullName || 'Unknown'}</div>
                    <div className={`text-sm ${textSecondary}`}>{w.description}</div>
                  </div>
                  <div className="text-sm text-gray-500">{new Date(w.date).toLocaleDateString()} • {w.hoursWorked} hrs</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={textSecondary}>No recent worklogs found</p>
        )}
      </div>

    </div>
  );
};

export default AdminAnalytics;
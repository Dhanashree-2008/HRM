import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiBriefcase,
  FiCheckCircle,
  FiAlertCircle,
  FiDownload,
  FiActivity,
  FiPieChart,
  FiBarChart2,
} from "react-icons/fi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";
import { useTheme, useThemeClasses } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const AdminHome = () => {
  const darkMode = useTheme() || false;
  const theme = useThemeClasses();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [charts, setCharts] = useState(null);
  const [activeJobsCount, setActiveJobsCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const departmentChartRef = useRef(null);
  const attendanceChartRef = useRef(null);
  const employeeDistributionRef = useRef(null);
  const leaveStatisticsRef = useRef(null);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

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
  const colors = {
    primary: "#8B5CF6", // Purple
    secondary: "#10B981", // Emerald (kept for contrast)
    tertiary: "#3B82F6", // Blue (kept for charts)
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    cardBg: darkMode ? "#1E293B" : "#FFFFFF",
    border: darkMode ? "#374151" : "#E5E7EB",
    text: darkMode ? "#F9FAFB" : "#111827",
    textMuted: darkMode ? "#9CA3AF" : "#6B7280",
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      try {
        const [dashRes, chartsRes, jobsRes] = await Promise.all([
          axios.get("/api/dashboard/admin", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/dashboard/charts/admin", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/jobs", {
            headers: { Authorization: `Bearer ${token}` },
            params: { status: "Active" },
          }),
        ]);

        setDashboard(dashRes.data);
        setCharts(chartsRes.data);
        setActiveJobsCount(
          Array.isArray(jobsRes.data) ? jobsRes.data.length : 0,
        );
      } catch (err) {
        console.error("Failed to load admin dashboard:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load dashboard",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center h-64 ${theme.text.primary}`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`p-4 rounded-lg ${theme.bg.secondary} border ${theme.border.primary}`}
      >
        <p className={theme.text.secondary}>{error}</p>
      </div>
    );
  }

  const stats = [
    {
      icon: <FiUsers className="w-6 h-6" />,
      label: "Total Employees",
      value: dashboard ? String(dashboard.totalEmployees) : "—",
      change: dashboard ? `Active: ${dashboard.totalActiveUsers}` : "+12%",
      trend: "up",
      color: darkMode
        ? "bg-purple-500/20 text-purple-400"
        : "bg-purple-100 text-purple-700",
    },
    {
      icon: <FiCalendar className="w-6 h-6" />,
      label: "Today's Attendance",
      value: dashboard ? String(dashboard.presentToday) : "—",
      change:
        dashboard && dashboard.totalEmployees
          ? `${((dashboard.presentToday / dashboard.totalEmployees) * 100).toFixed(1)}%`
          : "—",
      trend: "up",
      color: darkMode
        ? "bg-emerald-500/20 text-emerald-400"
        : "bg-emerald-100 text-emerald-700",
    },
    {
      icon: <HiOutlineOfficeBuilding className="w-6 h-6" />,
      label: "Departments",
      value: charts?.departments ? String(charts.departments.length) : "—",
      change: charts?.departments
        ? `Total: ${charts.departments.length}`
        : "+1",
      trend: "up",
      color: darkMode
        ? "bg-purple-500/20 text-purple-400"
        : "bg-purple-100 text-purple-700",
    },
    {
      icon: <FiBriefcase className="w-6 h-6" />,
      label: "Active Jobs",
      value: activeJobsCount !== null ? String(activeJobsCount) : "—",
      change: activeJobsCount !== null ? `${activeJobsCount} active` : "—",
      trend: "up",
      color: darkMode
        ? "bg-amber-500/20 text-amber-400"
        : "bg-amber-100 text-amber-700",
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      label: "Pending Leaves",
      value: dashboard ? String(dashboard.pendingLeaves) : "—",
      change: dashboard ? `On leave: ${dashboard.onLeaveToday}` : "3 Today",
      trend: "down",
      color: darkMode
        ? "bg-rose-500/20 text-rose-400"
        : "bg-rose-100 text-rose-700",
    },
  ];

  // Department performance data for chart (from backend departments counts)
  const departmentData = charts?.departments?.map((d, i) => ({
    name: d.department || `Dept ${i + 1}`,
    attendance: 95, // placeholder - could be refined later with real attendance per dept
    productivity: 90, // placeholder
    employees: d.count || 0,
  })) || [
    { name: "IT", attendance: 97, productivity: 92, employees: 35 },
    { name: "HR", attendance: 95, productivity: 88, employees: 20 },
    { name: "Finance", attendance: 96, productivity: 90, employees: 18 },
    { name: "Marketing", attendance: 94, productivity: 85, employees: 15 },
    { name: "Operations", attendance: 93, productivity: 87, employees: 12 },
  ];

  // Attendance trend data for line chart (mapped from monthly attendance)
  const attendanceTrendData = charts?.attendance?.map((r) => ({
    day: monthNames[(Number(r.month) - 1) % 12] || "N",
    present: Number(r.count),
    late: 0,
  })) || [
    { day: "Mon", present: 95, late: 8 },
    { day: "Tue", present: 96, late: 6 },
    { day: "Wed", present: 97, late: 5 },
    { day: "Thu", present: 94, late: 10 },
    { day: "Fri", present: 98, late: 4 },
    { day: "Sat", present: 30, late: 2 },
    { day: "Sun", present: 20, late: 1 },
  ];

  // Employee distribution data for pie chart (derived from departments counts)
  const employeeDistributionData = charts?.departments?.map((d, i) => ({
    name: d.department || `Dept ${i + 1}`,
    value: d.count || 0,
    color: [
      colors.primary,
      colors.secondary,
      colors.warning,
      colors.tertiary,
      "#EC4899",
    ][i % 5],
  })) || [
    { name: "Full-time", value: 120, color: colors.primary }, // Purple
    { name: "Part-time", value: 18, color: "#10B981" }, // Emerald
    { name: "Contract", value: 8, color: "#F59E0B" }, // Amber
    { name: "Interns", value: 4, color: "#3B82F6" }, // Blue
  ];

  // Leave statistics data (summary from charts + dashboard)
  const totalLeavesThisYear = charts?.leaves
    ? charts.leaves.reduce((s, r) => s + Number(r.count), 0)
    : null;
  const leaveData = charts?.leaves
    ? [
        {
          type: "Approved (year)",
          count: totalLeavesThisYear || 0,
          color: colors.primary,
        },
        {
          type: "Pending",
          count: dashboard ? dashboard.pendingLeaves : 0,
          color: "#10B981",
        },
        {
          type: "On Leave Today",
          count: dashboard ? dashboard.onLeaveToday : 0,
          color: "#F59E0B",
        },
      ]
    : [
        { type: "Sick Leave", count: 24, color: colors.primary }, // Purple
        { type: "Casual Leave", count: 18, color: "#10B981" }, // Emerald
        { type: "Earned Leave", count: 32, color: "#F59E0B" }, // Amber
        { type: "Maternity", count: 3, color: "#3B82F6" }, // Blue
      ];

  const attendanceRate =
    dashboard && dashboard.totalEmployees
      ? (dashboard.presentToday / dashboard.totalEmployees) * 100
      : null;

  const avgRating = dashboard ? dashboard.avgPerformance : null;

  // Upcoming events
  const upcomingEvents = [
    { title: "Team Meeting", time: "Today, 3:00 PM", type: "meeting" },
    { title: "Payroll Processing", time: "Tomorrow", type: "payroll" },
    { title: "Performance Reviews", time: "Next Week", type: "review" },
    { title: "Company Holiday", time: "25th Dec", type: "holiday" },
  ];

  // Recent activities (mapped from recent worklogs)
  const recentActivities = dashboard?.recentWorklogs?.map((w) => ({
    user: w.employee?.fullName || "Unknown",
    action: w.description || "submitted worklog",
    time: w.date || "",
    status: "success",
  })) || [
    {
      user: "Rahul Sharma",
      action: "checked in",
      time: "9:15 AM",
      status: "success",
    },
    {
      user: "Priya Patel",
      action: "applied for leave",
      time: "10:30 AM",
      status: "warning",
    },
    {
      user: "Simran Kaur",
      action: "approved leave",
      time: "11:45 AM",
      status: "success",
    },
    {
      user: "Ankit Mehta",
      action: "submitted report",
      time: "1:20 PM",
      status: "success",
    },
    {
      user: "System",
      action: "backup completed",
      time: "2:00 AM",
      status: "info",
    },
    {
      user: "Ravi Kumar",
      action: "updated profile",
      time: "3:45 PM",
      status: "success",
    },
    {
      user: "Sneha Verma",
      action: "requested equipment",
      time: "4:20 PM",
      status: "warning",
    },
    {
      user: "Vikram Singh",
      action: "completed training",
      time: "5:00 PM",
      status: "success",
    },
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`${darkMode ? "bg-gray-800" : "bg-white"} p-3 border ${darkMode ? "border-gray-700" : "border-gray-300"} rounded-lg shadow-lg`}
        >
          <p
            className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-900"}`}
          >
            {label}
          </p>
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

  const getTrendIcon = (trend) => {
    if (trend === "up")
      return (
        <FiTrendingUp className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
      );
    if (trend === "down")
      return (
        <div className="w-4 h-4 text-rose-500 dark:text-rose-400 rotate-90">
          ↓
        </div>
      );
    return <div className="w-4 h-0.5 bg-gray-400"></div>;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return (
          <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></div>
        );
      case "warning":
        return (
          <div className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse"></div>
        );
      case "info":
        return (
          <div className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse"></div>
        );
      default:
        return <div className="w-2 h-2 rounded-full bg-gray-400"></div>;
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case "meeting":
        return darkMode
          ? "bg-purple-500/20 text-purple-400"
          : "bg-purple-100 text-purple-700";
      case "payroll":
        return darkMode
          ? "bg-emerald-500/20 text-emerald-400"
          : "bg-emerald-100 text-emerald-700";
      case "review":
        return darkMode
          ? "bg-purple-500/20 text-purple-400"
          : "bg-purple-100 text-purple-700";
      case "holiday":
        return darkMode
          ? "bg-amber-500/20 text-amber-400"
          : "bg-amber-100 text-amber-700";
      default:
        return darkMode
          ? "bg-gray-500/20 text-gray-400"
          : "bg-gray-100 text-gray-700";
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case "meeting":
        return <FiUsers className="w-5 h-5" />;
      case "payroll":
        return <FiDollarSign className="w-5 h-5" />;
      case "review":
        return <FiTrendingUp className="w-5 h-5" />;
      case "holiday":
        return <FiCalendar className="w-5 h-5" />;
      default:
        return <FiCalendar className="w-5 h-5" />;
    }
  };

  return (
    <>
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${theme.text.primary}`}>
              Welcome back, Admin!
            </h1>
            <p className={theme.text.secondary}>
              Here's what's happening with your organization today.
            </p>
          </div>
          <div className="flex gap-3">
            <select
              className={`px-4 py-2.5 ${theme.input.bg} border ${theme.input.border} ${theme.input.text} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              <FiDownload className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${theme.bg.secondary} rounded-xl p-4 border ${theme.border.primary} shadow-sm`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}
                >
                  {stat.icon}
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(stat.trend)}
                  <span
                    className={`text-sm font-medium ${
                      stat.trend === "up"
                        ? "text-emerald-500 dark:text-emerald-400"
                        : stat.trend === "down"
                          ? "text-rose-500 dark:text-rose-400"
                          : theme.text.muted
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <h3 className={`text-2xl font-bold ${theme.text.primary}`}>
                {stat.value}
              </h3>
              <p className={`text-sm ${theme.text.secondary}`}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Department Performance - Bar Chart */}
        <div
          className={`${theme.bg.secondary} rounded-xl p-6 border ${theme.border.primary} shadow-sm`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-lg font-semibold ${theme.text.primary}`}>
              Department Performance
            </h2>
            <button className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
              View Details
            </button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={departmentData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#374151" : "#E5E7EB"}
                />
                <XAxis
                  dataKey="name"
                  stroke={darkMode ? "#9CA3AF" : "#6B7280"}
                />
                <YAxis stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="attendance"
                  name="Attendance (%)"
                  fill={colors.primary}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="productivity"
                  name="Productivity (%)"
                  fill={colors.secondary}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="employees"
                  name="Employees"
                  stroke={colors.warning}
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Trends - Line Chart */}
        <div
          className={`${theme.bg.secondary} rounded-xl p-6 border ${theme.border.primary} shadow-sm`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-lg font-semibold ${theme.text.primary}`}>
              Monthly Attendance Trends
            </h2>
            <button className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
              View Details
            </button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrendData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#374151" : "#E5E7EB"}
                />
                <XAxis
                  dataKey="day"
                  stroke={darkMode ? "#9CA3AF" : "#6B7280"}
                />
                <YAxis stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="present"
                  name="Present (%)"
                  stroke={colors.primary}
                  fill={colors.primary}
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="late"
                  name="Late Arrivals"
                  stroke={colors.warning}
                  fill={colors.warning}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Second Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Employee Distribution - Pie Chart */}
        <div
          className={`${theme.bg.secondary} rounded-xl p-6 border ${theme.border.primary} shadow-sm`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-lg font-semibold ${theme.text.primary}`}>
              Employee Distribution
            </h2>
            <button className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
              View Details
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={employeeDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {employeeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} employees`, "Count"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leave Statistics - Bar Chart */}
        <div
          className={`${theme.bg.secondary} rounded-xl p-6 border ${theme.border.primary} shadow-sm`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-lg font-semibold ${theme.text.primary}`}>
              Leave Statistics
            </h2>
            <button className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
              View Details
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leaveData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#374151" : "#E5E7EB"}
                />
                <XAxis
                  dataKey="type"
                  stroke={darkMode ? "#9CA3AF" : "#6B7280"}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Leave Count" radius={[4, 4, 0, 0]}>
                  {leaveData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Events */}
        {/* <div className={`${theme.bg.secondary} rounded-xl p-6 border ${theme.border.primary} shadow-sm`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-lg font-semibold ${theme.text.primary}`}>Upcoming Events</h2>
            <button className="text-sm text-purple-600 dark:text-purple-400 hover:underline">View All</button>
          </div>
          
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className={`flex items-start gap-3 p-3 ${darkMode ? 'bg-gray-900/50 hover:bg-gray-900' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getEventColor(event.type)}`}>
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${theme.text.primary}`}>{event.title}</p>
                  <p className={`text-sm ${theme.text.secondary}`}>{event.time}</p>
                </div>
              </div>
            ))}
          </div>


          <div className={`mt-6 pt-6 border-t ${theme.border.primary}`}>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${theme.text.primary}`}>
                  {attendanceRate !== null ? `${attendanceRate.toFixed(1)}%` : "—"}
                </div>
                <div className={`text-sm ${theme.text.secondary}`}>Avg. Attendance</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${theme.text.primary}`}>
                  {avgRating !== null ? avgRating.toFixed(2) : "—"}
                </div>
                <div className={`text-sm ${theme.text.secondary}`}>Avg. Rating</div>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* <div className={`${theme.bg.secondary} rounded-xl p-6 border ${theme.border.primary} shadow-sm`}>
          <h2 className={`text-lg font-semibold ${theme.text.primary} mb-6`}>System Status</h2>
          
          <div className="space-y-4">
            <div className={`flex items-center justify-between p-3 ${darkMode ? 'bg-gray-900/50' : 'bg-gray-100'} rounded-lg`}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <div>
                  <div className={`text-sm ${theme.text.primary}`}>Database</div>
                  <div className={`text-xs ${theme.text.secondary}`}>System service</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Online</div>
                <div className={`text-xs ${theme.text.secondary}`}>100%</div>
              </div>
            </div>
            
            <div className={`flex items-center justify-between p-3 ${darkMode ? 'bg-gray-900/50' : 'bg-gray-100'} rounded-lg`}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <div>
                  <div className={`text-sm ${theme.text.primary}`}>API Services</div>
                  <div className={`text-xs ${theme.text.secondary}`}>System service</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Online</div>
                <div className={`text-xs ${theme.text.secondary}`}>95%</div>
              </div>
            </div>
            
            <div className={`flex items-center justify-between p-3 ${darkMode ? 'bg-gray-900/50' : 'bg-gray-100'} rounded-lg`}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                <div>
                  <div className={`text-sm ${theme.text.primary}`}>Storage</div>
                  <div className={`text-xs ${theme.text.secondary}`}>System service</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-amber-600 dark:text-amber-400">Optimal</div>
                <div className={`text-xs ${theme.text.secondary}`}>65% Used</div>
              </div>
            </div>
            
            <div className={`flex items-center justify-between p-3 ${darkMode ? 'bg-gray-900/50' : 'bg-gray-100'} rounded-lg`}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                <div>
                  <div className={`text-sm ${theme.text.primary}`}>Backup</div>
                  <div className={`text-xs ${theme.text.secondary}`}>System service</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-purple-600 dark:text-purple-400">Synchronized</div>
                <div className={`text-xs ${theme.text.secondary}`}>Last: 2:00 AM</div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className={`flex justify-between text-sm ${theme.text.primary} mb-2`}>
              <span>System Health</span>
              <span>92%</span>
            </div>
            <div className={`h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-purple-500 rounded-full"
                style={{ width: "92%" }}
              ></div>
            </div>
          </div>
        </div> */}

        <div
          className={`${theme.bg.secondary} rounded-xl p-6 border ${theme.border.primary} shadow-sm`}
        >
          <h2 className={`text-lg font-semibold ${theme.text.primary} mb-6`}>
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <button
              className={`flex flex-col items-center justify-center p-4 ${darkMode ? "bg-purple-500/10 hover:bg-purple-500/20" : "bg-purple-50 hover:bg-purple-100"} rounded-lg border ${darkMode ? "border-purple-500/30" : "border-purple-200"} transition-colors`}
              onClick={() => navigate("/admin/employees/add")}
            >
              <div
                className={`w-10 h-10 rounded-lg ${darkMode ? "bg-purple-500/20" : "bg-purple-100"} flex items-center justify-center text-purple-600 dark:text-purple-400 mb-2`}
              >
                <FiUsers className="w-5 h-5" />
              </div>
              <span className={`text-sm font-medium ${theme.text.primary}`}>
                Add Employee
              </span>
            </button>

            <button
              className={`flex flex-col items-center justify-center p-4 ${darkMode ? "bg-emerald-500/10 hover:bg-emerald-500/20" : "bg-emerald-50 hover:bg-emerald-100"} rounded-lg border ${darkMode ? "border-emerald-500/30" : "border-emerald-200"} transition-colors`}
              onClick={() => navigate("/admin/leaves/requests")}
            >
              <div
                className={`w-10 h-10 rounded-lg ${darkMode ? "bg-emerald-500/20" : "bg-emerald-100"} flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2`}
              >
                <FiCalendar className="w-5 h-5" />
              </div>
              <span className={`text-sm font-medium ${theme.text.primary}`}>
                Approve Leaves
              </span>
            </button>

            <button
              className={`flex flex-col items-center justify-center p-4 ${darkMode ? "bg-purple-500/10 hover:bg-purple-500/20" : "bg-purple-50 hover:bg-purple-100"} rounded-lg border ${darkMode ? "border-purple-500/30" : "border-purple-200"} transition-colors`}
              onClick={() => navigate("/admin/recruitment/add-job")}
            >
              <div
                className={`w-10 h-10 rounded-lg ${darkMode ? "bg-purple-500/20" : "bg-purple-100"} flex items-center justify-center text-purple-600 dark:text-purple-400 mb-2`}
              >
                <FiBriefcase className="w-5 h-5" />
              </div>
              <span className={`text-sm font-medium ${theme.text.primary}`}>
                Post Job
              </span>
            </button>

            <button
              className={`flex flex-col items-center justify-center p-4 ${darkMode ? "bg-amber-500/10 hover:bg-amber-500/20" : "bg-amber-50 hover:bg-amber-100"} rounded-lg border ${darkMode ? "border-amber-500/30" : "border-amber-200"} transition-colors`}
              onClick={() => navigate("/admin/analytics")}
            >
              <div
                className={`w-10 h-10 rounded-lg ${darkMode ? "bg-amber-500/20" : "bg-amber-100"} flex items-center justify-center text-amber-600 dark:text-amber-400 mb-2`}
              >
                <FiTrendingUp className="w-5 h-5" />
              </div>
              <span className={`text-sm font-medium ${theme.text.primary}`}>
                View Reports
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activities Timeline */}
      <div
        className={`${theme.bg.secondary} rounded-xl p-6 border ${theme.border.primary} shadow-sm`}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${theme.text.primary} mb-2`}>
              Recent Activities Timeline
            </h2>
            <p className={theme.text.secondary}>
              Latest actions and updates from your organization
            </p>
          </div>
          <button
            className={`text-sm text-purple-600 dark:text-purple-400 hover:underline px-4 py-2 ${darkMode ? "bg-gray-900/50" : "bg-gray-100"} rounded-lg border ${theme.border.primary} hover:border-purple-500/30 transition-colors`}
          >
            View All Activities
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentActivities.map((activity, index) => (
            <div
              key={index}
              className={`${darkMode ? "bg-gray-900/50" : "bg-gray-100"} rounded-xl p-4 border ${theme.border.primary} hover:border-purple-500/30 transition-colors`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-full ${darkMode ? "bg-gray-800" : "bg-white"} flex items-center justify-center`}
                  >
                    {getStatusIcon(activity.status)}
                  </div>
                </div>
                <div>
                  <p className={`font-medium ${theme.text.primary}`}>
                    {activity.user}
                  </p>
                  <p className="text-xs text-gray-500">Team Member</p>
                </div>
              </div>

              <p className={`text-sm ${theme.text.secondary} mb-2`}>
                {activity.action}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FiClock className="w-3 h-3" />
                  <span>{activity.time}</span>
                </div>
                <div
                  className={`text-xs px-2 py-1 rounded-full ${
                    activity.status === "success"
                      ? `${darkMode ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-700"}`
                      : activity.status === "warning"
                        ? `${darkMode ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-700"}`
                        : `${darkMode ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-700"}`
                  }`}
                >
                  {activity.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminHome;

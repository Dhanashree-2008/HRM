// src/pages/manager/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  BarChart3,
  Download,
  Eye,
  Plus,
  PieChart,
  LineChart,
  Activity,
  Target,
  ChevronDown,
  Building,
  FileText,
  Briefcase,
  UserPlus,
  Award,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { managerService } from '../../services/managerService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showExportOptions, setShowExportOptions] = useState(false);
  const { isDarkMode = true } = useOutletContext() || {};

  // Get theme colors based on dark mode - matching homepage
  const themeColors = isDarkMode ? {
    primary: '#8b5cf6',      // Purple from homepage
    secondary: '#10b981',    // Green from homepage
    accent: '#3b82f6',       // Blue from homepage
    warning: '#f59e0b',      // Amber for warnings
    danger: '#ef4444',       // Red for alerts
    background: '#0f172a',   // Dark background from homepage
    card: '#1e293b',         // Dark card background
    text: '#f9fafb',         // Light text
    muted: '#9ca3af',        // Muted text
    border: '#374151',       // Border color
  } : {
    primary: '#2563eb',      // Blue from charts
    secondary: '#10b981',    // Green from attendance
    accent: '#8b5cf6',       // Purple for highlights
    warning: '#f59e0b',      // Amber for warnings
    danger: '#ef4444',       // Red for alerts
    background: '#f8fafc',   // Light slate background
    card: '#ffffff',         // White cards
    text: '#1e293b',         // Slate 800 for text
    muted: '#64748b',        // Slate 500 for muted text
    border: '#e2e8f0',       // Light border
  };

  // Theme is provided by layout via Outlet context (`isDarkMode`)

  // State for dashboard data
  const [statsData, setStatsData] = useState({
    totalEmployees: 0,
    todaysAttendance: 0,
    departments: 0,
    activeJobs: 0,
    pendingLeaves: 0,
    payrollDue: 0,
  });

  const [weeklyAttendance, setWeeklyAttendance] = useState([]);
  const [leaveDistribution, setLeaveDistribution] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [departmentPerformance, setDepartmentPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  // Import service


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await managerService.getTeamStats();
        const data = response.data;

        if (data) {
          setStatsData(data.stats);
          setDepartmentPerformance(data.departmentPerf);
          setWeeklyAttendance(data.weeklyAtt);
          setLeaveDistribution(data.leaveDist);
          setTodayAttendance(data.todayAtt);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        setStatsData(prev => ({ ...prev, error: error.message })); // Small hack to show error in UI safely
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (statsData.error) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl text-red-500 font-bold">Dashboard Error</h2>
        <p className="text-gray-600">{statsData.error}</p>
        <p className="text-sm mt-2">Please check console for details.</p>
      </div>
    );
  }

  // Navigation handlers
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Action handlers
  const handleSendReminder = (employeeName) => {
    const confirmed = window.confirm(`Send attendance reminder to ${employeeName}?`);
    if (confirmed) {
      alert(`Reminder sent to ${employeeName}`);
    }
  };

  return (
    <div className={`p-4 md:p-6 min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`} style={{ backgroundColor: themeColors.background }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold transition-colors duration-300" style={{ color: themeColors.text }}>Dashboard</h1>
        <p className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>Overview of your organization's performance</p>
      </div>

      {/* Welcome Card */}
      <div className="mb-6 p-6 rounded-xl shadow-sm transition-colors duration-300" style={{
        backgroundColor: themeColors.card,
        border: `1px solid ${themeColors.border}`
      }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-1 transition-colors duration-300" style={{ color: themeColors.text }}>Welcome back, Manager!</h2>
            <p className="transition-colors duration-300" style={{ color: themeColors.muted }}>Here's what's happening with your organization today.</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <button
              onClick={() => handleNavigation('/manager/analytics')}
              className="px-4 py-2 rounded-lg font-medium transition-colors duration-300 hover:opacity-90"
              style={{ backgroundColor: themeColors.primary, color: 'white' }}
            >
              View Analytics
            </button>
            <button
              onClick={() => handleNavigation('/manager/settings')}
              className="px-4 py-2 border rounded-lg font-medium transition-colors duration-300 hover:opacity-90"
              style={{ borderColor: themeColors.primary, color: themeColors.primary }}
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="p-4 rounded-lg shadow-sm transition-colors duration-300" style={{
          backgroundColor: themeColors.card,
          border: `1px solid ${themeColors.border}`
        }}>
          <div className="flex items-center justify-between mb-2">
            <Users size={20} style={{ color: themeColors.primary }} />
            <span className="text-xs px-2 py-1 rounded-full transition-colors duration-300" style={{ backgroundColor: `${themeColors.primary}20`, color: themeColors.primary }}>
              +5%
            </span>
          </div>
          <p className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>Total Employees</p>
          <p className="text-2xl font-bold mt-1 transition-colors duration-300" style={{ color: themeColors.text }}>{statsData.totalEmployees}</p>
        </div>

        <div className="p-4 rounded-lg shadow-sm transition-colors duration-300" style={{
          backgroundColor: themeColors.card,
          border: `1px solid ${themeColors.border}`
        }}>
          <div className="flex items-center justify-between mb-2">
            <CheckCircle size={20} style={{ color: themeColors.secondary }} />
            <span className="text-xs px-2 py-1 rounded-full transition-colors duration-300" style={{ backgroundColor: `${themeColors.secondary}20`, color: themeColors.secondary }}>
              +2.5%
            </span>
          </div>
          <p className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>Today's Attendance</p>
          <p className="text-2xl font-bold mt-1 transition-colors duration-300" style={{ color: themeColors.text }}>{statsData.todaysAttendance}</p>
        </div>

        <div className="p-4 rounded-lg shadow-sm transition-colors duration-300" style={{
          backgroundColor: themeColors.card,
          border: `1px solid ${themeColors.border}`
        }}>
          <div className="flex items-center justify-between mb-2">
            <Building size={20} style={{ color: themeColors.accent }} />
            <span className="text-xs px-2 py-1 rounded-full transition-colors duration-300" style={{ backgroundColor: `${themeColors.accent}20`, color: themeColors.accent }}>
              +2
            </span>
          </div>
          <p className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>Departments</p>
          <p className="text-2xl font-bold mt-1 transition-colors duration-300" style={{ color: themeColors.text }}>{statsData.departments}</p>
        </div>

        <div className="p-4 rounded-lg shadow-sm transition-colors duration-300" style={{
          backgroundColor: themeColors.card,
          border: `1px solid ${themeColors.border}`
        }}>
          <div className="flex items-center justify-between mb-2">
            <Briefcase size={20} style={{ color: themeColors.warning }} />
            <span className="text-xs px-2 py-1 rounded-full transition-colors duration-300" style={{ backgroundColor: `${themeColors.warning}20`, color: themeColors.warning }}>
              Active
            </span>
          </div>
          <p className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>Active Jobs</p>
          <p className="text-2xl font-bold mt-1 transition-colors duration-300" style={{ color: themeColors.text }}>{statsData.activeJobs}</p>
        </div>

        <div className="p-4 rounded-lg shadow-sm transition-colors duration-300" style={{
          backgroundColor: themeColors.card,
          border: `1px solid ${themeColors.border}`
        }}>
          <div className="flex items-center justify-between mb-2">
            <Calendar size={20} style={{ color: themeColors.danger }} />
            <span className="text-xs px-2 py-1 rounded-full transition-colors duration-300" style={{ backgroundColor: `${themeColors.danger}20`, color: themeColors.danger }}>
              New
            </span>
          </div>
          <p className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>Pending Leaves</p>
          <p className="text-2xl font-bold mt-1 transition-colors duration-300" style={{ color: themeColors.text }}>{statsData.pendingLeaves}</p>
        </div>

        <div className="p-4 rounded-lg shadow-sm transition-colors duration-300" style={{
          backgroundColor: themeColors.card,
          border: `1px solid ${themeColors.border}`
        }}>
          <div className="flex items-center justify-between mb-2">
            <FileText size={20} style={{ color: themeColors.primary }} />
            <span className="text-xs px-2 py-1 rounded-full transition-colors duration-300" style={{ backgroundColor: `${themeColors.primary}20`, color: themeColors.primary }}>
              Today
            </span>
          </div>
          <p className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>Payroll Due</p>
          <p className="text-2xl font-bold mt-1 transition-colors duration-300" style={{ color: themeColors.text }}>{statsData.payrollDue}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Department Performance Chart */}
        <div className="p-6 rounded-xl shadow-sm transition-colors duration-300" style={{
          backgroundColor: themeColors.card,
          border: `1px solid ${themeColors.border}`
        }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold transition-colors duration-300" style={{ color: themeColors.text }}>Department Performance</h3>
            <button
              onClick={() => handleNavigation('/manager/departments')}
              className="text-sm font-medium transition-colors duration-300 hover:opacity-80"
              style={{ color: themeColors.primary }}
            >
              View Details →
            </button>
          </div>

          <div className="space-y-4">
            {departmentPerformance.map((dept, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm transition-colors duration-300">
                  <span style={{ color: themeColors.text }}>{dept.name}</span>
                  <span style={{ color: themeColors.text }}>{dept.attendance}%</span>
                </div>
                <div className="relative h-2 rounded-full transition-colors duration-300" style={{ backgroundColor: `${themeColors.primary}20` }}>
                  <div
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${dept.attendance}%`,
                      backgroundColor: dept.color
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs transition-colors duration-300" style={{ color: themeColors.muted }}>
                  <span>Productivity: {dept.productivity}%</span>
                  <span>{dept.attendance >= 90 ? 'Excellent' : dept.attendance >= 80 ? 'Good' : 'Needs Improvement'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Attendance Trend Chart */}
        <div className="p-6 rounded-xl shadow-sm transition-colors duration-300" style={{
          backgroundColor: themeColors.card,
          border: `1px solid ${themeColors.border}`
        }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold transition-colors duration-300" style={{ color: themeColors.text }}>Weekly Attendance Trends</h3>
            <button
              onClick={() => handleNavigation('/manager/attendance')}
              className="text-sm font-medium transition-colors duration-300 hover:opacity-80"
              style={{ color: themeColors.primary }}
            >
              View Details →
            </button>
          </div>

          <div className="flex items-end h-48 space-x-2">
            {weeklyAttendance.map((day, index) => {
              const total = day.present + day.absent;
              const presentPercentage = (day.present / total) * 100;

              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full relative h-40">
                    {/* Present bar */}
                    <div
                      className="absolute bottom-0 w-full rounded-t transition-all duration-300"
                      style={{
                        height: `${presentPercentage}%`,
                        backgroundColor: themeColors.secondary,
                        opacity: 0.8
                      }}
                    ></div>
                    {/* Absent bar */}
                    <div
                      className="absolute bottom-0 w-full rounded-t transition-all duration-300"
                      style={{
                        height: `${100 - presentPercentage}%`,
                        backgroundColor: themeColors.danger,
                        opacity: 0.6
                      }}
                    ></div>
                  </div>
                  <span className="text-xs mt-2 transition-colors duration-300" style={{ color: themeColors.text }}>{day.day}</span>
                  <div className="text-xs mt-1 transition-colors duration-300" style={{ color: themeColors.muted }}>
                    {day.present}/{total}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded transition-colors duration-300" style={{ backgroundColor: themeColors.secondary }}></div>
              <span className="transition-colors duration-300" style={{ color: themeColors.muted }}>Present</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded transition-colors duration-300" style={{ backgroundColor: themeColors.danger }}></div>
              <span className="transition-colors duration-300" style={{ color: themeColors.muted }}>Absent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Distribution & Today's Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Leave Distribution Chart */}
        <div className="p-6 rounded-xl shadow-sm transition-colors duration-300" style={{
          backgroundColor: themeColors.card,
          border: `1px solid ${themeColors.border}`
        }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold transition-colors duration-300" style={{ color: themeColors.text }}>Leave Distribution</h3>
            <button
              onClick={() => handleNavigation('/manager/leave-approval')}
              className="text-sm font-medium transition-colors duration-300 hover:opacity-80"
              style={{ color: themeColors.primary }}
            >
              View All →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {leaveDistribution.map((leave, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg transition-colors duration-300" style={{ backgroundColor: `${leave.color}10` }}>
                <div className="w-8 h-8 rounded flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: leave.color }}>
                  <Calendar size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-medium transition-colors duration-300" style={{ color: themeColors.text }}>{leave.type}</p>
                  <p className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>{leave.count} employees</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pie chart visualization */}
          <div className="mt-6 relative h-48 flex items-center justify-center">
            <div className="relative w-48 h-48">
              {leaveDistribution.map((leave, index) => {
                const percentage = (leave.count / 105) * 100; // Total: 105
                const offset = leaveDistribution.slice(0, index).reduce((acc, l) => acc + (l.count / 105) * 100, 0);

                return (
                  <div
                    key={index}
                    className="absolute top-0 left-0 w-full h-full rounded-full transition-all duration-300"
                    style={{
                      background: `conic-gradient(${leave.color} 0% ${percentage}%, transparent ${percentage}% 100%)`,
                      transform: `rotate(${offset * 3.6}deg)`,
                    }}
                  ></div>
                );
              })}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full transition-colors duration-300" style={{ backgroundColor: themeColors.background }}></div>
            </div>
          </div>
        </div>

        {/* Today's Attendance */}
        <div className="p-6 rounded-xl shadow-sm transition-colors duration-300" style={{
          backgroundColor: themeColors.card,
          border: `1px solid ${themeColors.border}`
        }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold transition-colors duration-300" style={{ color: themeColors.text }}>Today's Attendance</h3>
            <button
              onClick={() => handleNavigation('/manager/attendance')}
              className="text-sm font-medium flex items-center space-x-1 transition-colors duration-300 hover:opacity-80"
              style={{ color: themeColors.primary }}
            >
              <Eye size={14} />
              <span>View Details</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {todayAttendance.map((employee) => (
              <div
                key={employee.id}
                className="p-4 rounded-lg border transition-colors duration-300"
                style={{
                  borderColor: employee.status === 'Present' ? `${themeColors.secondary}30` :
                    employee.status === 'Late' ? `${themeColors.warning}30` :
                      `${themeColors.danger}30`,
                  backgroundColor: employee.status === 'Present' ? `${themeColors.secondary}10` :
                    employee.status === 'Late' ? `${themeColors.warning}10` :
                      `${themeColors.danger}10`
                }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${employee.status === 'Present' ? 'bg-green-100 dark:bg-green-900/20' :
                    employee.status === 'Late' ? 'bg-yellow-100 dark:bg-yellow-900/20' : 'bg-red-100 dark:bg-red-900/20'
                    }`}>
                    <span className={`font-semibold transition-colors duration-300 ${employee.status === 'Present' ? 'text-green-800 dark:text-green-300' :
                      employee.status === 'Late' ? 'text-yellow-800 dark:text-yellow-300' : 'text-red-800 dark:text-red-300'
                      }`}>
                      {employee.avatar}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium transition-colors duration-300" style={{ color: themeColors.text }}>{employee.name}</p>
                    <p className="text-xs transition-colors duration-300" style={{ color: themeColors.muted }}>{employee.employeeId}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium transition-colors duration-300 ${employee.status === 'Present' ? 'text-green-600 dark:text-green-400' :
                    employee.status === 'Late' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                    {employee.status}
                  </span>
                  <span className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>{employee.time}</span>
                </div>
                {employee.status === 'Absent' && (
                  <button
                    onClick={() => handleSendReminder(employee.name)}
                    className="mt-3 w-full text-xs py-1.5 rounded font-medium transition-colors duration-300 hover:opacity-90"
                    style={{ backgroundColor: themeColors.danger, color: 'white' }}
                  >
                    Send Reminder
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="p-6 rounded-xl shadow-sm mb-6 transition-colors duration-300" style={{
        backgroundColor: themeColors.card,
        border: `1px solid ${themeColors.border}`
      }}>
        <h3 className="text-lg font-semibold mb-6 transition-colors duration-300" style={{ color: themeColors.text }}>Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border transition-colors duration-300" style={{ borderColor: `${themeColors.secondary}30`, backgroundColor: `${themeColors.secondary}10` }}>
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp size={20} style={{ color: themeColors.secondary }} />
              <span className="font-medium transition-colors duration-300" style={{ color: themeColors.text }}>Attendance Improvement</span>
            </div>
            <p className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>
              Overall attendance improved by 2.5% this month
            </p>
          </div>

          <div className="p-4 rounded-lg border transition-colors duration-300" style={{ borderColor: `${themeColors.primary}30`, backgroundColor: `${themeColors.primary}10` }}>
            <div className="flex items-center space-x-2 mb-3">
              <Activity size={20} style={{ color: themeColors.primary }} />
              <span className="font-medium transition-colors duration-300" style={{ color: themeColors.text }}>Productivity Peak</span>
            </div>
            <p className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>
              Sales department leads with 99% productivity
            </p>
          </div>

          <div className="p-4 rounded-lg border transition-colors duration-300" style={{ borderColor: `${themeColors.accent}30`, backgroundColor: `${themeColors.accent}10` }}>
            <div className="flex items-center space-x-2 mb-3">
              <Target size={20} style={{ color: themeColors.accent }} />
              <span className="font-medium transition-colors duration-300" style={{ color: themeColors.text }}>Monthly Target</span>
            </div>
            <p className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>
              On track to achieve 94% attendance target
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 rounded-xl shadow-sm transition-colors duration-300" style={{
        backgroundColor: themeColors.card,
        border: `1px solid ${themeColors.border}`
      }}>
        <h3 className="text-lg font-semibold mb-4 transition-colors duration-300" style={{ color: themeColors.text }}>Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => handleNavigation('/manager/employees')}
            className="flex flex-col items-center justify-center p-4 rounded-lg hover:opacity-90 transition-all duration-300"
            style={{ backgroundColor: `${themeColors.primary}10` }}
          >
            <Users size={24} style={{ color: themeColors.primary }} className="mb-2 transition-colors duration-300" />
            <span className="text-sm font-medium transition-colors duration-300" style={{ color: themeColors.text }}>Team Roster</span>
          </button>

          <button
            onClick={() => handleNavigation('/manager/attendance')}
            className="flex flex-col items-center justify-center p-4 rounded-lg hover:opacity-90 transition-all duration-300"
            style={{ backgroundColor: `${themeColors.secondary}10` }}
          >
            <Calendar size={24} style={{ color: themeColors.secondary }} className="mb-2 transition-colors duration-300" />
            <span className="text-sm font-medium transition-colors duration-300" style={{ color: themeColors.text }}>Attendance</span>
          </button>

          <button
            onClick={() => handleNavigation('/manager/calendar')}
            className="flex flex-col items-center justify-center p-4 rounded-lg hover:opacity-90 transition-all duration-300"
            style={{ backgroundColor: `${themeColors.accent}10` }}
          >
            <Calendar size={24} style={{ color: themeColors.accent }} className="mb-2 transition-colors duration-300" />
            <span className="text-sm font-medium transition-colors duration-300" style={{ color: themeColors.text }}>Leave Calendar</span>
          </button>

          <button
            onClick={() => handleNavigation('/manager/leave-approval')}
            className="flex flex-col items-center justify-center p-4 rounded-lg hover:opacity-90 transition-all duration-300"
            style={{ backgroundColor: `${themeColors.warning}10` }}
          >
            <Plus size={24} style={{ color: themeColors.warning }} className="mb-2 transition-colors duration-300" />
            <span className="text-sm font-medium transition-colors duration-300" style={{ color: themeColors.text }}>Add Leave</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
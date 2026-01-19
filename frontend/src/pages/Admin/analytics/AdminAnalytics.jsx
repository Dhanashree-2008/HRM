import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUsers, FiCalendar, FiDollarSign, FiTrendingUp, FiTrendingDown, FiBarChart2, FiPieChart, FiActivity, FiDownload } from "react-icons/fi";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { useTheme, getThemeClasses } from "../../../contexts/ThemeContext";

const AdminAnalytics = () => {
  const darkMode = useTheme();
  const theme = getThemeClasses(darkMode);
  const [timeRange, setTimeRange] = useState("monthly");
  const [dashboard, setDashboard] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

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

  // Hiring trends for area chart (fallback)
  const hiringData = charts?.leaves?.map((l) => ({ month: monthNames[(Number(l.month) - 1) % 12] || 'N', hired: Number(l.count) || 0, resigned: 0 })) || [
    { month: "Jan", hired: 8, resigned: 2 },
    { month: "Feb", hired: 12, resigned: 1 },
    { month: "Mar", hired: 10, resigned: 3 },
    { month: "Apr", hired: 15, resigned: 2 },
    { month: "May", hired: 8, resigned: 4 },
    { month: "Jun", hired: 14, resigned: 1 },
    { month: "Jul", hired: 12, resigned: 3 }
  ];

  // Performance metrics for line chart (use dashboard when available)
  const performanceData = dashboard?.performance || [
    { month: "Jan", attendance: 92, productivity: 85, quality: 88 },
    { month: "Feb", attendance: 93, productivity: 86, quality: 89 },
    { month: "Mar", attendance: 94, productivity: 87, quality: 90 },
    { month: "Apr", attendance: 95, productivity: 88, quality: 91 },
    { month: "May", attendance: 94, productivity: 89, quality: 92 },
    { month: "Jun", attendance: 95, productivity: 90, quality: 93 }
  ];

  // Leave statistics (fallback)
  const leaveData = charts?.leaves?.map((l) => ({ type: `Month ${l.month}`, value: Number(l.count), color: colors.success })) || [
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
          // Map monthly attendance to month name and present count
          attendance: chartsRes.data.attendance?.map((r) => ({ month: monthNames[(Number(r.month) - 1) % 12] || 'N', present: Number(r.count) })) || null,
          leaves: chartsRes.data.leaves || null,
          departments: chartsRes.data.departments || null,
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
  }, []);

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
            <button className={`flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors`}>
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
            <ResponsiveContainer width="100%" height="100%">
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
            <ResponsiveContainer width="100%" height="100%">
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

      {/* Performance & Hiring Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Performance Metrics - Line Chart */}
        <div className={`${cardBg} rounded-xl p-6 border ${cardBorder} shadow-sm`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-lg font-semibold ${textPrimary}`}>Performance Metrics</h3>
            <button className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>View Details</button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={performanceData}
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
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  name="Attendance (%)" 
                  stroke={colors.primary} 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="productivity" 
                  name="Productivity (%)" 
                  stroke={colors.secondary} 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="quality" 
                  name="Quality (%)" 
                  stroke={colors.tertiary} 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hiring Trends - Area Chart */}
        <div className={`${cardBg} rounded-xl p-6 border ${cardBorder} shadow-sm`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-lg font-semibold ${textPrimary}`}>Hiring Trends</h3>
            <button className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>View Details</button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
            { (charts?.leaves ? charts.leaves : leaveData).map((item, idx) => (
              <div key={idx} className={`flex justify-between items-center p-3 ${darkMode ? 'bg-slate-900/50' : 'bg-gray-50'} rounded-lg`}>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color || (idx===0? colors.success: idx===1?colors.warning:colors.danger) }}></div>
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
              <p className={`text-sm ${textSecondary}`}>This month</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-3xl font-bold ${textPrimary} mb-2`}>248</div>
            <p className={`${textSecondary} mb-4`}>Total hours</p>
            <div>
              <div className={`flex justify-between text-sm ${textSecondary} mb-1`}>
                <span>IT Department</span>
                <span>142 hrs</span>
              </div>
              <div className={`h-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '57%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Training Completion */}
        <div className={`${cardBg} rounded-xl p-6 border ${cardBorder} shadow-sm`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-lg ${darkMode ? 'bg-purple-900/30' : 'bg-purple-100'} flex items-center justify-center`}>
              <FiPieChart className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div>
              <h3 className={`font-semibold ${textPrimary}`}>Training Completion</h3>
              <p className={`text-sm ${textSecondary}`}>Quarterly</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke={darkMode ? "#475569" : "#E2E8F0"} strokeWidth="8" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#8B5CF6" 
                  strokeWidth="8" 
                  strokeDasharray="251.2" 
                  strokeDashoffset="251.2 - (251.2 * 78) / 100"
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <div className={`text-3xl font-bold ${textPrimary}`}>78%</div>
                  <div className={`text-sm ${textSecondary}`}>Complete</div>
                </div>
              </div>
            </div>
            <p className={`text-sm ${textSecondary}`}>42 of 54 employees completed training</p>
          </div>
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
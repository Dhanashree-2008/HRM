import React, { useState } from "react";
import { FiUsers, FiMail, FiUser, FiEdit2, FiActivity, FiCalendar, FiTrendingUp, FiClock, FiBriefcase, FiMapPin, FiDollarSign, FiCheckCircle, FiXCircle, FiAlertCircle } from "react-icons/fi";
import { HiOutlineOfficeBuilding, HiOutlineUserGroup } from "react-icons/hi";
import { Link, useParams } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, ComposedChart
} from 'recharts';
import { useTheme, getThemeClasses } from "../../../contexts/ThemeContext";

const DepartmentDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const darkMode = useTheme();
  const themeClasses = getThemeClasses(darkMode);

  const department = {
    id,
    name: "Information Technology",
    email: "it@company.com",
    head: "Rahul Sharma",
    headAvatar: "RS",
    headRole: "Engineering Manager",
    headEmail: "rahul.sharma@company.com",
    colorTag: "blue",
    description: "Responsible for all technical operations, software development, network management, and IT support across the organization.",
    status: "Active",
    createdAt: "2024-01-10",
    establishedDate: "2020-03-15",
    notes: "Ensure daily standups and weekly project updates.\nMaintain documentation standards.\nMonthly tech review on last Friday.\nTeam building quarterly.",
    budget: "$1,200,000",
    projects: 8,
    location: "Floor 3, Tech Wing",
    totalTeams: 4,
  };

  const analytics = {
    totalEmployees: 24,
    presentToday: 21,
    onLeaveToday: 2,
    absentToday: 1,
    monthlyAttendance: 92,
    lateMarks: 4,
    averageWorkHours: "7.6 hrs",
    productivity: 88,
    overtime: 120,
    budgetUtilization: 75,
    projectCompletion: 62,
  };

  // Performance data for charts
  const performanceTrends = [
    { month: "Jan", attendance: 89, productivity: 82 },
    { month: "Feb", attendance: 91, productivity: 85 },
    { month: "Mar", attendance: 90, productivity: 84 },
    { month: "Apr", attendance: 92, productivity: 86 },
    { month: "May", attendance: 93, productivity: 88 },
    { month: "Jun", attendance: 94, productivity: 90 },
  ];

  const employeeDistributionData = [
    { name: "Full-time", value: 18, color: "#8B5CF6" },
    { name: "Part-time", value: 4, color: "#10B981" },
    { name: "Contract", value: 2, color: "#F59E0B" },
  ];

  const skillDistributionData = [
    { skill: "Frontend", level: 85, color: "#8B5CF6" },
    { skill: "Backend", level: 90, color: "#10B981" },
    { skill: "DevOps", level: 75, color: "#F59E0B" },
    { skill: "Database", level: 80, color: "#3B82F6" },
    { skill: "Testing", level: 70, color: "#EF4444" },
  ];

  const projectTimelineData = [
    { project: "Website Redesign", progress: 85, deadline: "2024-03-15" },
    { project: "Mobile App", progress: 60, deadline: "2024-04-30" },
    { project: "API Migration", progress: 95, deadline: "2024-02-28" },
    { project: "Security Audit", progress: 40, deadline: "2024-05-15" },
    { project: "Cloud Migration", progress: 75, deadline: "2024-03-31" },
  ];

  const employees = [
    {
      id: 1,
      name: "Rahul Sharma",
      role: "Engineering Manager",
      email: "rahul.sharma@example.com",
      status: "Active",
      avatar: "RS",
      performance: 4.8,
      attendance: 98,
      projects: 5,
      joinDate: "2021-03-15",
      skills: ["React", "Node.js", "AWS"],
      department: "IT",
      color: "from-blue-500 to-cyan-500"
    },
    // ... rest of employees data
  ];

  const teams = [
    {
      id: 1,
      name: "Frontend Team",
      lead: "Priya Patel",
      members: 6,
      activeProjects: 3,
      completion: 75
    },
    // ... rest of teams data
  ];

  const badgeColors = {
    blue: { 
      bg: darkMode ? "bg-blue-500/20" : "bg-blue-500/20", 
      text: "text-blue-400", 
      border: darkMode ? "border-blue-500/30" : "border-blue-500/40" 
    },
    green: { 
      bg: darkMode ? "bg-emerald-500/20" : "bg-emerald-500/20", 
      text: "text-emerald-400", 
      border: darkMode ? "border-emerald-500/30" : "border-emerald-500/40" 
    },
    pink: { 
      bg: darkMode ? "bg-pink-500/20" : "bg-pink-500/20", 
      text: "text-pink-400", 
      border: darkMode ? "border-pink-500/30" : "border-pink-500/40" 
    },
    yellow: { 
      bg: darkMode ? "bg-amber-500/20" : "bg-amber-500/20", 
      text: "text-amber-400", 
      border: darkMode ? "border-amber-500/30" : "border-amber-500/40" 
    },
    indigo: { 
      bg: darkMode ? "bg-indigo-500/20" : "bg-indigo-500/20", 
      text: "text-indigo-400", 
      border: darkMode ? "border-indigo-500/30" : "border-indigo-500/40" 
    },
  };

  const color = badgeColors[department.colorTag];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-3 border ${darkMode ? "border-gray-700" : "border-gray-300"} rounded-lg shadow-lg`}>
          <p className={darkMode ? "text-gray-300" : "text-gray-800"}>{label}</p>
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

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
            {/* Department Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className={`rounded-xl p-6 border ${themeClasses.border.primary} ${themeClasses.bg.secondary}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${themeClasses.text.muted}`}>Total Employees</p>
                    <h3 className={`text-3xl font-bold ${themeClasses.text.primary} mt-2`}>{analytics.totalEmployees}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <FiUsers className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-sm text-emerald-400">
                    <FiTrendingUp />
                    <span>+12% from last month</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-xl p-6 border ${themeClasses.border.primary} ${themeClasses.bg.secondary}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${themeClasses.text.muted}`}>Monthly Attendance</p>
                    <h3 className={`text-3xl font-bold ${themeClasses.text.primary} mt-2`}>{analytics.monthlyAttendance}%</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                    <FiCalendar className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <div className={`flex-1 ${darkMode ? "bg-gray-700" : "bg-gray-300"} rounded-full h-2`}>
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full"
                        style={{ width: `${analytics.monthlyAttendance}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm ${themeClasses.text.muted}`}>Target: 95%</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-xl p-6 border ${themeClasses.border.primary} ${themeClasses.bg.secondary}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${themeClasses.text.muted}`}>Avg Work Hours</p>
                    <h3 className={`text-3xl font-bold ${themeClasses.text.primary} mt-2`}>{analytics.averageWorkHours}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <FiClock className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className={`text-sm ${themeClasses.text.muted}`}>
                    <span className="text-emerald-400 font-medium">+0.4h</span> from last week
                  </p>
                </div>
              </div>

              <div className={`rounded-xl p-6 border ${themeClasses.border.primary} ${themeClasses.bg.secondary}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${themeClasses.text.muted}`}>Productivity</p>
                    <h3 className={`text-3xl font-bold ${themeClasses.text.primary} mt-2`}>{analytics.productivity}%</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <FiActivity className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <div className={`flex-1 ${darkMode ? "bg-gray-700" : "bg-gray-300"} rounded-full h-2`}>
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        style={{ width: `${analytics.productivity}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Status */}
            <div className={`rounded-xl p-6 border ${themeClasses.border.primary} ${themeClasses.bg.secondary} mb-8`}>
              <h3 className={`text-xl font-bold ${themeClasses.text.primary} mb-6`}>Today's Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className={`rounded-xl p-5 border border-emerald-500/30 ${darkMode ? "bg-gray-900/50" : "bg-emerald-50/50"}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                      <FiUser className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className={`text-sm ${themeClasses.text.muted}`}>Present</p>
                      <p className="text-2xl font-bold text-emerald-400">{analytics.presentToday}</p>
                    </div>
                  </div>
                </div>
                
                <div className={`rounded-xl p-5 border border-blue-500/30 ${darkMode ? "bg-gray-900/50" : "bg-blue-50/50"}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <FiCalendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className={`text-sm ${themeClasses.text.muted}`}>On Leave</p>
                      <p className="text-2xl font-bold text-blue-400">{analytics.onLeaveToday}</p>
                    </div>
                  </div>
                </div>
                
                <div className={`rounded-xl p-5 border border-red-500/30 ${darkMode ? "bg-gray-900/50" : "bg-red-50/50"}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                      <FiUser className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className={`text-sm ${themeClasses.text.muted}`}>Absent</p>
                      <p className="text-2xl font-bold text-red-400">{analytics.absentToday}</p>
                    </div>
                  </div>
                </div>
                
                <div className={`rounded-xl p-5 border border-amber-500/30 ${darkMode ? "bg-gray-900/50" : "bg-amber-50/50"}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                      <FiClock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className={`text-sm ${themeClasses.text.muted}`}>Late Today</p>
                      <p className="text-2xl font-bold text-amber-400">{analytics.lateMarks}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Teams Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Project Timeline */}
              <div className={`rounded-xl border ${themeClasses.border.primary} ${themeClasses.bg.secondary} p-6`}>
                <h3 className={`text-xl font-bold ${themeClasses.text.primary} mb-6`}>Project Timeline</h3>
                <div className="space-y-4">
                  {projectTimelineData.map((project, index) => (
                    <div key={index} className={`rounded-lg p-4 border ${themeClasses.border.primary} ${darkMode ? "bg-gray-900/50" : "bg-gray-100/50"}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`font-medium ${themeClasses.text.primary}`}>{project.project}</span>
                        <span className={`text-sm ${themeClasses.text.muted}`}>Due: {project.deadline}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`flex-1 h-2 ${darkMode ? "bg-gray-700" : "bg-gray-300"} rounded-full overflow-hidden`}>
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${themeClasses.text.primary}`}>{project.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Department Head */}
              <div className={`rounded-xl border ${themeClasses.border.primary} ${themeClasses.bg.secondary} p-6`}>
                <h3 className={`text-xl font-bold ${themeClasses.text.primary} mb-6`}>Department Head</h3>
                <div className={`rounded-lg p-6 border ${themeClasses.border.primary} ${darkMode ? "bg-gray-900/50" : "bg-gray-100/50"}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold">
                      {department.headAvatar}
                    </div>
                    <div>
                      <p className={`font-bold ${themeClasses.text.primary}`}>{department.head}</p>
                      <p className={`text-sm ${themeClasses.text.muted}`}>{department.headRole}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FiMail className="w-4 h-4 text-gray-500" />
                      <span className={`text-sm ${themeClasses.text.muted}`}>{department.headEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiBriefcase className="w-4 h-4 text-gray-500" />
                      <span className={`text-sm ${themeClasses.text.muted}`}>{department.headRole}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case "employees":
        return (
          <div className="space-y-8">
            {/* Employee Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`rounded-xl p-6 border ${themeClasses.border.primary} ${themeClasses.bg.secondary}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${themeClasses.text.muted}`}>Total Employees</p>
                    <h3 className={`text-2xl font-bold ${themeClasses.text.primary} mt-1`}>{employees.length}</h3>
                  </div>
                  <FiUsers className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              
              <div className={`rounded-xl p-6 border ${themeClasses.border.primary} ${themeClasses.bg.secondary}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${themeClasses.text.muted}`}>Avg Performance</p>
                    <h3 className={`text-2xl font-bold ${themeClasses.text.primary} mt-1`}>
                      {(employees.reduce((sum, emp) => sum + emp.performance, 0) / employees.length).toFixed(1)}/5
                    </h3>
                  </div>
                  <FiTrendingUp className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
              
              <div className={`rounded-xl p-6 border ${themeClasses.border.primary} ${themeClasses.bg.secondary}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${themeClasses.text.muted}`}>Avg Attendance</p>
                    <h3 className={`text-2xl font-bold ${themeClasses.text.primary} mt-1`}>
                      {Math.round(employees.reduce((sum, emp) => sum + emp.attendance, 0) / employees.length)}%
                    </h3>
                  </div>
                  <FiCheckCircle className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              
              <div className={`rounded-xl p-6 border ${themeClasses.border.primary} ${themeClasses.bg.secondary}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${themeClasses.text.muted}`}>Active Projects</p>
                    <h3 className={`text-2xl font-bold ${themeClasses.text.primary} mt-1`}>
                      {employees.reduce((sum, emp) => sum + emp.projects, 0)}
                    </h3>
                  </div>
                  <FiBriefcase className="w-8 h-8 text-amber-400" />
                </div>
              </div>
            </div>

            {/* Employee Distribution Chart */}
            <div className={`rounded-xl border ${themeClasses.border.primary} ${themeClasses.bg.secondary} p-6`}>
              <h3 className={`text-xl font-bold ${themeClasses.text.primary} mb-6`}>Employee Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={employeeDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {employeeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} employees`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Employee List */}
            <div className={`rounded-xl border ${themeClasses.border.primary} ${themeClasses.bg.secondary} overflow-hidden`}>
              <div className={`p-6 border-b ${themeClasses.border.primary}`}>
                <div className="flex justify-between items-center">
                  <h3 className={`text-xl font-bold ${themeClasses.text.primary}`}>Team Members ({employees.length})</h3>
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg font-medium transition-colors">
                    Add New Member
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={darkMode ? "bg-gray-900/50" : "bg-gray-100/50"}>
                    <tr>
                      <th className={`p-4 text-left text-sm font-semibold ${themeClasses.text.muted}`}>Employee</th>
                      <th className={`p-4 text-left text-sm font-semibold ${themeClasses.text.muted}`}>Role</th>
                      <th className={`p-4 text-left text-sm font-semibold ${themeClasses.text.muted}`}>Performance</th>
                      <th className={`p-4 text-left text-sm font-semibold ${themeClasses.text.muted}`}>Attendance</th>
                      <th className={`p-4 text-left text-sm font-semibold ${themeClasses.text.muted}`}>Projects</th>
                      <th className={`p-4 text-left text-sm font-semibold ${themeClasses.text.muted}`}>Status</th>
                      <th className={`p-4 text-left text-sm font-semibold ${themeClasses.text.muted}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.id} className={`hover:${darkMode ? "bg-gray-900/50" : "bg-gray-100/50"} transition-colors border-b ${themeClasses.border.primary}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${emp.color} flex items-center justify-center text-white font-bold`}>
                              {emp.avatar}
                            </div>
                            <div>
                              <p className={`font-medium ${themeClasses.text.primary}`}>{emp.name}</p>
                              <p className={`text-xs ${themeClasses.text.muted}`}>{emp.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className={themeClasses.text.primary}>{emp.role}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${themeClasses.text.primary}`}>{emp.performance}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < Math.floor(emp.performance) ? 'text-amber-500' : themeClasses.text.muted}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <span className={`font-medium ${themeClasses.text.primary}`}>{emp.attendance}%</span>
                            <div className={`w-16 h-2 ${darkMode ? "bg-gray-700" : "bg-gray-300"} rounded-full overflow-hidden`}>
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-green-500"
                                style={{ width: `${emp.attendance}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                            {emp.projects} projects
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            emp.status === "Active" 
                              ? "bg-emerald-500/20 text-emerald-400" 
                              : "bg-gray-500/20 text-gray-400"
                          }`}>
                            {emp.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Link
                              to={`/admin/employees/${emp.id}`}
                              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition-colors"
                            >
                              View
                            </Link>
                            <button className={`px-3 py-1.5 border ${themeClasses.border.primary} ${themeClasses.text.muted} text-xs rounded-lg hover:${darkMode ? "bg-gray-700" : "bg-gray-300"} hover:${themeClasses.text.primary} transition-colors`}>
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Teams */}
            <div className={`rounded-xl border ${themeClasses.border.primary} ${themeClasses.bg.secondary} p-6`}>
              <h3 className={`text-xl font-bold ${themeClasses.text.primary} mb-6`}>Teams ({teams.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teams.map((team) => (
                  <div key={team.id} className={`rounded-xl p-6 border ${themeClasses.border.primary} ${darkMode ? "bg-gray-900/50" : "bg-gray-100/50"} hover:border-purple-500/30 transition-colors`}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className={`font-bold ${themeClasses.text.primary}`}>{team.name}</p>
                        <p className={`text-sm ${themeClasses.text.muted}`}>Lead: {team.lead}</p>
                      </div>
                      <FiUsers className="w-8 h-8 text-purple-400" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className={themeClasses.text.muted}>Members</span>
                        <span className={themeClasses.text.primary}>{team.members}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className={themeClasses.text.muted}>Projects</span>
                        <span className={themeClasses.text.primary}>{team.activeProjects}</span>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={themeClasses.text.muted}>Completion</span>
                          <span className={themeClasses.text.primary}>{team.completion}%</span>
                        </div>
                        <div className={`h-2 ${darkMode ? "bg-gray-700" : "bg-gray-300"} rounded-full overflow-hidden`}>
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                            style={{ width: `${team.completion}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "performance":
        return (
          <div className="space-y-8">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`rounded-xl p-6 border ${themeClasses.border.primary} ${themeClasses.bg.secondary}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${themeClasses.text.muted}`}>Productivity Score</p>
                    <h3 className={`text-2xl font-bold ${themeClasses.text.primary} mt-1`}>{analytics.productivity}%</h3>
                  </div>
                  <FiTrendingUp className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="mt-4">
                  <div className={`h-2 ${darkMode ? "bg-gray-700" : "bg-gray-300"} rounded-full overflow-hidden`}>
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-green-500"
                      style={{ width: `${analytics.productivity}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className={`rounded-xl p-6 border ${themeClasses.border.primary} ${themeClasses.bg.secondary}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${themeClasses.text.muted}`}>Attendance Rate</p>
                    <h3 className={`text-2xl font-bold ${themeClasses.text.primary} mt-1`}>{analytics.monthlyAttendance}%</h3>
                  </div>
                  <FiCheckCircle className="w-8 h-8 text-blue-400" />
                </div>
                <div className="mt-4">
                  <div className={`h-2 ${darkMode ? "bg-gray-700" : "bg-gray-300"} rounded-full overflow-hidden`}>
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      style={{ width: `${analytics.monthlyAttendance}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className={`rounded-xl p-6 border ${themeClasses.border.primary} ${themeClasses.bg.secondary}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${themeClasses.text.muted}`}>Budget Utilization</p>
                    <h3 className={`text-2xl font-bold ${themeClasses.text.primary} mt-1`}>{analytics.budgetUtilization}%</h3>
                  </div>
                  <FiDollarSign className="w-8 h-8 text-amber-400" />
                </div>
                <div className="mt-4">
                  <div className={`h-2 ${darkMode ? "bg-gray-700" : "bg-gray-300"} rounded-full overflow-hidden`}>
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                      style={{ width: `${analytics.budgetUtilization}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className={`rounded-xl p-6 border ${themeClasses.border.primary} ${themeClasses.bg.secondary}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${themeClasses.text.muted}`}>Project Completion</p>
                    <h3 className={`text-2xl font-bold ${themeClasses.text.primary} mt-1`}>{analytics.projectCompletion}%</h3>
                  </div>
                  <FiBriefcase className="w-8 h-8 text-purple-400" />
                </div>
                <div className="mt-4">
                  <div className={`h-2 ${darkMode ? "bg-gray-700" : "bg-gray-300"} rounded-full overflow-hidden`}>
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${analytics.projectCompletion}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Trends Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`rounded-xl border ${themeClasses.border.primary} ${themeClasses.bg.secondary} p-6`}>
                <h3 className={`text-xl font-bold ${themeClasses.text.primary} mb-6`}>Monthly Trends</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={performanceTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                      <XAxis dataKey="month" stroke={darkMode ? "#9CA3AF" : "#6b7280"} />
                      <YAxis stroke={darkMode ? "#9CA3AF" : "#6b7280"} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area type="monotone" dataKey="attendance" name="Attendance (%)" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                      <Line type="monotone" dataKey="productivity" name="Productivity (%)" stroke="#10B981" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={`rounded-xl border ${themeClasses.border.primary} ${themeClasses.bg.secondary} p-6`}>
                <h3 className={`text-xl font-bold ${themeClasses.text.primary} mb-6`}>Skill Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={skillDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                      <XAxis dataKey="skill" stroke={darkMode ? "#9CA3AF" : "#6b7280"} />
                      <YAxis stroke={darkMode ? "#9CA3AF" : "#6b7280"} />
                      <Tooltip />
                      <Bar dataKey="level" name="Skill Level (%)" radius={[4, 4, 0, 0]}>
                        {skillDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Performance Comparison */}
            <div className={`rounded-xl border ${themeClasses.border.primary} ${themeClasses.bg.secondary} p-6`}>
              <h3 className={`text-xl font-bold ${themeClasses.text.primary} mb-6`}>Performance Comparison</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`rounded-xl p-6 border ${themeClasses.border.primary} ${darkMode ? "bg-gray-900/50" : "bg-gray-100/50"}`}>
                  <h4 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>Top Performers</h4>
                  <div className="space-y-4">
                    {employees
                      .sort((a, b) => b.performance - a.performance)
                      .slice(0, 3)
                      .map((emp, index) => (
                        <div key={emp.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${emp.color} flex items-center justify-center text-white font-bold`}>
                              {emp.avatar}
                            </div>
                            <div>
                              <p className={`font-medium ${themeClasses.text.primary}`}>{emp.name}</p>
                              <p className={`text-xs ${themeClasses.text.muted}`}>{emp.role}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-amber-400">{emp.performance}</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-3 h-3 ${i < Math.floor(emp.performance) ? 'text-amber-500' : themeClasses.text.muted}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                            <p className={`text-xs ${themeClasses.text.muted}`}>Score</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className={`rounded-xl p-6 border ${themeClasses.border.primary} ${darkMode ? "bg-gray-900/50" : "bg-gray-100/50"}`}>
                  <h4 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>Attendance Leaders</h4>
                  <div className="space-y-4">
                    {employees
                      .sort((a, b) => b.attendance - a.attendance)
                      .slice(0, 3)
                      .map((emp, index) => (
                        <div key={emp.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${emp.color} flex items-center justify-center text-white font-bold`}>
                              {emp.avatar}
                            </div>
                            <div>
                              <p className={`font-medium ${themeClasses.text.primary}`}>{emp.name}</p>
                              <p className={`text-xs ${themeClasses.text.muted}`}>{emp.role}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-emerald-400">{emp.attendance}%</span>
                            <p className={`text-xs ${themeClasses.text.muted}`}>Attendance</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className={`rounded-xl p-6 border ${themeClasses.border.primary} ${darkMode ? "bg-gray-900/50" : "bg-gray-100/50"}`}>
                  <h4 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>Project Contribution</h4>
                  <div className="space-y-4">
                    {employees
                      .sort((a, b) => b.projects - a.projects)
                      .slice(0, 3)
                      .map((emp, index) => (
                        <div key={emp.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${emp.color} flex items-center justify-center text-white font-bold`}>
                              {emp.avatar}
                            </div>
                            <div>
                              <p className={`font-medium ${themeClasses.text.primary}`}>{emp.name}</p>
                              <p className={`text-xs ${themeClasses.text.muted}`}>{emp.role}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-blue-400">{emp.projects}</span>
                            <p className={`text-xs ${themeClasses.text.muted}`}>Projects</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Insights */}
            <div className={`rounded-xl border ${themeClasses.border.primary} ${themeClasses.bg.secondary} p-6`}>
              <h3 className={`text-xl font-bold ${themeClasses.text.primary} mb-6`}>Performance Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-900/50" : "bg-gray-100/50"} border border-emerald-500/30`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <FiTrendingUp className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className={`font-medium ${themeClasses.text.primary}`}>Positive Trend</p>
                      <p className={`text-sm ${themeClasses.text.muted}`}>Productivity up by 8%</p>
                    </div>
                  </div>
                  <p className={`text-sm ${themeClasses.text.primary}`}>Department performance has improved consistently over the last 6 months.</p>
                </div>

                <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-900/50" : "bg-gray-100/50"} border border-blue-500/30`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <FiUsers className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className={`font-medium ${themeClasses.text.primary}`}>Team Engagement</p>
                      <p className={`text-sm ${themeClasses.text.muted}`}>High participation</p>
                    </div>
                  </div>
                  <p className={`text-sm ${themeClasses.text.primary}`}>Team meetings and collaboration have increased by 25% this quarter.</p>
                </div>

                <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-900/50" : "bg-gray-100/50"} border border-amber-500/30`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <FiAlertCircle className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className={`font-medium ${themeClasses.text.primary}`}>Areas for Improvement</p>
                      <p className={`text-sm ${themeClasses.text.muted}`}>Training needed</p>
                    </div>
                  </div>
                  <p className={`text-sm ${themeClasses.text.primary}`}>Some team members require additional training in advanced technologies.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-8">
            {/* Department Settings */}
            <div className={`rounded-xl border ${themeClasses.border.primary} ${themeClasses.bg.secondary} p-6`}>
              <h3 className={`text-xl font-bold ${themeClasses.text.primary} mb-6`}>Department Settings</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>Department Name</label>
                    <input
                      type="text"
                      defaultValue={department.name}
                      className={`w-full px-4 py-3 ${themeClasses.input.bg} border ${themeClasses.input.border} rounded-lg ${themeClasses.input.text} focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>Department Email</label>
                    <input
                      type="email"
                      defaultValue={department.email}
                      className={`w-full px-4 py-3 ${themeClasses.input.bg} border ${themeClasses.input.border} rounded-lg ${themeClasses.input.text} focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>Description</label>
                  <textarea
                    rows="4"
                    defaultValue={department.description}
                    className={`w-full px-4 py-3 ${themeClasses.input.bg} border ${themeClasses.input.border} rounded-lg ${themeClasses.input.text} focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>Status</label>
                    <select className={`w-full px-4 py-3 ${themeClasses.input.bg} border ${themeClasses.input.border} rounded-lg ${themeClasses.input.text} focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20`}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>Location</label>
                    <input
                      type="text"
                      defaultValue={department.location}
                      className={`w-full px-4 py-3 ${themeClasses.input.bg} border ${themeClasses.input.border} rounded-lg ${themeClasses.input.text} focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20`}
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-700">
                  <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className={`rounded-xl border border-red-500/30 p-6 ${themeClasses.bg.secondary}`}>
              <h3 className={`text-xl font-bold ${themeClasses.text.primary} mb-6`}>Danger Zone</h3>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-900/50" : "bg-gray-100/50"} border ${themeClasses.border.primary}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${themeClasses.text.primary}`}>Archive Department</p>
                      <p className={`text-sm ${themeClasses.text.muted}`}>Archive this department and all its data</p>
                    </div>
                    <button className={`px-4 py-2 border ${themeClasses.border.primary} ${themeClasses.text.muted} hover:${themeClasses.text.primary} hover:border-gray-600 rounded-lg transition-colors`}>
                      Archive
                    </button>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-900/50" : "bg-gray-100/50"} border ${themeClasses.border.primary}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${themeClasses.text.primary}`}>Delete Department</p>
                      <p className={`text-sm ${themeClasses.text.muted}`}>Permanently delete this department and all its data</p>
                    </div>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Information */}
            <div className={`rounded-xl border ${themeClasses.border.primary} ${themeClasses.bg.secondary} p-6`}>
              <h3 className={`text-xl font-bold ${themeClasses.text.primary} mb-6`}>Department Information</h3>
              <div className="space-y-3">
                <div className={`flex justify-between items-center p-3 rounded-lg hover:${darkMode ? "bg-gray-900/50" : "bg-gray-100/50"} transition-colors`}>
                  <span className={themeClasses.text.muted}>Created Date</span>
                  <span className={`font-medium ${themeClasses.text.primary}`}>{department.createdAt}</span>
                </div>
                <div className={`flex justify-between items-center p-3 rounded-lg hover:${darkMode ? "bg-gray-900/50" : "bg-gray-100/50"} transition-colors`}>
                  <span className={themeClasses.text.muted}>Established Date</span>
                  <span className={`font-medium ${themeClasses.text.primary}`}>{department.establishedDate}</span>
                </div>
                <div className={`flex justify-between items-center p-3 rounded-lg hover:${darkMode ? "bg-gray-900/50" : "bg-gray-100/50"} transition-colors`}>
                  <span className={themeClasses.text.muted}>Total Teams</span>
                  <span className={`font-medium ${themeClasses.text.primary}`}>{department.totalTeams}</span>
                </div>
                <div className={`flex justify-between items-center p-3 rounded-lg hover:${darkMode ? "bg-gray-900/50" : "bg-gray-100/50"} transition-colors`}>
                  <span className={themeClasses.text.muted}>Active Projects</span>
                  <span className={`font-medium ${themeClasses.text.primary}`}>{department.projects}</span>
                </div>
                <div className={`flex justify-between items-center p-3 rounded-lg hover:${darkMode ? "bg-gray-900/50" : "bg-gray-100/50"} transition-colors`}>
                  <span className={themeClasses.text.muted}>Annual Budget</span>
                  <span className={`font-bold ${themeClasses.text.primary}`}>{department.budget}</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className={`px-4 py-2 text-sm rounded-lg ${color.bg} ${color.text} ${color.border}`}>
            {department.name.split(" ")[0]}
          </span>
          <span className={`text-sm ${themeClasses.text.muted}`}>Department ID: DEP-{department.id}</span>
        </div>
        <h1 className={`text-3xl font-bold ${themeClasses.text.primary} mb-4`}>
          {department.name}
        </h1>
        <p className={`${themeClasses.text.muted} max-w-3xl`}>{department.description}</p>

        <div className="flex gap-3 mt-6">
          <Link
            to={`/admin/departments/edit/${department.id}`}
            className={`px-5 py-3 ${themeClasses.bg.secondary} hover:${darkMode ? "bg-gray-700" : "bg-gray-300"} border ${themeClasses.border.primary} ${themeClasses.text.primary} rounded-lg hover:border-purple-500 transition-colors font-medium flex items-center gap-2`}
          >
            <FiEdit2 /> Edit
          </Link>
          <button className={`px-5 py-3 ${themeClasses.bg.secondary} hover:${darkMode ? "bg-gray-700" : "bg-gray-300"} border ${themeClasses.border.primary} ${themeClasses.text.primary} rounded-lg hover:border-purple-500 transition-colors font-medium flex items-center gap-2`}>
            <HiOutlineUserGroup /> Add Member
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className={`p-1 rounded-lg w-fit border ${themeClasses.border.primary} ${darkMode ? "bg-gray-900/50" : "bg-gray-100/50"}`}>
          <div className="flex space-x-1">
            {["overview", "employees", "performance", "settings"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-3 rounded-lg text-sm font-medium capitalize transition-all ${
                  activeTab === tab
                    ? "bg-purple-600 text-white"
                    : `${themeClasses.text.muted} hover:${themeClasses.text.primary} ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"}`
                }`}
              >
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default DepartmentDetails;
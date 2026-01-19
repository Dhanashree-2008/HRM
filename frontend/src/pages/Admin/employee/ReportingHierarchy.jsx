import React, { useState } from "react";
import { 
  FiArrowLeft, FiSearch, FiUsers, FiUserPlus, FiChevronRight, 
  FiEdit2, FiTrash2, FiDownload, FiEye
} from "react-icons/fi";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer, Treemap, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { useTheme, useThemeClasses } from "../../../contexts/ThemeContext";

const ReportingHierarchy = () => {
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedManager, setSelectedManager] = useState("");

const darkMode = useTheme() || false; // Default to false if undefined
const theme = useThemeClasses();


  const employees = [
    { id: 1, name: "Rahul Sharma", role: "Senior Software Engineer", department: "IT" },
    { id: 2, name: "Simran Kaur", role: "HR Director", department: "HR" },
    { id: 3, name: "Ankit Mehta", role: "Finance Head", department: "Finance" },
    { id: 4, name: "Priya Patel", role: "Frontend Developer", department: "IT" },
    { id: 5, name: "Rohit Sharma", role: "Team Lead", department: "IT" },
  ];

  const hierarchyData = {
    id: 1,
    name: "Simran Kaur",
    role: "HR Director",
    department: "HR",
    children: [
      {
        id: 2,
        name: "Ankit Mehta",
        role: "Finance Head",
        department: "Finance",
        children: [
          {
            id: 3,
            name: "Rahul Sharma",
            role: "Senior Software Engineer",
            department: "IT",
          }
        ]
      },
      {
        id: 4,
        name: "Rohit Sharma",
        role: "Team Lead",
        department: "IT",
        children: [
          {
            id: 5,
            name: "Priya Patel",
            role: "Frontend Developer",
            department: "IT",
          }
        ]
      }
    ]
  };

  // Department distribution data for pie chart
  const departmentDistribution = [
    { name: "IT", value: 35, color: "#8B5CF6" },
    { name: "HR", value: 20, color: "#10B981" },
    { name: "Finance", value: 18, color: "#F59E0B" },
    { name: "Marketing", value: 15, color: "#3B82F6" },
    { name: "Operations", value: 12, color: "#EC4899" }
  ];

  // Reporting levels data for bar chart
  const reportingLevelsData = [
    { level: "Level 1", count: 1, color: "#8B5CF6" },
    { level: "Level 2", count: 8, color: "#10B981" },
    { level: "Level 3", count: 25, color: "#F59E0B" },
    { level: "Level 4", count: 45, color: "#3B82F6" },
    { level: "Level 5", count: 71, color: "#EC4899" }
  ];

  // Team size distribution for treemap
  const teamSizeData = [
    { name: "Engineering", size: 45, color: "#8B5CF6" },
    { name: "Sales", size: 28, color: "#10B981" },
    { name: "Marketing", size: 22, color: "#F59E0B" },
    { name: "HR", size: 15, color: "#3B82F6" },
    { name: "Finance", size: 12, color: "#EC4899" },
    { name: "Operations", size: 28, color: "#F97316" }
  ];

  const renderHierarchy = (node, level = 0) => {
    const paddingLeft = level * 32;
    
    return (
      <div key={node.id} className="mb-4">
        <div 
          className={`relative flex items-center p-4 ${theme.bg.secondary} rounded-lg border ${theme.border.primary} hover:border-purple-500 transition-colors`}
          style={{ marginLeft: `${paddingLeft}px` }}
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 dark:text-purple-400 font-bold">
              {node.name.charAt(0)}
            </div>
            <div>
              <p className={`font-medium ${theme.text.primary}`}>{node.name}</p>
              <p className={`text-sm ${theme.text.secondary}`}>{node.role} • {node.department}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} ${theme.text.secondary} hover:text-purple-600 hover:bg-purple-500/20 transition-colors`}>
              <FiEdit2 className="w-4 h-4" />
            </button>
            <button className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} ${theme.text.secondary} hover:text-rose-600 hover:bg-rose-500/20 transition-colors`}>
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {node.children && node.children.map(child => renderHierarchy(child, level + 1))}
      </div>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEmployee || !selectedManager) {
      alert("Please select both employee and manager");
      return;
    }
    
    const employee = employees.find(e => e.id === parseInt(selectedEmployee));
    const manager = employees.find(m => m.id === parseInt(selectedManager));
    
    console.log("Setting reporting hierarchy:", {
      employee: employee?.name,
      manager: manager?.name
    });
    
    alert(`Set ${employee?.name} to report to ${manager?.name}`);
    
    // Reset form
    setSelectedEmployee("");
    setSelectedManager("");
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${theme.bg.secondary} p-3 border ${theme.border.primary} rounded-lg shadow-lg`}>
          <p className={`font-medium ${theme.text.primary}`}>{label}</p>
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

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/employees"
            className={`p-2 rounded-lg ${theme.bg.secondary} border ${theme.border.primary} ${theme.text.secondary} hover:text-purple-600 hover:border-purple-500 transition-colors`}
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className={`text-3xl font-bold ${theme.text.primary} mb-2`}>
              Reporting Hierarchy
            </h1>
            <p className={theme.text.secondary}>
              Define and visualize organizational reporting structure.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className={`flex items-center gap-2 px-4 py-2.5 ${theme.bg.secondary} hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} ${theme.text.primary} rounded-lg border ${theme.border.primary} transition-colors`}>
            <FiDownload className="w-4 h-4" />
            Export Chart
          </button>
          <button className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
            Add Relationship
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Hierarchy Tree */}
        <div className="lg:col-span-2 space-y-6">
          {/* Organization Chart */}
          <div className={`${theme.bg.secondary} rounded-xl p-6 border ${theme.border.primary} shadow-sm`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-lg font-semibold ${theme.text.primary}`}>Organization Chart</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search in hierarchy..."
                    className={`pl-10 pr-4 py-2 ${theme.input.bg} border ${theme.input.border} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className={`mb-6 p-4 ${darkMode ? 'bg-gray-900/50' : 'bg-gray-100'} rounded-lg border ${theme.border.primary}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 dark:text-purple-400 font-bold text-lg">
                    {hierarchyData.name.charAt(0)}
                  </div>
                  <div>
                    <p className={`font-bold ${theme.text.primary} text-lg`}>{hierarchyData.name}</p>
                    <p className={theme.text.secondary}>{hierarchyData.role} (Top Level)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${theme.text.secondary}`}>Reports To</p>
                  <p className={`font-medium ${theme.text.primary}`}>None (CEO)</p>
                </div>
              </div>
            </div>

            <div className="relative pl-4">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/20 to-transparent"></div>
              {renderHierarchy(hierarchyData)}
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Department Distribution */}
            <div className={`${theme.bg.secondary} rounded-xl p-6 border ${theme.border.primary} shadow-sm`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-lg font-semibold ${theme.text.primary}`}>Department Distribution</h3>
                <button className="text-sm text-purple-600 dark:text-purple-400 hover:underline">View Details</button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Reporting Levels */}
            <div className={`${theme.bg.secondary} rounded-xl p-6 border ${theme.border.primary} shadow-sm`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-lg font-semibold ${theme.text.primary}`}>Reporting Levels</h3>
                <button className="text-sm text-purple-600 dark:text-purple-400 hover:underline">View Details</button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportingLevelsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#E5E7EB"} />
                    <XAxis dataKey="level" stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
                    <YAxis stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Employees" radius={[4, 4, 0, 0]}>
                      {reportingLevelsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Controls and Info */}
        <div className="space-y-6">
          {/* Add Reporting Relationship */}
          <div className={`${theme.bg.secondary} rounded-xl p-6 border ${theme.border.primary} shadow-sm`}>
            <h3 className={`text-lg font-semibold ${theme.text.primary} mb-4`}>Add Reporting Relationship</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                  Select Employee
                </label>
                <select
                  className={`w-full px-4 py-3 ${theme.input.bg} border ${theme.input.border} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                  <option value="" className={darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}>Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id} className={darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}>
                      {emp.name} - {emp.role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-center py-2">
                <FiChevronRight className="w-6 h-6 text-purple-400/50 mx-auto" />
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                  Select Reporting Manager
                </label>
                <select
                  className={`w-full px-4 py-3 ${theme.input.bg} border ${theme.input.border} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                  value={selectedManager}
                  onChange={(e) => setSelectedManager(e.target.value)}
                >
                  <option value="" className={darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}>Select Manager</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id} className={darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}>
                      {emp.name} - {emp.role}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-4 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                Set Reporting Relationship
              </button>
            </form>
          </div>

          {/* Team Size Overview */}
          <div className={`${theme.bg.secondary} rounded-xl p-6 border ${theme.border.primary} shadow-sm`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-lg font-semibold ${theme.text.primary}`}>Team Size Overview</h3>
              <button className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
                <FiEye className="w-4 h-4" />
              </button>
            </div>
            
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={teamSizeData}
                  dataKey="size"
                  stroke={darkMode ? "#374151" : "#E5E7EB"}
                  fill="#8884d8"
                >
                  {teamSizeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Treemap>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              {teamSizeData.map((team, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: team.color }}></div>
                  <span className={`text-sm ${theme.text.secondary}`}>{team.name}</span>
                  <span className={`text-sm ${theme.text.primary} ml-auto`}>{team.size}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className={`${theme.bg.secondary} rounded-xl p-6 border ${theme.border.primary} shadow-sm`}>
            <h3 className={`text-lg font-semibold ${theme.text.primary} mb-4`}>Hierarchy Statistics</h3>
            
            <div className="space-y-4">
              <div className={`flex items-center justify-between p-3 ${darkMode ? 'bg-gray-900/50' : 'bg-gray-100'} rounded-lg`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${darkMode ? 'bg-purple-500/20' : 'bg-purple-100'} flex items-center justify-center`}>
                    <FiUsers className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className={`text-sm ${theme.text.primary}`}>Total Employees</div>
                    <div className={`text-xs ${theme.text.secondary}`}>Across all departments</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${theme.text.primary}`}>150</div>
                </div>
              </div>
              
              <div className={`flex items-center justify-between p-3 ${darkMode ? 'bg-gray-900/50' : 'bg-gray-100'} rounded-lg`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${darkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'} flex items-center justify-center`}>
                    <svg className="w-5 h-5 text-emerald-500 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <div className={`text-sm ${theme.text.primary}`}>Reporting Levels</div>
                    <div className={`text-xs ${theme.text.secondary}`}>Maximum depth</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${theme.text.primary}`}>5</div>
                </div>
              </div>
              
              <div className={`flex items-center justify-between p-3 ${darkMode ? 'bg-gray-900/50' : 'bg-gray-100'} rounded-lg`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${darkMode ? 'bg-amber-500/20' : 'bg-amber-100'} flex items-center justify-center`}>
                    <FiUserPlus className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className={`text-sm ${theme.text.primary}`}>Team Leads</div>
                    <div className={`text-xs ${theme.text.secondary}`}>Managers with direct reports</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${theme.text.primary}`}>18</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportingHierarchy;
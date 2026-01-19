import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiFilter, FiEdit2, FiTrash2, FiUser, FiPlus, FiTrendingUp, FiShield, FiCheckCircle } from "react-icons/fi";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Legend
} from "recharts";
import { useTheme, getThemeClasses } from "../../../contexts/ThemeContext";

const RoleList = () => {
    const [search, setSearch] = useState("");
    const [selectedRoles, setSelectedRoles] = useState([]);
    const darkMode = useTheme();
    const themeClasses = getThemeClasses(darkMode);

    const roles = [
        { id: 1, name: "Administrator", permissions: "Full Access", users: 5, createdAt: "2024-01-01", priority: 1 },
        { id: 2, name: "HR Manager", permissions: "Employee Management, Reports, Approvals", users: 12, createdAt: "2024-02-15", priority: 2 },
        { id: 3, name: "Department Head", permissions: "Team Management, Approvals", users: 8, createdAt: "2024-03-10", priority: 3 },
        { id: 4, name: "Employee", permissions: "Self Service, Basic Access", users: 150, createdAt: "2024-01-01", priority: 5 },
        { id: 5, name: "Finance Manager", permissions: "Payroll, Expenses, Reports", users: 4, createdAt: "2024-02-28", priority: 2 },
    ];

    // Data for visualizations
    const roleDistributionData = [
        { name: "Employee", value: 150, color: "#8B5CF6" },
        { name: "HR Manager", value: 12, color: "#10B981" },
        { name: "Finance Manager", value: 4, color: "#F59E0B" },
        { name: "Department Head", value: 8, color: "#3B82F6" },
        { name: "Administrator", value: 5, color: "#EC4899" }
    ];

    const permissionDistribution = [
        { permission: "Employee Mgmt", admin: 100, manager: 80, employee: 20 },
        { permission: "Payroll", admin: 100, manager: 70, employee: 0 },
        { permission: "Reports", admin: 100, manager: 90, employee: 10 },
        { permission: "Approvals", admin: 100, manager: 85, employee: 5 },
        { permission: "Settings", admin: 100, manager: 30, employee: 0 },
    ];

    const roleGrowthData = [
        { month: "Jan", count: 3 },
        { month: "Feb", count: 4 },
        { month: "Mar", count: 4 },
        { month: "Apr", count: 5 },
        { month: "May", count: 5 },
        { month: "Jun", count: 5 },
    ];

    const filtered = roles.filter(role =>
        role.name.toLowerCase().includes(search.toLowerCase().trim()) ||
        role.permissions.toLowerCase().includes(search.toLowerCase().trim())
    );

    const toggleSelectRole = (id) => {
        setSelectedRoles(prev =>
            prev.includes(id)
                ? prev.filter(roleId => roleId !== id)
                : [...prev, id]
        );
    };

    const selectAll = () => {
        if (selectedRoles.length === filtered.length) {
            setSelectedRoles([]);
        } else {
            setSelectedRoles(filtered.map(role => role.id));
        }
    };

    const getRoleColor = (roleName) => {
        if (roleName === "Administrator") return "bg-purple-500/20 text-purple-300 border border-purple-500/30";
        if (roleName.includes("Manager")) return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
        if (roleName === "Department Head") return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
        if (roleName === "Employee") return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
        return "bg-amber-500/20 text-amber-300 border border-amber-500/30";
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

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                <div>
                    <h1 className={`text-3xl font-bold ${themeClasses.text.primary} mb-2`}>
                        Roles & Permissions
                    </h1>
                    <p className={themeClasses.text.secondary}>
                        Manage user roles and access permissions across the system.
                    </p>
                </div>
                <Link
                    to="/admin/roles/add"
                    className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                    <FiPlus className="w-5 h-5" />
                    Add Role
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total Roles", value: "5", change: "+0", trend: "neutral", icon: <FiShield className="w-6 h-6" />, color: "bg-purple-500/20 text-purple-400" },
                    { label: "Active Users", value: "179", change: "+12", trend: "up", icon: <FiTrendingUp className="w-6 h-6" />, color: "bg-emerald-500/20 text-emerald-400" },
                    { label: "Default Role", value: "Employee", change: "", trend: "neutral", icon: <FiUser className="w-6 h-6" />, color: "bg-blue-500/20 text-blue-400" },
                    { label: "Admin Roles", value: "2", change: "", trend: "neutral", icon: <FiShield className="w-6 h-6" />, color: "bg-amber-500/20 text-amber-400" },
                ].map((stat, index) => (
                    <div key={index} className={`${themeClasses.bg.secondary} rounded-xl p-4 border ${themeClasses.border.primary} shadow-sm`}>
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                                {stat.icon}
                            </div>
                            <div className="flex items-center gap-1">
                                {stat.trend === "up" ? <FiTrendingUp className="w-4 h-4 text-emerald-400" /> :
                                    stat.trend === "down" ? <div className="w-4 h-4 text-rose-400 rotate-90">↓</div> :
                                        <div className="w-4 h-0.5 bg-gray-400"></div>}
                                <span className={`text-sm font-medium ${stat.trend === "up" ? "text-emerald-400" :
                                        stat.trend === "down" ? "text-rose-400" :
                                            themeClasses.text.secondary
                                    }`}>
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                        <h3 className={`text-2xl font-bold ${themeClasses.text.primary}`}>{stat.value}</h3>
                        <p className={`text-sm ${themeClasses.text.secondary}`}>{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Role Distribution */}
                <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary} shadow-sm`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Role Distribution</h3>
                        <button className="text-sm text-purple-400 hover:underline">View Details</button>
                    </div>
                    <div className="h-64 min-h-0">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <PieChart>
                                <Pie
                                    data={roleDistributionData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {roleDistributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Permission Radar */}
                <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary} shadow-sm`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Permission Matrix</h3>
                        <button className="text-sm text-purple-400 hover:underline">View Details</button>
                    </div>
                    <div className="h-64 min-h-0">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <RadarChart data={permissionDistribution}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="permission" stroke={darkMode ? "#9CA3AF" : "#4b5563"} />
                                <PolarRadiusAxis stroke={darkMode ? "#9CA3AF" : "#4b5563"} />
                                <Radar name="Admin" dataKey="admin" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                                <Radar name="Manager" dataKey="manager" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                                <Radar name="Employee" dataKey="employee" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
                                <Legend />
                                <Tooltip content={<CustomTooltip />} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Role Growth */}
                <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary} shadow-sm`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Role Growth</h3>
                        <button className="text-sm text-purple-400 hover:underline">View Details</button>
                    </div>
                    <div className="h-64 min-h-0">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <BarChart data={roleGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                                <XAxis dataKey="month" stroke={darkMode ? "#9CA3AF" : "#4b5563"} />
                                <YAxis stroke={darkMode ? "#9CA3AF" : "#4b5563"} />
                                <Tooltip />
                                <Bar dataKey="count" name="Number of Roles" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Search & Filter */}
            <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary} shadow-sm mb-6`}>
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search roles by name or permissions..."
                                className={`w-full pl-12 pr-4 py-3 ${themeClasses.input.bg} border ${themeClasses.input.border} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${themeClasses.input.text} placeholder-gray-400 transition-all`}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className={`flex items-center gap-2 px-4 py-3 ${themeClasses.input.bg} border ${themeClasses.input.border} rounded-lg hover:border-purple-500 ${themeClasses.text.secondary} hover:${themeClasses.text.primary} transition-colors`}>
                            <FiFilter className="w-4 h-4" />
                            <span>Filter</span>
                        </button>
                    </div>
                </div>

                {/* Batch Actions */}
                {selectedRoles.length > 0 && (
                    <div className="mt-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
                                {selectedRoles.length}
                            </div>
                            <span className="text-purple-400 font-medium">
                                {selectedRoles.length} role{selectedRoles.length > 1 ? 's' : ''} selected
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button className={`px-4 py-2 ${themeClasses.input.bg} border ${themeClasses.input.border} rounded-lg text-sm ${themeClasses.text.secondary} hover:border-purple-500 hover:${themeClasses.text.primary} transition-colors`}>
                                Bulk Edit
                            </button>
                            <button className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm">
                                Delete Roles
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Roles Table */}
            <div className={`${themeClasses.bg.secondary} rounded-xl border ${themeClasses.border.primary} overflow-hidden shadow-sm`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={`${darkMode ? 'bg-gray-900/50' : 'bg-gray-100'}`}>
                            <tr>
                                <th className={`p-4 border-b ${themeClasses.border.primary} text-left`}>
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.length === filtered.length && filtered.length > 0}
                                        onChange={selectAll}
                                        className={`rounded border-${darkMode ? 'gray-600' : 'gray-400'} ${themeClasses.bg.secondary} text-purple-500 focus:ring-purple-500/20`}
                                    />
                                </th>
                                <th className={`p-4 border-b ${themeClasses.border.primary} text-left text-sm font-semibold ${themeClasses.text.primary}`}>
                                    Role Name
                                </th>
                                <th className={`p-4 border-b ${themeClasses.border.primary} text-left text-sm font-semibold ${themeClasses.text.primary}`}>
                                    Permissions
                                </th>
                                <th className={`p-4 border-b ${themeClasses.border.primary} text-left text-sm font-semibold ${themeClasses.text.primary}`}>
                                    Users
                                </th>
                                <th className={`p-4 border-b ${themeClasses.border.primary} text-left text-sm font-semibold ${themeClasses.text.primary}`}>
                                    Created On
                                </th>
                                <th className={`p-4 border-b ${themeClasses.border.primary} text-left text-sm font-semibold ${themeClasses.text.primary}`}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((role) => (
                                <tr key={role.id} className={`hover:${darkMode ? 'bg-gray-900/30' : 'bg-gray-100/50'} transition-colors`}>
                                    <td className={`p-4 border-b ${themeClasses.border.primary}`}>
                                        <input
                                            type="checkbox"
                                            checked={selectedRoles.includes(role.id)}
                                            onChange={() => toggleSelectRole(role.id)}
                                            className={`rounded border-${darkMode ? 'gray-600' : 'gray-400'} ${themeClasses.bg.secondary} text-purple-500 focus:ring-purple-500/20`}
                                        />
                                    </td>
                                    <td className={`p-4 border-b ${themeClasses.border.primary}`}>
                                        <div>
                                            <p className={`font-medium ${themeClasses.text.primary}`}>{role.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(role.name)}`}>
                                                    {role.name}
                                                </span>
                                                {role.priority <= 2 && (
                                                    <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                                        High Priority
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className={`p-4 border-b ${themeClasses.border.primary}`}>
                                        <p className={`text-sm ${themeClasses.text.secondary} max-w-md`}>{role.permissions}</p>
                                    </td>
                                    <td className={`p-4 border-b ${themeClasses.border.primary}`}>
                                        <div className="flex items-center gap-2">
                                            <FiUser className="w-4 h-4 text-gray-400" />
                                            <span className={`font-medium ${themeClasses.text.primary}`}>{role.users}</span>
                                            <span className={`text-sm ${themeClasses.text.secondary}`}>users</span>
                                        </div>
                                    </td>
                                    <td className={`p-4 border-b ${themeClasses.border.primary}`}>
                                        <p className={themeClasses.text.primary}>{role.createdAt}</p>
                                        <p className={`text-xs ${themeClasses.text.secondary}`}>2 months ago</p>
                                    </td>
                                    <td className={`p-4 border-b ${themeClasses.border.primary}`}>
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/admin/roles/edit/${role.id}`}
                                                className={`p-2 rounded-lg ${themeClasses.bg.tertiary} border ${themeClasses.border.primary} text-purple-400 hover:text-purple-300 hover:border-purple-500/50 transition-colors`}
                                                title="Edit"
                                            >
                                                <FiEdit2 className="w-4 h-4" />
                                            </Link>
                                            <button className={`p-2 rounded-lg ${themeClasses.bg.tertiary} border ${themeClasses.border.primary} text-rose-400 hover:text-rose-300 hover:border-rose-500/50 transition-colors`}>
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center">
                                        <div className="max-w-md mx-auto">
                                            <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${themeClasses.bg.tertiary} flex items-center justify-center border ${themeClasses.border.primary}`}>
                                                <FiUser className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <h3 className={`text-lg font-medium ${themeClasses.text.primary} mb-2`}>No roles found</h3>
                                            <p className={`${themeClasses.text.secondary} mb-4`}>Try adjusting your search criteria</p>
                                            <button
                                                onClick={() => setSearch("")}
                                                className="text-purple-400 hover:text-purple-300 font-medium"
                                            >
                                                Clear search
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className={`px-6 py-4 border-t ${themeClasses.border.primary} flex items-center justify-between`}>
                    <div className={`text-sm ${themeClasses.text.secondary}`}>
                        Showing <span className={`font-medium ${themeClasses.text.primary}`}>1-{filtered.length}</span> of{" "}
                        <span className={`font-medium ${themeClasses.text.primary}`}>{roles.length}</span> roles
                    </div>
                    <div className="flex gap-2">
                        <button className={`px-3 py-2 ${themeClasses.bg.tertiary} border ${themeClasses.border.primary} rounded-lg ${themeClasses.text.secondary} hover:border-purple-500 hover:${themeClasses.text.primary} transition-colors disabled:opacity-50`}>
                            Previous
                        </button>
                        <button className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
                            1
                        </button>
                        <button className={`px-3 py-2 ${themeClasses.bg.tertiary} border ${themeClasses.border.primary} rounded-lg ${themeClasses.text.secondary} hover:border-purple-500 hover:${themeClasses.text.primary} transition-colors`}>
                            2
                        </button>
                        <button className={`px-3 py-2 ${themeClasses.bg.tertiary} border ${themeClasses.border.primary} rounded-lg ${themeClasses.text.secondary} hover:border-purple-500 hover:${themeClasses.text.primary} transition-colors`}>
                            3
                        </button>
                        <button className={`px-3 py-2 ${themeClasses.bg.tertiary} border ${themeClasses.border.primary} rounded-lg ${themeClasses.text.secondary} hover:border-purple-500 hover:${themeClasses.text.primary} transition-colors`}>
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Role Security Info */}
            <div className="mt-6 bg-purple-900/20 rounded-xl p-6 border border-purple-500/30">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <FiShield className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-lg font-semibold text-purple-300 mb-2">Role Security Status</h4>
                        <p className={themeClasses.text.primary}>
                            All role changes are logged and require approval. Principle of least privilege is enforced.
                            Last security audit: <span className="text-emerald-400 font-medium">Passed ✓</span>
                        </p>
                        <div className="flex gap-4 mt-3">
                            <span className="px-3 py-1 rounded-full text-sm bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                Approval Required
                            </span>
                            <span className="px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                Least Privilege
                            </span>
                        </div>
                    </div>
                    <FiCheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
            </div>
        </div>
    );
};

export default RoleList;
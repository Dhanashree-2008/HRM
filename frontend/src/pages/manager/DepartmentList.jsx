import React, { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { managerService } from "../../services/managerService";
import { Building, Users, CheckCircle, Search, Grid, List, Plus } from "lucide-react";

const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState("grid");

    const { isDarkMode = true } = useOutletContext() || {};

    // Theme colors synchronized with Dashboard.jsx
    const themeColors = isDarkMode ? {
        primary: '#8b5cf6',      // Purple
        secondary: '#10b981',    // Green
        accent: '#3b82f6',       // Blue
        warning: '#f59e0b',      // Amber
        danger: '#ef4444',       // Red
        background: '#0f172a',   // Dark background
        card: '#1e293b',         // Dark card
        text: '#f9fafb',         // Light text
        muted: '#9ca3af',        // Muted text
        border: '#374151',       // Border color
        inputBg: '#1e293b',      // Input background
    } : {
        primary: '#2563eb',      // Blue
        secondary: '#10b981',    // Green
        accent: '#8b5cf6',       // Purple
        warning: '#f59e0b',      // Amber
        danger: '#ef4444',       // Red
        background: '#f8fafc',   // Light slate
        card: '#ffffff',         // White
        text: '#1e293b',         // Slate 800
        muted: '#64748b',        // Slate 500
        border: '#e2e8f0',       // Light border
        inputBg: '#ffffff',      // Input background
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const data = await managerService.getDepartments();
            setDepartments(data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch departments", err);
            setError("Failed to load departments.");
        } finally {
            setLoading(false);
        }
    };

    const filteredDepartments = departments.filter(
        (dept) =>
            dept.name.toLowerCase().includes(search.toLowerCase()) ||
            (dept.head?.fullName &&
                dept.head.fullName.toLowerCase().includes(search.toLowerCase()))
    );

    if (loading) return <div className="p-6 transition-colors duration-300" style={{ backgroundColor: themeColors.background, color: themeColors.text }}>Loading departments...</div>;

    return (
        <div className="space-y-6 transition-colors duration-300" style={{ backgroundColor: themeColors.background, minHeight: '100vh', padding: '1.5rem' }}>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold transition-colors duration-300" style={{ color: themeColors.text }}>Departments</h1>
                    <p className="transition-colors duration-300" style={{ color: themeColors.muted }}>View organization departments and details</p>
                </div>
                <Link
                    to="/manager/departments/add"
                    className="flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-sm font-medium hover:opacity-90 transition-colors duration-300"
                    style={{ backgroundColor: themeColors.primary }}
                >
                    <Plus size={18} />
                    Add Department
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-xl shadow-sm p-6 border transition-colors duration-300" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium mb-1 transition-colors duration-300" style={{ color: themeColors.muted }}>Total Departments</p>
                            <p className="text-3xl font-bold transition-colors duration-300" style={{ color: themeColors.text }}>{departments.length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: `${themeColors.primary}40` }}>
                            <Building className="w-6 h-6" style={{ color: themeColors.primary }} />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl shadow-sm p-6 border transition-colors duration-300" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium mb-1 transition-colors duration-300" style={{ color: themeColors.muted }}>Total Employees</p>
                            <p className="text-3xl font-bold transition-colors duration-300" style={{ color: themeColors.text }}>
                                {departments.reduce((sum, d) => sum + (d.employeeCount || 0), 0)}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: `${themeColors.accent}40` }}>
                            <Users className="w-6 h-6" style={{ color: themeColors.accent }} />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl shadow-sm p-6 border transition-colors duration-300" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium mb-1 transition-colors duration-300" style={{ color: themeColors.muted }}>Active Departments</p>
                            <p className="text-3xl font-bold transition-colors duration-300" style={{ color: themeColors.text }}>
                                {departments.filter((d) => d.isActive).length}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: `${themeColors.secondary}40` }}>
                            <CheckCircle className="w-6 h-6" style={{ color: themeColors.secondary }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and View Toggle */}
            <div className="rounded-xl shadow-sm p-4 border transition-colors duration-300" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300" size={18} style={{ color: themeColors.muted }} />
                        <input
                            type="text"
                            placeholder="Search departments or heads..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300"
                            style={{
                                backgroundColor: themeColors.inputBg,
                                borderColor: themeColors.border,
                                color: themeColors.text,
                                '--tw-ring-color': themeColors.primary
                            }}
                        />
                    </div>

                    <div className="flex items-center gap-1 p-1 rounded-lg transition-colors duration-300" style={{ backgroundColor: isDarkMode ? themeColors.background : '#f1f5f9' }}>
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-sm font-medium`}
                            style={{
                                backgroundColor: viewMode === "grid" ? themeColors.primary : 'transparent',
                                color: viewMode === "grid" ? '#ffffff' : themeColors.muted,
                                boxShadow: viewMode === "grid" ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none'
                            }}
                        >
                            <Grid size={16} />
                            <span>Grid</span>
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-sm font-medium`}
                            style={{
                                backgroundColor: viewMode === "list" ? themeColors.primary : 'transparent',
                                color: viewMode === "list" ? '#ffffff' : themeColors.muted,
                                boxShadow: viewMode === "list" ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none'
                            }}
                        >
                            <List size={16} />
                            <span>List</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 rounded-lg border transition-colors duration-300" style={{ backgroundColor: `${themeColors.danger}20`, color: themeColors.danger, borderColor: `${themeColors.danger}40` }}>
                    {error}
                </div>
            )}

            {/* Grid View */}
            {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDepartments.map((dept) => (
                        <div
                            key={dept.id}
                            className="rounded-xl border p-6 shadow-sm hover:shadow-md transition-all duration-300"
                            style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: `${themeColors.primary}40`, color: themeColors.primary }}>
                                    <Building size={20} />
                                </div>
                                <span
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold`}
                                    style={{
                                        backgroundColor: dept.isActive ? `${themeColors.secondary}20` : `${themeColors.muted}20`,
                                        color: dept.isActive ? themeColors.secondary : themeColors.muted
                                    }}
                                >
                                    {dept.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold mb-2 transition-colors duration-300" style={{ color: themeColors.text }}>
                                {dept.name}
                            </h3>

                            <div className="space-y-2 mb-2">
                                <p className="text-sm flex justify-between transition-colors duration-300" style={{ color: themeColors.muted }}>
                                    <span className="font-medium" style={{ color: themeColors.text }}>Code:</span>
                                    <span>{dept.code || "N/A"}</span>
                                </p>
                                <p className="text-sm flex justify-between transition-colors duration-300" style={{ color: themeColors.muted }}>
                                    <span className="font-medium" style={{ color: themeColors.text }}>Head:</span>
                                    <span className="text-right truncate ml-2">{dept.head?.fullName || "Not Assigned"}</span>
                                </p>
                                <p className="text-sm flex justify-between transition-colors duration-300" style={{ color: themeColors.muted }}>
                                    <span className="font-medium" style={{ color: themeColors.text }}>Employees:</span>
                                    <span>{dept.employeeCount || 0}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
                <div className="rounded-xl shadow-sm border overflow-hidden transition-colors duration-300" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="transition-colors duration-300" style={{ backgroundColor: isDarkMode ? themeColors.background : '#f8fafc' }}>
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300" style={{ color: themeColors.muted }}>
                                        Department
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300" style={{ color: themeColors.muted }}>
                                        Head
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300" style={{ color: themeColors.muted }}>
                                        Employees
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300" style={{ color: themeColors.muted }}>
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y transition-colors duration-300" style={{ divideColor: themeColors.border }}>
                                {filteredDepartments.map((dept) => (
                                    <tr key={dept.id} className="hover:opacity-90 transition-colors duration-300" style={{ backgroundColor: themeColors.card }}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: `${themeColors.primary}40`, color: themeColors.primary }}>
                                                    <Building size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold transition-colors duration-300" style={{ color: themeColors.text }}>{dept.name}</p>
                                                    <p className="text-xs transition-colors duration-300" style={{ color: themeColors.muted }}>{dept.code || "N/A"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>
                                            {dept.head?.fullName || "Not Assigned"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>
                                            {dept.employeeCount || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-xs font-medium`}
                                                style={{
                                                    backgroundColor: dept.isActive ? `${themeColors.secondary}20` : `${themeColors.muted}20`,
                                                    color: dept.isActive ? themeColors.secondary : themeColors.muted
                                                }}
                                            >
                                                {dept.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {filteredDepartments.length === 0 && !loading && (
                <div className="rounded-xl border p-12 text-center transition-colors duration-300" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300" style={{ backgroundColor: isDarkMode ? themeColors.background : '#f1f5f9' }}>
                        <Building className="w-8 h-8 transition-colors duration-300" style={{ color: themeColors.muted }} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 transition-colors duration-300" style={{ color: themeColors.text }}>
                        No departments found
                    </h3>
                    <p className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>
                        {search ? "Try adjusting your search criteria" : "No departments to display"}
                    </p>
                </div>
            )}
        </div>
    );
};

export default DepartmentList;

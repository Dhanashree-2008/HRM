import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { managerService } from "../../services/managerService";
import { Building, Users, CheckCircle, Search, Grid, List, Plus } from "lucide-react";

const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState("grid");

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

    if (loading) return <div className="p-6">Loading departments...</div>;

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Departments</h1>
                    <p className="text-slate-600">View organization departments and details</p>
                </div>
                <Link
                    to="/manager/departments/add"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm font-medium"
                >
                    <Plus size={18} />
                    Add Department
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600 mb-1">Total Departments</p>
                            <p className="text-3xl font-bold text-slate-900">{departments.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Building className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600 mb-1">Total Employees</p>
                            <p className="text-3xl font-bold text-slate-900">
                                {departments.reduce((sum, d) => sum + (d.employeeCount || 0), 0)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600 mb-1">Active Departments</p>
                            <p className="text-3xl font-bold text-slate-900">
                                {departments.filter((d) => d.isActive).length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and View Toggle */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search departments or heads..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-sm font-medium ${viewMode === "grid"
                                ? "bg-white text-slate-800 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            <Grid size={16} />
                            <span>Grid</span>
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-sm font-medium ${viewMode === "list"
                                ? "bg-white text-slate-800 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            <List size={16} />
                            <span>List</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
                    {error}
                </div>
            )}

            {/* Grid View */}
            {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDepartments.map((dept) => (
                        <div
                            key={dept.id}
                            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                    <Building size={20} />
                                </div>
                                <span
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${dept.isActive
                                        ? "bg-green-100 text-green-700"
                                        : "bg-slate-100 text-slate-700"
                                        }`}
                                >
                                    {dept.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                                {dept.name}
                            </h3>

                            <div className="space-y-2 mb-2">
                                <p className="text-sm text-slate-600 flex justify-between">
                                    <span className="font-medium">Code:</span>
                                    <span>{dept.code || "N/A"}</span>
                                </p>
                                <p className="text-sm text-slate-600 flex justify-between">
                                    <span className="font-medium">Head:</span>
                                    <span className="text-right truncate ml-2">{dept.head?.fullName || "Not Assigned"}</span>
                                </p>
                                <p className="text-sm text-slate-600 flex justify-between">
                                    <span className="font-medium">Employees:</span>
                                    <span>{dept.employeeCount || 0}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Department
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Head
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Employees
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredDepartments.map((dept) => (
                                    <tr key={dept.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                                    <Building size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{dept.name}</p>
                                                    <p className="text-xs text-slate-500">{dept.code || "N/A"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            {dept.head?.fullName || "Not Assigned"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            {dept.employeeCount || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${dept.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-slate-100 text-slate-700"
                                                    }`}
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
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        No departments found
                    </h3>
                    <p className="text-sm text-slate-500">
                        {search ? "Try adjusting your search criteria" : "No departments to display"}
                    </p>
                </div>
            )}
        </div>
    );
};

export default DepartmentList;

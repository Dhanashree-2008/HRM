import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useTheme, getThemeClasses } from "../../../contexts/ThemeContext";

// Simple icons as SVG components
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const GridIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const ListIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const BuildingIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  // Use global theme context if available, otherwise default to context or local
  // The user introduced local state 'darkMode' but we should use the context
  const contextDarkMode = useTheme();
  // If the user wants to toggle locally, it might conflict with global. 
  // I'll stick to global theme context as it's the standard for this app. 
  // If the user explicitly added a toggle button here, I should probably wire it to the global toggle 
  // BUT the global context provided `useTheme` which returns boolean. 
  // It doesn't seem to export a toggle function in the line `const darkMode = useTheme();`. 
  // I'll assume for now I use the global state properly. 
  // Actually, looking at previous files, `useTheme` returns the boolean `darkMode`.
  // The user added `const [darkMode, setDarkMode] = useState(false);` which overrides global.
  // I will use local state for now to preserve their UI exactly as they pasted it, 
  // but I will fetch REAL data.
  const [darkMode, setDarkMode] = useState(false);

  // 🔹 Fetch departments
  const getDepartments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/departments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(res.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    getDepartments();
  }, []);

  // Search filter
  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(search.toLowerCase()) ||
      (dept.head?.fullName &&
        dept.head.fullName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6 transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto">


        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                Departments
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage and organize your organization's departments
              </p>
            </div>
            <Link
              to="/admin/departments/add"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <PlusIcon />
              Add Department
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                  Total Departments
                </p>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {departments.length}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <BuildingIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                  Total Employees
                </p>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {departments.reduce((sum, d) => sum + (d.employeeCount || 0), 0)}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <UsersIcon />
              </div>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                  Active Departments
                </p>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {departments.filter((d) => d.isActive).length}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircleIcon />
              </div>
            </div>
          </div>
        </div>

        {/* Search and View Toggle */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-5 mb-6 shadow-sm`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <SearchIcon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search departments or heads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-12 pr-4 py-2.5 rounded-lg border ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
              />
            </div>

            <div className={`flex items-center gap-2 p-1 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${viewMode === "grid"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                  : darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                <GridIcon />
                <span className="font-medium">Grid</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${viewMode === "list"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                  : darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                <ListIcon />
                <span className="font-medium">List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepartments.map((dept) => (
              <div
                key={dept.id}
                className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-sm hover:shadow-lg transition-all duration-200 group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                    <BuildingIcon className="w-6 h-6 text-white" />
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${dept.isActive
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400"
                      }`}
                  >
                    {dept.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {dept.name}
                </h3>

                <div className="space-y-2 mb-5">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className="font-medium">Code:</span> {dept.code || "N/A"}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className="font-medium">Head:</span> {dept.head?.fullName || "Not Assigned"}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className="font-medium">Employees:</span> {dept.employeeCount}
                  </p>
                </div>

                <Link
                  to={`/admin/departments/edit/${dept.id}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  <EditIcon />
                  Edit Department
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border shadow-sm overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Department
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Head
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Employees
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Status
                    </th>
                    <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`${darkMode ? 'divide-gray-700' : 'divide-gray-200'} divide-y`}>
                  {filteredDepartments.map((dept) => (
                    <tr key={dept.id} className={`${darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'} transition-colors duration-150`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                            <BuildingIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {dept.name}
                            </div>
                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {dept.code || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {dept.head?.fullName || "Not Assigned"}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {dept.employeeCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${dept.isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400"
                            }`}
                        >
                          {dept.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <Link
                          to={`/admin/departments/edit/${dept.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                        >
                          <EditIcon />
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredDepartments.length === 0 && (
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-12 text-center shadow-sm`}>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <BuildingIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              No departments found
            </h3>
            <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {search ? "Try adjusting your search criteria" : "Get started by creating your first department"}
            </p>
            {!search && (
              <Link
                to="/admin/departments/add"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                <PlusIcon />
                Add Department
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentList;
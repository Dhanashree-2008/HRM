import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiUsers,
  FiEdit2,
  FiUser,
  FiFilter,
  FiDownload,
  FiPlus,
} from "react-icons/fi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { useTheme, useThemeClasses } from "../../../contexts/ThemeContext";



const EmployeeList = () => {
  const darkMode = useTheme();
  const theme = useThemeClasses();

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH EMPLOYEES ================= */
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "/api/admin/employees",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const normalizedEmployees = res.data
        .filter(item => item.role !== "ADMIN")
        .filter(item => item.employee !== null)
        .map(item => ({
          id: item.employee.id,
          userId: item.id,
          name: item.employee.fullName,
          email: item.email,
          employeeId: item.employee.employeeCode,
          department: item.employee.department,
          role: item.employee.designation,
          joinDate: item.employee.dateOfJoining,
          status: item.employee.status || "Active",
          phone: item.employee.phone,
          location: item.employee.location,
          manager: item.employee.manager?.fullName || null,
          avatar: item.employee.profileImage || item.employee.fullName
            .split(" ")
            .map(n => n[0])
            .join(""),
          performance: 4.5,
        }));

      setEmployees(normalizedEmployees);
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  /* ================= FILTER + SORT ================= */
  const filtered = employees
    .filter(emp =>
      emp.name?.toLowerCase().includes(search.toLowerCase().trim()) ||
      emp.employeeId?.toLowerCase().includes(search.toLowerCase().trim())
    )
    .filter(emp =>
      departmentFilter === "All" ? true : emp.department === departmentFilter
    )
    .filter(emp =>
      statusFilter === "All" ? true : emp.status === statusFilter
    )
    .filter(emp =>
      roleFilter === "All" ? true : emp.role === roleFilter
    )
    .sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "joinDate-desc")
        return new Date(b.joinDate) - new Date(a.joinDate);
      if (sortBy === "joinDate-asc")
        return new Date(a.joinDate) - new Date(b.joinDate);
      return 0;
    });

  const uniqueDepartments = ["All", ...new Set(employees.map(e => e.department))];
  const uniqueRoles = ["All", ...new Set(employees.map(e => e.role))];

  /* ================= SELECTION ================= */
  const toggleSelectEmployee = id => {
    setSelectedEmployees(prev =>
      prev.includes(id)
        ? prev.filter(empId => empId !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedEmployees.length === filtered.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filtered.map(emp => emp.id));
    }
  };

  /* ================= UI HELPERS ================= */
  const getDepartmentColor = department => {
    switch (department) {
      case "IT":
        return darkMode
          ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
          : "bg-purple-100 text-purple-700 border-purple-300";
      case "HR":
        return darkMode
          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
          : "bg-emerald-100 text-emerald-700 border-emerald-300";
      case "Finance":
        return darkMode
          ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
          : "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return darkMode
          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
          : "bg-amber-100 text-amber-700 border-amber-300";
    }
  };

  const getRowHoverClass = () =>
    darkMode ? "hover:bg-gray-900/30" : "hover:bg-gray-100";

  const getHeaderBgClass = () =>
    darkMode ? "bg-gray-900/50" : "bg-gray-100";

  const getCheckboxClasses = () =>
    `rounded border-gray-400 ${
      darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-200"
    } text-purple-500 focus:ring-purple-500/20`;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${theme.text.primary} mb-2`}>
            Employee Management
          </h1>
          <p className={theme.text.secondary}>
            Search, filter, and manage all employees in the organization.
          </p>
        </div>
        <Link
          to="/admin/employees/add"
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          Add Employee
        </Link>
      </div>

      {/* FILTER / ACTION BAR */}
      <div className={`${theme.bg.secondary} rounded-xl p-6 border ${theme.border.primary} shadow-sm mb-6`}>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or employee ID..."
                className={`w-full pl-12 pr-4 py-3 ${theme.input.bg} border ${theme.input.border} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select
                className={`appearance-none pl-10 pr-8 py-3 ${theme.input.bg} border ${theme.input.border} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="All">All Departments</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
              <HiOutlineOfficeBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <select
              className={`px-4 py-3 ${theme.input.bg} border ${theme.input.border} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select
              className={`px-4 py-3 ${theme.input.bg} border ${theme.input.border} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="Software Engineer">Software Engineer</option>
              <option value="HR Manager">HR Manager</option>
              <option value="Accountant">Accountant</option>
            </select>

            <button className={`flex items-center gap-2 px-4 py-3 ${theme.input.bg} border ${theme.input.border} rounded-lg hover:border-purple-500 ${theme.text.secondary} hover:text-purple-600 transition-colors`}>
              <FiFilter />
              More Filters
            </button>
          </div>
        </div>

        {/* Batch Actions */}
        {selectedEmployees.length > 0 && (
          <div className={`mt-4 p-4 ${darkMode ? 'bg-gray-900/50' : 'bg-purple-50'} rounded-lg border border-purple-500/30 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
                {selectedEmployees.length}
              </div>
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                {selectedEmployees.length} employee{selectedEmployees.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex gap-2">
              <button className={`px-4 py-2 ${theme.bg.secondary} border ${theme.border.primary} rounded-lg text-sm ${theme.text.secondary} hover:text-purple-600 hover:border-purple-500 transition-colors`}>
                Bulk Edit
              </button>
              <button className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm">
                Deactivate
              </button>
            </div>
          </div>
        )}
      </div>

      {/* TABLE */}
      <div className={`${theme.bg.secondary} rounded-xl border ${theme.border.primary} shadow-sm overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={getHeaderBgClass()}>
              <tr>
                <th className="p-4 border-b border-gray-300 dark:border-gray-700 text-left">
                  <input
                    type="checkbox"
                    checked={selectedEmployees.length === filtered.length && filtered.length > 0}
                    onChange={selectAll}
                    className={getCheckboxClasses()}
                  />
                </th>
                <th className={`p-4 border-b ${theme.border.primary} text-left text-sm font-semibold ${theme.text.primary}`}>
                  Employee
                </th>
                <th className={`p-4 border-b ${theme.border.primary} text-left text-sm font-semibold ${theme.text.primary}`}>
                  Department
                </th>
                <th className={`p-4 border-b ${theme.border.primary} text-left text-sm font-semibold ${theme.text.primary}`}>
                  Role
                </th>
                <th className={`p-4 border-b ${theme.border.primary} text-left text-sm font-semibold ${theme.text.primary}`}>
                  Join Date
                </th>
                <th className={`p-4 border-b ${theme.border.primary} text-left text-sm font-semibold ${theme.text.primary}`}>
                  Status
                </th>
                <th className={`p-4 border-b ${theme.border.primary} text-left text-sm font-semibold ${theme.text.primary}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr key={emp.id} className={`${getRowHoverClass()} transition-colors`}>
                  <td className={`p-4 border-b ${theme.border.primary}`}>
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(emp.id)}
                      onChange={() => toggleSelectEmployee(emp.id)}
                      className={getCheckboxClasses()}
                    />
                  </td>
                  <td className={`p-4 border-b ${theme.border.primary}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-r from-purple-600 to-purple-400">
                        {emp.avatar}
                      </div>
                      <div>
                        <p className={`font-medium ${theme.text.primary}`}>{emp.name}</p>
                        <p className={`text-sm ${theme.text.secondary}`}>{emp.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs ${darkMode ? 'bg-gray-900' : 'bg-gray-200'} ${theme.text.secondary} px-2 py-1 rounded border ${theme.border.primary}`}>
                            {emp.employeeId}
                          </span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(emp.performance) ? 'text-amber-500' : 'text-gray-400'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{emp.performance}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={`p-4 border-b ${theme.border.primary}`}>
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border ${getDepartmentColor(emp.department)}`}>
                      {emp.department}
                    </span>
                  </td>
                  <td className={`p-4 border-b ${theme.border.primary} ${theme.text.primary}`}>
                    {emp.role}
                  </td>
                  <td className={`p-4 border-b ${theme.border.primary}`}>
                    <div>
                      <p className={theme.text.primary}>{emp.joinDate}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>2 years ago</p>
                    </div>
                  </td>
                  <td className={`p-4 border-b ${theme.border.primary}`}>
                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border ${
                      emp.status === "Active"
                        ? `${darkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-300'}`
                        : `${darkMode ? 'bg-gray-900/50 text-gray-300 border-gray-700' : 'bg-gray-100 text-gray-600 border-gray-300'}`
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${emp.status === "Active" ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
                      {emp.status}
                    </span>
                  </td>
                  <td className={`p-4 border-b ${theme.border.primary}`}>
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/employees/${emp.id}`}
                        className={`p-2 rounded-lg ${theme.bg.tertiary} border ${theme.border.primary} ${theme.text.secondary} hover:text-purple-600 hover:border-purple-500/50 transition-colors`}
                        title="View"
                      >
                        <FiUser className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/admin/employees/edit/${emp.id}`}
                        className={`p-2 rounded-lg ${theme.bg.tertiary} border ${theme.border.primary} ${theme.text.secondary} hover:text-purple-600 hover:border-purple-500/50 transition-colors`}
                        title="Edit"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </Link>
                      <button className={`p-2 rounded-lg ${theme.bg.tertiary} border ${theme.border.primary} ${theme.text.secondary} hover:text-purple-600 hover:border-purple-500/50 transition-colors`}>
                        <FiDownload className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <div className="max-w-md mx-auto">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${theme.bg.tertiary} border ${theme.border.primary} flex items-center justify-center`}>
                        <FiUsers className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className={`text-lg font-medium ${theme.text.primary} mb-2`}>No employees found</h3>
                      <p className={`${theme.text.secondary} mb-4`}>Try adjusting your search or filter criteria</p>
                      <button
                        onClick={() => {
                          setSearch("");
                          setDepartmentFilter("All");
                          setStatusFilter("All");
                          setRoleFilter("All");
                        }}
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`px-6 py-4 border-t ${theme.border.primary} flex items-center justify-between`}>
          <div className={`text-sm ${theme.text.secondary}`}>
            Showing <span className={`font-medium ${theme.text.primary}`}>1-{filtered.length}</span> of{" "}
            <span className={`font-medium ${theme.text.primary}`}>{employees.length}</span> employees
          </div>
          <div className="flex gap-2">
            <button className={`px-3 py-2 ${theme.bg.tertiary} border ${theme.border.primary} rounded-lg hover:border-purple-500 ${theme.text.secondary} hover:text-purple-600 transition-colors disabled:opacity-50`}>
              Previous
            </button>
            <button className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
              1
            </button>
            <button className={`px-3 py-2 ${theme.bg.tertiary} border ${theme.border.primary} rounded-lg hover:border-purple-500 ${theme.text.secondary} hover:text-purple-600 transition-colors`}>
              2
            </button>
            <button className={`px-3 py-2 ${theme.bg.tertiary} border ${theme.border.primary} rounded-lg hover:border-purple-500 ${theme.text.secondary} hover:text-purple-600 transition-colors`}>
              3
            </button>
            <button className={`px-3 py-2 ${theme.bg.tertiary} border ${theme.border.primary} rounded-lg hover:border-purple-500 ${theme.text.secondary} hover:text-purple-600 transition-colors`}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
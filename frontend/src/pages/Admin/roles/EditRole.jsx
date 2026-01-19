import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiSave, FiCheck, FiUser, FiTrash2, FiShield, FiEye, FiEdit, FiClock, FiCalendar } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { useTheme, getThemeClasses } from "../../../contexts/ThemeContext";

const EditRole = () => {
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const darkMode = useTheme();
  const themeClasses = getThemeClasses(darkMode);

  const [formData, setFormData] = useState({
    name: "HR Manager",
    description: "Manages employee data, leaves, and basic HR operations",
    permissions: {
      employeeView: true,
      employeeEdit: true,
      attendanceView: true,
      attendanceEdit: false,
      leaveView: true,
      leaveApprove: true,
      payrollView: false,
      reportsView: true,
      settingsEdit: false,
    }
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log("Fetching role data for ID:", id);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setHasChanges(true);
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handlePermissionChange = (permission) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [permission]: !formData.permissions[permission]
      }
    });
    setHasChanges(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Role name is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      setTimeout(() => {
        console.log("Updated role data:", formData);
        setIsSubmitting(false);
        setHasChanges(false);
        alert("Role updated successfully!");
      }, 1500);
    } else {
      setErrors(validationErrors);
    }
  };

  const permissionGroups = [
    {
      title: "Employee Management",
      icon: "👥",
      color: "from-blue-500 to-cyan-500",
      border: "border-blue-500/30",
      bg: "bg-blue-500/10",
      permissions: [
        { key: "employeeView", label: "View Employees", icon: <FiEye /> },
        { key: "employeeEdit", label: "Add/Edit Employees", icon: <FiEdit /> },
      ]
    },
    {
      title: "Attendance & Leaves",
      icon: "📅",
      color: "from-emerald-500 to-green-500",
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/10",
      permissions: [
        { key: "attendanceView", label: "View Attendance", icon: <FiEye /> },
        { key: "attendanceEdit", label: "Edit Attendance", icon: <FiEdit /> },
        { key: "leaveView", label: "View Leave Requests", icon: <FiEye /> },
        { key: "leaveApprove", label: "Approve/Reject Leaves", icon: <FiCheck /> },
      ]
    },
    {
      title: "Payroll & Reports",
      icon: "💰",
      color: "from-amber-500 to-orange-500",
      border: "border-amber-500/30",
      bg: "bg-amber-500/10",
      permissions: [
        { key: "payrollView", label: "View Payroll", icon: <FiEye /> },
        { key: "reportsView", label: "View Reports", icon: <FiEye /> },
      ]
    },
    {
      title: "System",
      icon: "⚙️",
      color: "from-purple-500 to-pink-500",
      border: "border-purple-500/30",
      bg: "bg-purple-500/10",
      permissions: [
        { key: "settingsEdit", label: "Edit System Settings", icon: <FiEdit /> },
      ]
    }
  ];

  const enabledPermissions = Object.values(formData.permissions).filter(v => v).length;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/roles"
            className={`p-2 rounded-lg hover:${darkMode ? 'bg-gray-700/50' : 'bg-gray-200/50'} ${themeClasses.text.secondary} hover:${themeClasses.text.primary}`}
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className={`text-3xl font-bold ${themeClasses.text.primary} mb-2`}>
              Edit Role
            </h1>
            <p className={themeClasses.text.secondary}>
              Update role permissions and access controls.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-rose-500/30 text-rose-400 rounded-lg hover:border-rose-500/50 transition-colors">
            <FiTrash2 className="w-4 h-4" />
            Delete Role
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Assigned Users",
            value: "12",
            change: "+2",
            trend: "up",
            icon: <FiUser />,
            color: "bg-purple-500/20 text-purple-400"
          },
          {
            label: "Active Permissions",
            value: `${enabledPermissions}`,
            change: "",
            trend: "neutral",
            icon: <FiShield />,
            color: "bg-emerald-500/20 text-emerald-400"
          },
          {
            label: "Created On",
            value: "2024-02-15",
            change: "",
            trend: "neutral",
            icon: <FiCalendar />,
            color: "bg-cyan-500/20 text-cyan-400"
          },
          {
            label: "Last Updated",
            value: "Now",
            change: "",
            trend: "neutral",
            icon: <FiClock />,
            color: "bg-amber-500/20 text-amber-400"
          },
        ].map((stat, index) => (
          <div key={index} className={`${themeClasses.bg.secondary} rounded-xl p-4 border ${themeClasses.border.primary} shadow-sm`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                {stat.icon}
              </div>
              {stat.trend === "up" && (
                <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-full">
                  +{stat.change}
                </span>
              )}
            </div>
            <h3 className={`text-2xl font-bold ${themeClasses.text.primary}`}>{stat.value}</h3>
            <p className={`text-sm ${themeClasses.text.secondary}`}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Role Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Role Details Card */}
          <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary} shadow-sm`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <FiUser className="w-5 h-5 text-white" />
              </div>
              <h3 className={`text-xl font-bold ${themeClasses.text.primary}`}>Role Details</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                  Role Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 ${themeClasses.input.bg} border ${errors.name ? "border-rose-500/50" : themeClasses.input.border
                    } rounded-lg ${themeClasses.input.text} focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-rose-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                  Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 ${themeClasses.input.bg} border ${themeClasses.input.border} rounded-lg ${themeClasses.input.text} focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                />
              </div>
            </div>
          </div>

          {/* Permissions Card */}
          <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary} shadow-sm`}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                  <FiShield className="w-5 h-5 text-white" />
                </div>
                <h3 className={`text-xl font-bold ${themeClasses.text.primary}`}>Permissions</h3>
              </div>
              <div className="text-sm text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">
                {enabledPermissions} of {Object.keys(formData.permissions).length} enabled
              </div>
            </div>

            <div className="space-y-6">
              {permissionGroups.map((group, groupIndex) => (
                <div key={groupIndex} className={`border ${group.border} rounded-lg overflow-hidden ${group.bg}`}>
                  <div className={`px-4 py-3 border-b ${themeClasses.border.primary}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{group.icon}</span>
                      <h4 className={`font-medium ${themeClasses.text.primary}`}>{group.title}</h4>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {group.permissions.map((permission, permIndex) => (
                        <label
                          key={permIndex}
                          className={`flex items-center gap-3 p-3 rounded-lg border ${formData.permissions[permission.key]
                              ? `border-purple-500/30 bg-purple-500/10`
                              : `${themeClasses.border.primary} hover:${darkMode ? 'bg-gray-700/50' : 'bg-gray-300/50'}`
                            } cursor-pointer transition-colors`}
                        >
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={formData.permissions[permission.key]}
                              onChange={() => handlePermissionChange(permission.key)}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 border rounded flex items-center justify-center ${formData.permissions[permission.key]
                                ? "bg-gradient-to-r from-purple-500 to-purple-700 border-purple-500"
                                : themeClasses.border.primary
                              }`}>
                              {formData.permissions[permission.key] && (
                                <FiCheck className="w-3 h-3 text-white" />
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={themeClasses.text.secondary}>{permission.icon}</span>
                            <span className={`text-sm ${themeClasses.text.secondary}`}>{permission.label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="space-y-6">
          {/* Action Card */}
          <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary} shadow-sm`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <FiSave className="w-5 h-5 text-white" />
              </div>
              <h3 className={`text-xl font-bold ${themeClasses.text.primary}`}>Actions</h3>
            </div>

            {hasChanges && (
              <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-amber-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.23 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-sm font-medium">Unsaved changes</span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting || !hasChanges}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 ${isSubmitting || !hasChanges ? "opacity-75 cursor-not-allowed" : ""
                  }`}
              >
                <div className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors ${isSubmitting || !hasChanges ? "opacity-75" : ""
                  }`}>
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </div>
              </button>
              <Link
                to="/admin/roles"
                className={`w-full block px-4 py-3 ${themeClasses.bg.secondary} border ${themeClasses.border.primary} ${themeClasses.text.secondary} text-center rounded-lg hover:${darkMode ? 'bg-gray-600/50' : 'bg-gray-300/50'} hover:${themeClasses.text.primary} font-medium transition-colors`}
              >
                Cancel
              </Link>
            </div>
          </div>

          {/* Users Card */}
          <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary} shadow-sm`}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                  <FiUser className="w-5 h-5 text-white" />
                </div>
                <h3 className={`text-xl font-bold ${themeClasses.text.primary}`}>Assigned Users</h3>
              </div>
              <span className="text-sm text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">12 users</span>
            </div>
            <div className="space-y-3">
              {["Simran Kaur", "Ankit Mehta", "Priya Patel", "Rohit Sharma"].map((user, index) => (
                <div key={index} className={`flex items-center gap-3 p-3 rounded-lg hover:${darkMode ? 'bg-gray-700/50' : 'bg-gray-300/50'} transition-colors border ${themeClasses.border.primary}`}>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-sm">
                    {user.charAt(0)}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${themeClasses.text.primary}`}>{user}</p>
                    <p className={`text-xs ${themeClasses.text.secondary}`}>HR Department</p>
                  </div>
                </div>
              ))}
              <button className="w-full text-center text-purple-400 hover:text-purple-300 text-sm font-medium pt-2 hover:underline">
                View All Users →
              </button>
            </div>
          </div>

          {/* Permission Stats */}
          <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary} shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <h4 className={`font-medium ${themeClasses.text.primary}`}>Permission Usage</h4>
              <span className="text-purple-400 font-bold bg-purple-500/10 px-3 py-1 rounded-full">{enabledPermissions}/9</span>
            </div>
            <div className="space-y-3">
              {permissionGroups.map((group, index) => {
                const groupPermissions = group.permissions;
                const enabledCount = groupPermissions.filter(p => formData.permissions[p.key]).length;
                return (
                  <div key={index}>
                    <div className={`flex justify-between text-sm ${themeClasses.text.secondary} mb-1`}>
                      <span>{group.title}</span>
                      <span>{enabledCount}/{groupPermissions.length}</span>
                    </div>
                    <div className={`h-1.5 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-full overflow-hidden`}>
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${group.color}`}
                        style={{ width: `${(enabledCount / groupPermissions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRole;
import React, { useState } from "react";
import { FiArrowLeft, FiSave, FiCheck, FiUser, FiShield, FiPlus, FiEye, FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useTheme, getThemeClasses } from "../../../contexts/ThemeContext";

const AddRole = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        permissions: {
            employeeView: false,
            employeeEdit: false,
            attendanceView: false,
            attendanceEdit: false,
            leaveView: false,
            leaveApprove: false,
            payrollView: false,
            reportsView: false,
            settingsEdit: false,
        }
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const darkMode = useTheme();
    const themeClasses = getThemeClasses(darkMode);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
                console.log("Role data to save:", formData);
                setIsSubmitting(false);
                alert("Role created successfully!");
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

    const selectAllPermissions = () => {
        const allPermissions = {};
        Object.keys(formData.permissions).forEach(key => {
            allPermissions[key] = true;
        });
        setFormData({ ...formData, permissions: allPermissions });
    };

    const clearAllPermissions = () => {
        const noPermissions = {};
        Object.keys(formData.permissions).forEach(key => {
            noPermissions[key] = false;
        });
        setFormData({ ...formData, permissions: noPermissions });
    };

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
                            Add New Role
                        </h1>
                        <p className={themeClasses.text.secondary}>
                            Define role permissions and access controls for system users.
                        </p>
                    </div>
                </div>
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
                                        } rounded-lg ${themeClasses.input.text} placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                                    placeholder="e.g., HR Manager, Department Head"
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
                                    className={`w-full px-4 py-3 ${themeClasses.input.bg} border ${themeClasses.input.border} rounded-lg ${themeClasses.input.text} placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                                    placeholder="Describe the role's purpose and responsibilities..."
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
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={selectAllPermissions}
                                    className="px-3 py-1.5 text-sm bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-colors"
                                >
                                    Select All
                                </button>
                                <button
                                    type="button"
                                    onClick={clearAllPermissions}
                                    className={`px-3 py-1.5 text-sm ${themeClasses.bg.secondary} ${themeClasses.text.secondary} border ${themeClasses.border.primary} rounded-lg hover:${darkMode ? 'bg-gray-600/50' : 'bg-gray-300/50'} hover:${themeClasses.text.primary} transition-colors`}
                                >
                                    Clear All
                                </button>
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
                    {/* Preview Card */}
                    <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary} shadow-sm`}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                                <FiEye className="w-5 h-5 text-white" />
                            </div>
                            <h3 className={`text-xl font-bold ${themeClasses.text.primary}`}>Role Preview</h3>
                        </div>
                        <div className="space-y-4">
                            <div className={`p-4 ${themeClasses.bg.tertiary} rounded-lg border ${themeClasses.border.primary}`}>
                                <p className={`text-sm ${themeClasses.text.secondary} mb-1`}>Role Name</p>
                                <p className={`font-medium ${themeClasses.text.primary}`}>
                                    {formData.name || <span className={`${themeClasses.text.secondary} italic`}>New Role</span>}
                                </p>
                            </div>
                            <div className={`p-4 ${themeClasses.bg.tertiary} rounded-lg border ${themeClasses.border.primary}`}>
                                <p className={`text-sm ${themeClasses.text.secondary} mb-2`}>Permissions Summary</p>
                                <div className="space-y-2">
                                    {Object.entries(formData.permissions).map(([key, value]) => (
                                        value && (
                                            <div key={key} className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                                <span className={`text-sm ${themeClasses.text.secondary}`}>
                                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                </span>
                                            </div>
                                        )
                                    ))}
                                    {Object.values(formData.permissions).every(v => !v) && (
                                        <p className={`text-sm ${themeClasses.text.secondary} italic`}>No permissions selected</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Card */}
                    <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary} shadow-sm`}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                                <FiSave className="w-5 h-5 text-white" />
                            </div>
                            <h3 className={`text-xl font-bold ${themeClasses.text.primary}`}>Actions</h3>
                        </div>
                        <div className="space-y-3">
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`w-full flex items-center justify-center gap-2 px-4 py-3 ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                                    }`}
                            >
                                <div className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors ${isSubmitting ? "opacity-75" : ""
                                    }`}>
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Creating Role...
                                        </>
                                    ) : (
                                        <>
                                            <FiSave className="w-5 h-5" />
                                            Save Role
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

                    {/* Quick Tips */}
                    <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <FiCheck className="w-4 h-4 text-purple-400" />
                            </div>
                            <h4 className="font-medium text-purple-400">Tips</h4>
                        </div>
                        <ul className={`text-sm ${themeClasses.text.secondary} space-y-2`}>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
                                <span>Assign minimum required permissions</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
                                <span>Regularly review and update role permissions</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
                                <span>Test role permissions before assigning to users</span>
                            </li>
                        </ul>
                    </div>

                    {/* Permission Stats */}
                    <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary} shadow-sm`}>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className={`font-medium ${themeClasses.text.primary}`}>Permission Stats</h4>
                            <span className="text-purple-400 font-bold bg-purple-500/10 px-3 py-1 rounded-full">{enabledPermissions}/9</span>
                        </div>
                        <div className="space-y-2">
                            <div className={`flex justify-between text-sm ${themeClasses.text.secondary}`}>
                                <span>Selected Permissions</span>
                                <span>{Math.round((enabledPermissions / 9) * 100)}%</span>
                            </div>
                            <div className={`h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-full overflow-hidden`}>
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"
                                    style={{ width: `${(enabledPermissions / 9) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddRole;
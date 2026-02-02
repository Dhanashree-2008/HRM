// src/pages/manager/AddRole.jsx
import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  ArrowLeft,
  Shield,
  CheckSquare,
  Square,
  CheckCircle,
} from 'lucide-react';
import roleService from '../../services/roleService';
import { toast } from 'react-hot-toast';

const AddRole = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useOutletContext();
  const [loading, setLoading] = useState(false);

  // Theme definition
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

  const [formData, setFormData] = useState({
    name: '',
    description: '',
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

  // Use the same permission structure as Admin for consistency
  const permissionsList = [
    { id: 'employeeView', label: 'View Employees', description: 'View employee list and details' },
    { id: 'employeeEdit', label: 'Manage Employees', description: 'Add and edit employees' },
    { id: 'attendanceView', label: 'View Attendance', description: 'View attendance records' },
    { id: 'attendanceEdit', label: 'Manage Attendance', description: 'Modify attendance records' },
    { id: 'leaveView', label: 'View Leaves', description: 'View leave requests' },
    { id: 'leaveApprove', label: 'Approve Leaves', description: 'Approve or reject leaves' },
    { id: 'payrollView', label: 'View Payroll', description: 'Access payroll information' },
    { id: 'reportsView', label: 'View Reports', description: 'Access system reports' },
    { id: 'settingsEdit', label: 'System Settings', description: 'Modify system settings' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePermission = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permissionId]: !prev.permissions[permissionId]
      }
    }));
  };

  const toggleAllPermissions = () => {
    const allSelected = Object.values(formData.permissions).every(Boolean);
    const newPermissions = {};
    Object.keys(formData.permissions).forEach(key => {
      newPermissions[key] = !allSelected;
    });
    setFormData(prev => ({
      ...prev,
      permissions: newPermissions
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Role name is required');
      return;
    }

    setLoading(true);
    try {
      await roleService.createRole(formData);
      toast.success('Role created successfully!');
      navigate('/manager/roles');
    } catch (error) {
      console.error('Error creating role:', error);
      toast.error(error.response?.data?.message || 'Failed to create role');
    } finally {
      setLoading(false);
    }
  };

  const selectedCount = Object.values(formData.permissions).filter(Boolean).length;
  const totalCount = Object.keys(formData.permissions).length;

  return (
    <div style={{ backgroundColor: themeColors.background, minHeight: '100vh', color: themeColors.text }} className="p-6 transition-colors duration-300">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/manager/roles')}
            style={{
              backgroundColor: themeColors.card,
              borderColor: themeColors.border,
              color: themeColors.muted
            }}
            className="p-2 border rounded-lg hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ color: themeColors.text }} className="text-2xl font-bold">Create New Role</h1>
            <p style={{ color: themeColors.muted }}>Define role permissions and access levels</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
        <div style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }} className="rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-blue-100">
              <Shield size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 style={{ color: themeColors.text }} className="text-lg font-semibold">Role Information</h2>
              <p style={{ color: themeColors.muted }} className="text-sm">Basic details about the role</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label style={{ color: themeColors.text }} className="block text-sm font-medium mb-2">
                Role Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  backgroundColor: themeColors.inputBg,
                  borderColor: themeColors.border,
                  color: themeColors.text
                }}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Department Lead"
              />
            </div>

            <div>
              <label style={{ color: themeColors.text }} className="block text-sm font-medium mb-2">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                style={{
                  backgroundColor: themeColors.inputBg,
                  borderColor: themeColors.border,
                  color: themeColors.text
                }}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of responsibilities"
              />
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }} className="rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-100">
                <CheckSquare size={24} className="text-green-600" />
              </div>
              <div>
                <h2 style={{ color: themeColors.text }} className="text-lg font-semibold">Permissions</h2>
                <p style={{ color: themeColors.muted }} className="text-sm">
                  Select permissions for this role ({selectedCount}/{totalCount} selected)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleAllPermissions}
              style={{ borderColor: themeColors.border, color: themeColors.text }}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {selectedCount === totalCount ? (
                <>
                  <CheckSquare size={16} className="text-green-600" />
                  <span>Deselect All</span>
                </>
              ) : (
                <>
                  <Square size={16} style={{ color: themeColors.muted }} />
                  <span>Select All</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {permissionsList.map(permission => (
              <button
                key={permission.id}
                type="button"
                className={`p-4 border rounded-lg cursor-pointer transition-all text-left group`}
                style={formData.permissions[permission.id] ? {
                  backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : '#f0fdf4',
                  borderColor: themeColors.secondary
                } : {
                  backgroundColor: themeColors.inputBg,
                  borderColor: themeColors.border
                }}
                onClick={() => togglePermission(permission.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium" style={{ color: formData.permissions[permission.id] ? themeColors.secondary : themeColors.text }}>
                    {permission.label}
                  </span>
                  {formData.permissions[permission.id] ? (
                    <CheckSquare size={18} className="text-green-600" />
                  ) : (
                    <Square size={18} style={{ color: themeColors.muted }} className="group-hover:text-slate-500" />
                  )}
                </div>
                <p className="text-sm" style={{ color: formData.permissions[permission.id] ? themeColors.secondary : themeColors.muted }}>
                  {permission.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/manager/roles')}
            style={{
              borderColor: themeColors.border,
              color: themeColors.text
            }}
            className="px-6 py-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span>Saving...</span>
            ) : (
              <>
                <CheckCircle size={18} />
                <span>Create Role</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRole;
// src/pages/manager/AddRole.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Shield,
  CheckSquare,
  Square,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import roleService from '../../services/roleService';
import { toast } from 'react-hot-toast';

const AddRole = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/manager/roles')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Create New Role</h1>
            <p className="text-slate-600">Define role permissions and access levels</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-blue-100">
              <Shield size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Role Information</h2>
              <p className="text-sm text-slate-600">Basic details about the role</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Role Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Department Lead"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of responsibilities"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-100">
                <CheckSquare size={24} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Permissions</h2>
                <p className="text-sm text-slate-600">
                  Select permissions for this role ({selectedCount}/{totalCount} selected)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleAllPermissions}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              {selectedCount === totalCount ? (
                <>
                  <CheckSquare size={16} className="text-green-600" />
                  <span>Deselect All</span>
                </>
              ) : (
                <>
                  <Square size={16} className="text-slate-400" />
                  <span>Select All</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {permissionsList.map(permission => (
              <div
                key={permission.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${formData.permissions[permission.id]
                    ? 'border-green-500 bg-green-50'
                    : 'border-slate-200 hover:border-slate-300'
                  }`}
                onClick={() => togglePermission(permission.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${formData.permissions[permission.id] ? 'text-green-700' : 'text-slate-700'
                    }`}>
                    {permission.label}
                  </span>
                  {formData.permissions[permission.id] ? (
                    <CheckSquare size={18} className="text-green-600" />
                  ) : (
                    <Square size={18} className="text-slate-400" />
                  )}
                </div>
                <p className={`text-sm ${formData.permissions[permission.id] ? 'text-green-600' : 'text-slate-500'
                  }`}>
                  {permission.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/manager/roles')}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
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
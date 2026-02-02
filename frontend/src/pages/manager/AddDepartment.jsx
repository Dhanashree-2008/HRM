import React, { useState, useEffect } from "react";
import { Save, ArrowLeft, Building, Users, FileText } from "lucide-react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { managerService } from "../../services/managerService";

const AddDepartment = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useOutletContext();

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
    name: "",
    code: "",
    description: "",
    headEmployeeId: "",
    isActive: true,
  });

  const [employees, setEmployees] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch employees for dropdown using managerService
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await managerService.getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Failed to fetch employees", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleStatusChange = (status) => {
    setFormData({ ...formData, isActive: status === "Active" });
  }

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Department name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const payload = {
          ...formData,
          headEmployeeId: formData.headEmployeeId ? parseInt(formData.headEmployeeId) : null
        };

        await managerService.createDepartment(payload);
        navigate("/manager/departments");
      } catch (error) {
        console.error("Error creating department:", error);
        setErrors({
          submit: error.response?.data?.message || "Failed to create department"
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  if (loading) return (
    <div style={{ backgroundColor: themeColors.background, color: themeColors.text }} className="p-6 min-h-screen">
      Loading form...
    </div>
  );

  return (
    <div style={{ backgroundColor: themeColors.background, color: themeColors.text }} className="min-h-screen p-6 transition-colors duration-300">
      <div className="w-full max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            to="/manager/departments"
            style={{
              backgroundColor: themeColors.card,
              borderColor: themeColors.border,
              color: themeColors.muted
            }}
            className="p-2 rounded-lg border hover:text-blue-600 hover:border-blue-500 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ color: themeColors.text }} className="text-2xl font-bold">
              Create New Department
            </h1>
            <p style={{ color: themeColors.muted }}>Add a new department to the organization</p>
          </div>
        </div>

        {/* Form Card */}
        <div
          style={{
            backgroundColor: themeColors.card,
            borderColor: themeColors.border
          }}
          className="rounded-xl shadow-sm border overflow-hidden"
        >
          <div
            style={{
              backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : '#f8fafc',
              borderColor: themeColors.border
            }}
            className="p-6 border-b"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Building size={24} />
              </div>
              <h2 style={{ color: themeColors.text }} className="text-lg font-semibold">Department Details</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {errors.submit && (
              <div
                style={{
                  backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2',
                  borderColor: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : '#fecaca',
                  color: themeColors.danger
                }}
                className="p-4 border rounded-lg text-sm"
              >
                {errors.submit}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Department Name */}
              <div className="space-y-2">
                <label style={{ color: themeColors.text }} className="block text-sm font-semibold">
                  Department Name *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Engineering"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    backgroundColor: themeColors.inputBg,
                    borderColor: errors.name ? themeColors.danger : themeColors.border,
                    color: themeColors.text
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.name ? 'border-red-500 bg-red-50' : ''
                    }`}
                />
                {errors.name && <p style={{ color: themeColors.danger }} className="text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Department Code */}
              <div className="space-y-2">
                <label style={{ color: themeColors.text }} className="block text-sm font-semibold">
                  Department Code
                </label>
                <input
                  type="text"
                  name="code"
                  placeholder="e.g., ENG-001"
                  value={formData.code}
                  onChange={handleChange}
                  style={{
                    backgroundColor: themeColors.inputBg,
                    borderColor: themeColors.border,
                    color: themeColors.text
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Department Head */}
              <div className="space-y-2">
                <label style={{ color: themeColors.text }} className="block text-sm font-semibold">
                  Department Head
                </label>
                <div className="relative">
                  <select
                    name="headEmployeeId"
                    value={formData.headEmployeeId}
                    onChange={handleChange}
                    style={{
                      backgroundColor: themeColors.inputBg,
                      borderColor: themeColors.border,
                      color: themeColors.text
                    }}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                  >
                    <option value="">Select Department Head (Optional)</option>
                    {employees.map(emp => {
                      const id = emp?.employee?.id || emp?.id || '';
                      const name = emp?.employee?.fullName || emp?.fullName || emp?.name || 'Unknown';
                      const designation = emp?.employee?.designation || emp?.designation || '';
                      return (
                        <option key={id || Math.random()} value={id}>
                          {name} {designation ? `- ${designation}` : ""}
                        </option>
                      );
                    })}
                  </select>
                  <Users size={16} style={{ color: themeColors.muted }} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label style={{ color: themeColors.text }} className="block text-sm font-semibold">Status</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleStatusChange("Active")}
                    style={formData.isActive ? {
                      backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : '#ecfdf5',
                      borderColor: themeColors.secondary,
                      color: themeColors.secondary
                    } : {
                      backgroundColor: themeColors.inputBg,
                      borderColor: themeColors.border,
                      color: themeColors.muted
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-all ${formData.isActive
                      ? 'ring-2 ring-green-500/20'
                      : 'hover:border-green-500'
                      }`}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange("Inactive")}
                    style={!formData.isActive ? {
                      backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2',
                      borderColor: themeColors.danger,
                      color: themeColors.danger
                    } : {
                      backgroundColor: themeColors.inputBg,
                      borderColor: themeColors.border,
                      color: themeColors.muted
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-all ${!formData.isActive
                      ? 'ring-2 ring-red-500/20'
                      : 'hover:border-red-500'
                      }`}
                  >
                    Inactive
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2 space-y-2">
                <label style={{ color: themeColors.text }} className="block text-sm font-semibold">
                  Description *
                </label>
                <textarea
                  name="description"
                  rows="4"
                  placeholder="What does this department do?"
                  value={formData.description}
                  onChange={handleChange}
                  style={{
                    backgroundColor: themeColors.inputBg,
                    borderColor: errors.description ? themeColors.danger : themeColors.border,
                    color: themeColors.text
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                />
                {errors.description && <p style={{ color: themeColors.danger }} className="text-xs mt-1">{errors.description}</p>}
              </div>
            </div>

            {/* Actions */}
            <div style={{ borderColor: themeColors.border }} className="flex justify-end gap-3 pt-4 border-t">
              <Link
                to="/manager/departments"
                style={{
                  borderColor: themeColors.border,
                  color: themeColors.muted
                }}
                className="px-6 py-2 border rounded-lg font-medium hover:bg-slate-50 transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-2 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-all flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Create Department
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDepartment;
import React, { useState, useEffect } from "react";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import { HiOutlineOfficeBuilding, HiOutlineUserGroup } from "react-icons/hi";
import { MdOutlineDescription } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { managerService } from "../../services/managerService";

const AddDepartment = () => {
  const navigate = useNavigate();
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

  if (loading) return <div className="p-6">Loading form...</div>;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/manager/departments"
          className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-500 transition-all shadow-sm"
        >
          <FiArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Create New Department
          </h1>
          <p className="text-slate-600">Add a new department to the organization</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <HiOutlineOfficeBuilding size={24} />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">Department Details</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {errors.submit}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Department Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Department Name *
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g., Engineering"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.name ? 'border-red-500 bg-red-50' : 'border-slate-300'
                  }`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Department Code */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Department Code
              </label>
              <input
                type="text"
                name="code"
                placeholder="e.g., ENG-001"
                value={formData.code}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Department Head */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Department Head
              </label>
              <select
                name="headEmployeeId"
                value={formData.headEmployeeId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="">Select Department Head (Optional)</option>
                {employees.map(emp => (
                  <option key={emp.employee?.id} value={emp.employee?.id}>
                    {emp.employee?.fullName} {emp.employee?.designation ? `- ${emp.employee.designation}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Status</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleStatusChange("Active")}
                  className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-all ${formData.isActive
                      ? 'bg-green-50 border-green-500 text-green-700 ring-2 ring-green-500/20'
                      : 'bg-white border-slate-300 text-slate-600 hover:border-green-500'
                    }`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange("Inactive")}
                  className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-all ${!formData.isActive
                      ? 'bg-red-50 border-red-500 text-red-700 ring-2 ring-red-500/20'
                      : 'bg-white border-slate-300 text-slate-600 hover:border-red-500'
                    }`}
                >
                  Inactive
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Description *
              </label>
              <textarea
                name="description"
                rows="4"
                placeholder="What does this department do?"
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.description ? 'border-red-500 bg-red-50' : 'border-slate-300'
                  }`}
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Link
              to="/manager/departments"
              className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-all"
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
                  <FiSave />
                  Create Department
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDepartment;
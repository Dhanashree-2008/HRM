import React, { useState, useEffect } from "react";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import { HiOutlineOfficeBuilding, HiOutlineUserGroup } from "react-icons/hi";
import { MdOutlineDescription } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useTheme, getThemeClasses } from "../../../contexts/ThemeContext";
import axios from "axios";

const AddDepartment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    code: "", // Added code field
    description: "",
    headEmployeeId: "",
    isActive: true,
  });

  const [employees, setEmployees] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const darkMode = useTheme();
  const themeClasses = getThemeClasses(darkMode);

  // Fetch employees for dropdown
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin/employees", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(res.data);
      } catch (error) {
        console.error("Failed to fetch employees", error);
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

    // Clear error when user types
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
    // Code might be optional or required depending on backend, assuming optional or user handles it. 
    // Backend model says checks for uniqueness but allows null? Schema says allowNull: true but unique: true.
    // If unique is true and allowNull is true, multiple nulls are allowed in some DBs but safer to send empty string as null?
    // Let's assume user inputs it.
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const token = localStorage.getItem("token");
        const payload = {
          ...formData,
          headEmployeeId: formData.headEmployeeId ? parseInt(formData.headEmployeeId) : null
        };

        await axios.post("http://localhost:5000/api/departments", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        navigate("/admin/departments");
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

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/admin/departments"
            className={`p-3 rounded-lg ${themeClasses.bg.secondary} hover:${darkMode ? "bg-gray-700" : "bg-gray-300"} ${themeClasses.text.muted} hover:${themeClasses.text.primary} border ${themeClasses.border.primary} hover:border-purple-500 transition-colors`}
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className={`text-3xl font-bold ${themeClasses.text.primary} mb-2`}>
              <HiOutlineOfficeBuilding className="inline mr-3 text-purple-400" />
              Create New Department
            </h1>
            <p className={themeClasses.text.muted}>
              Add a new department.
            </p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className={`rounded-xl border ${themeClasses.border.primary} ${themeClasses.bg.secondary} shadow-sm overflow-hidden mb-8`}>
        <div className={`p-6 border-b ${themeClasses.border.primary} ${darkMode ? "bg-gray-900/50" : "bg-gray-100/50"}`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <HiOutlineOfficeBuilding className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${themeClasses.text.primary}`}>Department Information</h2>
              <p className={`text-sm ${themeClasses.text.muted}`}>Fill in the details below</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
              {errors.submit}
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Department Name */}
              <div>
                <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-3`}>
                  <span className="flex items-center gap-2">
                    <HiOutlineOfficeBuilding className="w-4 h-4 text-purple-400" />
                    Department Name *
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Information Technology"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3.5 ${themeClasses.input.bg} border ${errors.name ? "border-red-500 ring-2 ring-red-500/20" : themeClasses.input.border
                    } rounded-lg ${themeClasses.input.text} placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Department Code */}
              <div>
                <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-3`}>
                  <span className="flex items-center gap-2">
                    <HiOutlineOfficeBuilding className="w-4 h-4 text-purple-400" />
                    Department Code
                  </span>
                </label>
                <input
                  type="text"
                  name="code"
                  placeholder="e.g., IT-01"
                  value={formData.code || ""}
                  onChange={handleChange}
                  className={`w-full px-4 py-3.5 ${themeClasses.input.bg} border ${themeClasses.input.border
                    } rounded-lg ${themeClasses.input.text} placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                />
              </div>

              {/* Department Head */}
              <div>
                <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-3`}>
                  <span className="flex items-center gap-2">
                    <HiOutlineUserGroup className="w-4 h-4 text-purple-400" />
                    Department Head
                  </span>
                </label>
                <div className={`relative rounded-lg border ${themeClasses.input.border} overflow-hidden`}>
                  <select
                    name="headEmployeeId"
                    value={formData.headEmployeeId}
                    onChange={handleChange}
                    className={`w-full px-4 py-3.5 ${themeClasses.input.bg} ${themeClasses.input.text} appearance-none focus:outline-none focus:ring-0`}
                  >
                    <option value="" className={`${themeClasses.input.bg} ${themeClasses.text.muted}`}>Select Department Head (Optional)</option>
                    {employees
                      .filter(emp => emp.employee && emp.employee.id)
                      .map(emp => (
                        <option key={emp.employee.id} value={emp.employee.id} className={`${themeClasses.input.bg} ${themeClasses.input.text}`}>
                          {emp.employee.fullName} {emp.employee.designation ? `- ${emp.employee.designation}` : ""}
                        </option>
                      ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Status */}
              <div>
                <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-3`}>
                  Status
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="Active"
                      checked={formData.isActive === true}
                      onChange={() => handleStatusChange("Active")}
                      className="sr-only"
                    />
                    <div className={`relative p-4 rounded-lg border ${formData.isActive === true
                        ? "border-emerald-500 bg-emerald-500/10"
                        : `${themeClasses.border.primary} ${themeClasses.bg.secondary} hover:border-emerald-500`
                      } transition-all`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${formData.isActive === true ? "bg-emerald-500" : darkMode ? "bg-gray-600" : "bg-gray-400"} ring-2 ${formData.isActive === true ? "ring-emerald-500/30" : darkMode ? "ring-gray-600" : "ring-gray-400"}`}></div>
                        <span className={`font-medium ${formData.isActive === true ? "text-emerald-400" : themeClasses.text.muted}`}>Active</span>
                      </div>
                    </div>
                  </label>

                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="Inactive"
                      checked={formData.isActive === false}
                      onChange={() => handleStatusChange("Inactive")}
                      className="sr-only"
                    />
                    <div className={`relative p-4 rounded-lg border ${formData.isActive === false
                        ? "border-gray-500 bg-gray-500/10"
                        : `${themeClasses.border.primary} ${themeClasses.bg.secondary} hover:border-gray-500`
                      } transition-all`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${formData.isActive === false ? "bg-gray-400" : darkMode ? "bg-gray-600" : "bg-gray-400"} ring-2 ${formData.isActive === false ? "ring-gray-500/30" : darkMode ? "ring-gray-600" : "ring-gray-400"}`}></div>
                        <span className={`font-medium ${formData.isActive === false ? "text-gray-400" : themeClasses.text.muted}`}>Inactive</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Full Width Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-3`}>
                  <span className="flex items-center gap-2">
                    <MdOutlineDescription className="w-4 h-4 text-purple-400" />
                    Description *
                  </span>
                </label>
                <textarea
                  name="description"
                  rows="4"
                  placeholder="Describe the department's purpose..."
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full px-4 py-3.5 ${themeClasses.input.bg} border ${errors.description ? "border-red-500 ring-2 ring-red-500/20" : themeClasses.input.border
                    } rounded-lg ${themeClasses.input.text} placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className={`mt-8 pt-6 border-t ${themeClasses.border.primary} flex justify-end gap-4`}>
            <Link
              to="/admin/departments"
              className={`px-6 py-3 ${themeClasses.bg.secondary} border ${themeClasses.border.primary} ${themeClasses.text.muted} hover:${themeClasses.text.primary} hover:border-gray-600 rounded-lg font-medium transition-colors`}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <FiSave className="w-5 h-5" />
                  Create Department
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Enhanced Preview Card */}
      <div className={`rounded-xl border ${themeClasses.border.primary} ${themeClasses.bg.secondary} p-6`}>
        <div className="flex items-center gap-3 mb-6">
          <h3 className={`text-xl font-bold ${themeClasses.text.primary}`}>Department Preview</h3>
        </div>

        <div className={`rounded-lg p-6 border ${themeClasses.border.primary} ${darkMode ? "bg-gray-900/50" : "bg-gray-100/50"}`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white text-lg font-bold`}>
                {formData.name?.charAt(0) || "D"}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
                    {formData.name || "New Department"}
                  </h4>
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${formData.isActive
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                    }`}>
                    {formData.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className={`${themeClasses.text.muted} text-sm`}>
                  Code: {formData.code || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <p className={`${themeClasses.text.primary} mb-6 leading-relaxed`}>
            {formData.description || "Department description will appear here..."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-900/50" : "bg-gray-100/50"} border ${themeClasses.border.primary}`}>
              <p className={`text-sm ${themeClasses.text.muted} mb-1`}>Department Head</p>
              <div className="flex items-center gap-2">
                <div>
                  <p className={`font-medium ${themeClasses.text.primary} text-sm`}>
                    {formData.headEmployeeId
                      ? (employees.find(e => e.employee?.id == formData.headEmployeeId)?.employee?.fullName || "Selected")
                      : "Not assigned"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDepartment;
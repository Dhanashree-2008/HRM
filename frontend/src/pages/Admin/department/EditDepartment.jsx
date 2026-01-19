import React, { useState, useEffect } from "react";
import { FiSave, FiArrowLeft, FiTrash2 } from "react-icons/fi";
import { HiOutlineOfficeBuilding, HiOutlineUserGroup } from "react-icons/hi";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTheme, getThemeClasses } from "../../../contexts/ThemeContext";
import axios from "axios";

const EditDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const darkMode = useTheme();
  const themeClasses = getThemeClasses(darkMode);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    headEmployeeId: "",
    isActive: true,
  });

  const [employees, setEmployees] = useState([]);
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch Department Data and Employees
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch Employees
        const empRes = await axios.get("http://localhost:5000/api/admin/employees", { headers });
        setEmployees(empRes.data);

        // Fetch Department
        const deptRes = await axios.get(`http://localhost:5000/api/departments/${id}`, { headers });
        const dept = deptRes.data;
        setFormData({
          name: dept.name,
          code: dept.code || "",
          description: dept.description || "",
          headEmployeeId: dept.headEmployeeId || "",
          isActive: dept.isActive
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        // navigate("/admin/departments"); // Redirect if not found
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
    setHasChanges(true);
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleStatusChange = (status) => {
    setFormData({ ...formData, isActive: status === "Active" });
    setHasChanges(true);
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
        const token = localStorage.getItem("token");
        const payload = {
          ...formData,
          headEmployeeId: formData.headEmployeeId ? parseInt(formData.headEmployeeId) : null
        };

        await axios.put(`http://localhost:5000/api/departments/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setHasChanges(false);
        navigate("/admin/departments");
      } catch (error) {
        console.error("Error updating department:", error);
        setErrors({ submit: "Failed to update department" });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/departments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate("/admin/departments");
    } catch (error) {
      console.error("Error deleting department:", error);
      alert(error.response?.data?.message || "Failed to delete department");
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="w-full">
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/departments"
              className={`p-3 rounded-lg ${themeClasses.bg.secondary} hover:${darkMode ? "bg-gray-700" : "bg-gray-300"} ${themeClasses.text.muted} hover:${themeClasses.text.primary} border ${themeClasses.border.primary} hover:border-purple-500 transition-colors`}
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className={`text-3xl font-bold ${themeClasses.text.primary}`}>
                Edit Department
              </h1>
              <p className={themeClasses.text.muted}>
                Update department details.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowDeleteModal(true)}
            className={`flex items-center gap-2 px-5 py-3 ${themeClasses.bg.secondary} hover:${darkMode ? "bg-gray-700" : "bg-gray-300"} border border-red-500/30 text-red-400 hover:text-red-300 rounded-lg font-medium transition-colors mt-4 lg:mt-0`}
          >
            <FiTrash2 className="w-5 h-5" />
            Delete Department
          </button>
        </div>
      </div>

      {/* Enhanced Form Container */}
      <div className={`rounded-xl p-6 border ${themeClasses.border.primary} ${themeClasses.bg.secondary} shadow-sm mb-6`}>
        <div className={`p-6 border-b ${themeClasses.border.primary} ${darkMode ? "bg-gray-900/50" : "bg-gray-100/50"}`}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center`}>
              <HiOutlineOfficeBuilding className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${themeClasses.text.primary}`}>Edit Department: {formData.name}</h2>
              <p className={`text-sm ${themeClasses.text.muted}`}>Department ID: {id}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
              {errors.submit}
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Department Name */}
              <div>
                <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-3`}>
                  <span className="flex items-center gap-2">
                    <HiOutlineOfficeBuilding className="w-4 h-4 text-purple-400" />
                    Department Name
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 ${themeClasses.input.bg} border ${errors.name ? "border-red-500" : themeClasses.input.border
                    } rounded-lg ${themeClasses.input.text} focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
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
                  value={formData.code || ""}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 ${themeClasses.input.bg} border ${themeClasses.input.border
                    } rounded-lg ${themeClasses.input.text} focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
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
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer group/status">
                    <input
                      type="radio"
                      name="status"
                      value="Active"
                      checked={formData.isActive === true}
                      onChange={() => handleStatusChange("Active")}
                      className="sr-only"
                    />
                    <div className={`relative p-4 rounded-lg border text-center transition-all ${formData.isActive === true
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                        : `${themeClasses.border.primary} ${themeClasses.text.muted} group-hover/status:border-emerald-500 ${themeClasses.bg.secondary}`
                      }`}>
                      Active
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer group/status">
                    <input
                      type="radio"
                      name="status"
                      value="Inactive"
                      checked={formData.isActive === false}
                      onChange={() => handleStatusChange("Inactive")}
                      className="sr-only"
                    />
                    <div className={`relative p-4 rounded-lg border text-center transition-all ${formData.isActive === false
                        ? "border-gray-500 bg-gray-500/10 text-gray-400"
                        : `${themeClasses.border.primary} ${themeClasses.text.muted} group-hover/status:border-gray-500 ${themeClasses.bg.secondary}`
                      }`}>
                      Inactive
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Full Width Fields */}
            <div className="lg:col-span-2">
              {/* Description */}
              <div>
                <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-3`}>
                  Description
                </label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 ${themeClasses.input.bg} border ${errors.description ? "border-red-500" : themeClasses.input.border
                    } rounded-lg ${themeClasses.input.text} focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
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
          <div className={`mt-8 pt-6 border-t ${themeClasses.border.primary} flex justify-between items-center`}>
            <div>
              {hasChanges && (
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.23 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-sm text-amber-400">You have unsaved changes</span>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Link
                to="/admin/departments"
                className={`px-6 py-3 ${themeClasses.bg.secondary} border ${themeClasses.border.primary} ${themeClasses.text.muted} hover:${themeClasses.text.primary} hover:border-gray-600 rounded-lg font-medium transition-colors`}
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || !hasChanges}
                className={`px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors ${isSubmitting || !hasChanges ? "opacity-75 cursor-not-allowed" : ""}`}
              >
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
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Enhanced Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className={`rounded-xl border ${themeClasses.border.primary} ${themeClasses.bg.secondary} shadow-xl overflow-hidden max-w-md w-full`}>
            <div className="p-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                <FiTrash2 className="w-8 h-8 text-red-400" />
              </div>
              <h3 className={`text-xl font-bold ${themeClasses.text.primary} text-center mb-3`}>
                Delete Department?
              </h3>
              <p className={`${themeClasses.text.muted} text-center mb-8`}>
                Are you sure you want to delete the "<span className={`${themeClasses.text.primary} font-medium`}>{formData.name}</span>" department? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={`flex-1 px-4 py-3.5 ${darkMode ? "bg-gray-700" : "bg-gray-300"} hover:${darkMode ? "bg-gray-600" : "bg-gray-400"} ${themeClasses.text.primary} rounded-lg font-medium transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditDepartment;
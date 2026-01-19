import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSave, FiArrowLeft, FiTrash2, FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiBriefcase, FiUpload } from "react-icons/fi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTheme, useThemeClasses } from "../../../contexts/ThemeContext";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

const darkMode = useTheme() || false; // Default to false if undefined
const theme = useThemeClasses();
  const [formData, setFormData] = useState({
    employeeId: "EMP001",
    firstName: "Rahul",
    lastName: "Sharma",
    email: "rahul.sharma@example.com",
    personalEmail: "rahul.personal@example.com",
    phone: "+91 98765 43210",
    department: "IT",
    role: "Senior Software Engineer",
    managerId: "2",
    status: "Active",
    joinDate: "2024-01-15",
    dob: "1995-05-22",
    gender: "Male",
    employmentType: "Full-time",
    location: "Mumbai, India",
    shift: "General (9 AM - 6 PM)",
    address: "123 Main Street, Andheri West, Mumbai 400053",
    qualifications: "B.Tech in Computer Science, AWS Certified",
    experience: "5 years",
    skills: "JavaScript, React, Node.js, AWS, MongoDB",
    profileImage: null,
  });

  const [errors, setErrors] = useState({});
  const [employeeStats, setEmployeeStats] = useState({
    attendance: 95,
    performance: 4.5,
    leavesUsed: 8,
    leavesRemaining: 12,
  });

  const [profileImageUrl, setProfileImageUrl] = useState(null); // existing profile image URL (if any)


  // Load employee data from backend
  useEffect(() => {
    const loadEmployee = async () => {
      const token = localStorage.getItem("token");
      if (!token) return alert("You must be logged in to edit employees.");

      try {
        const res = await axios.get(`/api/admin/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const emp = res.data;

        // Map backend fields to form fields
        const fullName = emp.fullName || "";
        const nameParts = fullName.trim().split(/\s+/);
        const firstName = nameParts.shift() || "";
        const lastName = nameParts.join(" ") || "";

        setFormData((prev) => ({
          ...prev,
          employeeId: emp.employeeCode || prev.employeeId,
          firstName,
          lastName,
          email: emp.user?.email || prev.email,
          personalEmail: emp.personalEmail || prev.personalEmail,
          phone: emp.phone || prev.phone,
          department: emp.department || prev.department,
          role: emp.designation || prev.role,
          managerId: emp.managerId ? String(emp.managerId) : prev.managerId,
          status: emp.status || prev.status,
          joinDate: emp.dateOfJoining ? emp.dateOfJoining.split("T")[0] : prev.joinDate,
          dob: emp.dateOfBirth ? emp.dateOfBirth.split("T")[0] : prev.dob,
          gender: emp.gender || prev.gender,
          employmentType: emp.employmentType || prev.employmentType,
          location: emp.location || prev.location,
          shift: emp.shift || prev.shift,
          address: emp.address || prev.address,
          qualifications: emp.qualifications || prev.qualifications,
          experience: emp.experience || prev.experience,
          skills: emp.skills || prev.skills,
        }));

        if (emp.profileImage) setProfileImageUrl(emp.profileImage);
      } catch (err) {
        console.error("Failed to load employee:", err);
        alert(err.response?.data?.message || "Failed to load employee data.");
      }
    };

    if (id) loadEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setHasChanges(true);
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, profileImage: "File size must be less than 5MB" });
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, profileImage: "File must be an image" });
        return;
      }
      setFormData({ ...formData, profileImage: file });
      setErrors({ ...errors, profileImage: "" });
      setHasChanges(true);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.role) newErrors.role = "Role is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      const payload = {
        email: formData.email,
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        employeeCode: formData.employeeId,
        department: formData.department,
        designation: formData.role,
        dateOfJoining: formData.joinDate || null,
        phone: formData.phone,
        personalEmail: formData.personalEmail,
        dateOfBirth: formData.dob || null,
        gender: formData.gender,
        location: formData.location,
        address: formData.address,
        employmentType: formData.employmentType,
        shift: formData.shift,
        status: formData.status,
        managerId: formData.managerId || null,
        qualifications: formData.qualifications,
        experience: formData.experience,
        skills: formData.skills,
      };

      await axios.put(`/api/admin/employees/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // If profile image file selected, upload it separately
      if (formData.profileImage && formData.profileImage instanceof File) {
        const fd = new FormData();
        fd.append('profile', formData.profileImage);
        const uploadRes = await axios.post(`/api/admin/employees/${id}/upload-profile`, fd, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
        if (uploadRes.data?.profileImage) setProfileImageUrl(uploadRes.data.profileImage || uploadRes.data.profileImageUrl || uploadRes.data.profileImage);
      }

      setHasChanges(false);
      alert('Employee updated successfully');
      navigate(`/admin/employees/${id}`);
    } catch (err) {
      console.error('Update failed:', err);
      setErrors({ submit: err.response?.data?.message || err.message || 'Update failed' });
      alert(err.response?.data?.message || 'Failed to update employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`/api/admin/employees/${id}/deactivate`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowDeleteModal(false);
      alert('Employee deactivated successfully');
      navigate('/admin/employees');
    } catch (err) {
      console.error('Failed to deactivate employee:', err);
      alert(err.response?.data?.message || 'Failed to deactivate employee');
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/employees"
            className={`p-2 rounded-lg ${theme.bg.secondary} border ${theme.border.primary} ${theme.text.secondary} hover:text-purple-600 hover:border-purple-500 transition-colors`}
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className={`text-3xl font-bold ${theme.text.primary} mb-2`}>
              Edit Employee
            </h1>
            <p className={theme.text.secondary}>
              Update existing employee details. All changes are tracked and reversible.
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowDeleteModal(true)}
            className={`flex items-center gap-2 px-4 py-2.5 ${theme.bg.secondary} border border-rose-600 text-rose-600 dark:text-rose-400 rounded-lg hover:border-rose-500 hover:text-rose-700 dark:hover:text-rose-300 transition-colors`}
          >
            <FiTrash2 className="w-4 h-4" />
            Delete Employee
          </button>
        </div>
      </div>

      {/* Employee Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Attendance Rate */}
        <div className={`${theme.bg.secondary} rounded-xl p-5 border ${theme.border.primary} shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme.text.secondary}`}>Attendance Rate</p>
              <h3 className={`text-3xl font-bold ${theme.text.primary} mt-2`}>{employeeStats.attendance}%</h3>
            </div>
            <div className={`w-12 h-12 rounded-full ${darkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'} flex items-center justify-center`}>
              <FiCalendar className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className={`${theme.bg.secondary} rounded-xl p-5 border ${theme.border.primary} shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme.text.secondary}`}>Performance</p>
              <h3 className={`text-3xl font-bold ${theme.text.primary} mt-2`}>{employeeStats.performance}/5.0</h3>
            </div>
            <div className={`w-12 h-12 rounded-full ${darkMode ? 'bg-amber-500/20' : 'bg-amber-100'} flex items-center justify-center`}>
              <span className="text-2xl text-amber-500 dark:text-amber-400">★</span>
            </div>
          </div>
        </div>

        {/* Leaves Used */}
        <div className={`${theme.bg.secondary} rounded-xl p-5 border ${theme.border.primary} shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme.text.secondary}`}>Leaves Used</p>
              <h3 className={`text-3xl font-bold ${theme.text.primary} mt-2`}>{employeeStats.leavesUsed}</h3>
            </div>
            <div className={`w-12 h-12 rounded-full ${darkMode ? 'bg-purple-500/20' : 'bg-purple-100'} flex items-center justify-center`}>
              <svg className="w-6 h-6 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Leaves Remaining */}
        <div className={`${theme.bg.secondary} rounded-xl p-5 border ${theme.border.primary} shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme.text.secondary}`}>Leaves Remaining</p>
              <h3 className={`text-3xl font-bold ${theme.text.primary} mt-2`}>{employeeStats.leavesRemaining}</h3>
            </div>
            <div className={`w-12 h-12 rounded-full ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'} flex items-center justify-center`}>
              <svg className="w-6 h-6 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className={`${theme.bg.secondary} rounded-xl border ${theme.border.primary} shadow-sm mb-8 overflow-hidden`}>
        <div className={`p-6 border-b ${theme.border.primary} ${darkMode ? 'bg-gray-900/50' : 'bg-gray-100'}`}>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`w-16 h-16 rounded-full border-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'} shadow-md overflow-hidden`}>
                {formData.profileImage ? (
                  <img
                    src={URL.createObjectURL(formData.profileImage)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : profileImageUrl ? (
                  <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-purple-600 to-purple-400 flex items-center justify-center text-white text-xl font-bold">
                    { (formData.firstName || '').charAt(0)}{ (formData.lastName || '').charAt(0)}
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                <FiUpload className="w-3 h-3" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <h2 className={`text-lg font-semibold ${theme.text.primary}`}>
                {formData.firstName} {formData.lastName}
              </h2>
              <p className={theme.text.secondary}>{formData.role} • {formData.department}</p>
              <p className={`text-sm ${theme.text.secondary}`}>Employee ID: {formData.employeeId}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* First Name */}
              <div>
                <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                  <span className="flex items-center gap-2">
                    <FiUser className="w-4 h-4 text-purple-400" />
                    First Name *
                  </span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 ${theme.input.bg} border ${
                    errors.firstName ? "border-rose-500" : theme.input.border
                  } rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-rose-400">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                  <span className="flex items-center gap-2">
                    <FiUser className="w-4 h-4 text-purple-400" />
                    Last Name *
                  </span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 ${theme.input.bg} border ${
                    errors.lastName ? "border-rose-500" : theme.input.border
                  } rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-rose-400">{errors.lastName}</p>
                )}
              </div>

              {/* Work Email */}
              <div>
                <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                  <span className="flex items-center gap-2">
                    <FiMail className="w-4 h-4 text-purple-400" />
                    Work Email *
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 ${theme.input.bg} border ${
                    errors.email ? "border-rose-500" : theme.input.border
                  } rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-rose-400">{errors.email}</p>
                )}
              </div>

              {/* Personal Email */}
              <div>
                <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                  <span className="flex items-center gap-2">
                    <FiMail className="w-4 h-4 text-purple-400" />
                    Personal Email
                  </span>
                </label>
                <input
                  type="email"
                  name="personalEmail"
                  value={formData.personalEmail}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 ${theme.input.bg} border ${theme.input.border} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                />
              </div>

              {/* Phone */}
              <div>
                <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                  <span className="flex items-center gap-2">
                    <FiPhone className="w-4 h-4 text-purple-400" />
                    Phone Number *
                  </span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 ${theme.input.bg} border ${
                    errors.phone ? "border-rose-500" : theme.input.border
                  } rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-rose-400">{errors.phone}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                  <span className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4 text-purple-400" />
                    Date of Birth
                  </span>
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 ${theme.input.bg} border ${theme.input.border} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                />
              </div>

              {/* Gender */}
              <div>
                <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 ${theme.input.bg} border ${theme.input.border} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                >
                  <option value="Male" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Male</option>
                  <option value="Female" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Female</option>
                  <option value="Other" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Other</option>
                  <option value="Prefer not to say" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Department */}
              <div>
                <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                  <span className="flex items-center gap-2">
                    <HiOutlineOfficeBuilding className="w-4 h-4 text-purple-400" />
                    Department *
                  </span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 ${theme.input.bg} border ${
                    errors.department ? "border-rose-500" : theme.input.border
                  } rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                >
                  <option value="IT" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Information Technology</option>
                  <option value="HR" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Human Resources</option>
                  <option value="Finance" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Finance & Accounting</option>
                  <option value="Marketing" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Marketing</option>
                  <option value="Operations" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Operations</option>
                </select>
                {errors.department && (
                  <p className="mt-1 text-sm text-rose-400">{errors.department}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                  <span className="flex items-center gap-2">
                    <FiBriefcase className="w-4 h-4 text-purple-400" />
                    Role *
                  </span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 ${theme.input.bg} border ${
                    errors.role ? "border-rose-500" : theme.input.border
                  } rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                >
                  <option value="Software Engineer" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Software Engineer</option>
                  <option value="Senior Developer" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Senior Developer</option>
                  <option value="Team Lead" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Team Lead</option>
                  <option value="Manager" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Manager</option>
                  <option value="HR Executive" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>HR Executive</option>
                  <option value="Accountant" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Accountant</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-rose-400">{errors.role}</p>
                )}
              </div>

              {/* Reporting Manager */}
              <div>
                <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                  Reporting Manager
                </label>
                <select
                  name="managerId"
                  value={formData.managerId}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 ${theme.input.bg} border ${theme.input.border} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                >
                  <option value="2" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Simran Kaur (HR Director)</option>
                  <option value="3" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Ankit Mehta (Finance Head)</option>
                  <option value="4" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Priya Patel (Marketing Head)</option>
                </select>
              </div>

              {/* Employment Type */}
              <div>
                <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                  Employment Type
                </label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 ${theme.input.bg} border ${theme.input.border} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                >
                  <option value="Full-time" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Full-time</option>
                  <option value="Part-time" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Part-time</option>
                  <option value="Contract" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Contract</option>
                  <option value="Intern" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Intern</option>
                </select>
              </div>

              {/* Join Date */}
              <div>
                <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                  <span className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4 text-purple-400" />
                    Join Date
                  </span>
                </label>
                <input
                  type="date"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 ${theme.input.bg} border ${theme.input.border} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                />
              </div>

              {/* Status */}
              <div>
                <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                  Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="Active"
                      checked={formData.status === "Active"}
                      onChange={handleChange}
                      className="text-purple-500 focus:ring-purple-500/20"
                    />
                    <span className={`px-4 py-2 rounded-lg border ${darkMode ? 'border-emerald-500/30' : 'border-emerald-400'} ${darkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'} ${darkMode ? 'text-emerald-400' : 'text-emerald-600'} font-medium`}>
                      Active
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="Inactive"
                      checked={formData.status === "Inactive"}
                      onChange={handleChange}
                      className="text-purple-500 focus:ring-purple-500/20"
                    />
                    <span className={`px-4 py-2 rounded-lg border ${theme.border.primary} ${darkMode ? 'bg-gray-900/50' : 'bg-gray-100'} ${theme.text.secondary} font-medium`}>
                      Inactive
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Full Width Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Address */}
              <div>
                <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                  <span className="flex items-center gap-2">
                    <FiMapPin className="w-4 h-4 text-purple-400" />
                    Address
                  </span>
                </label>
                <textarea
                  name="address"
                  rows="2"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 ${theme.input.bg} border ${theme.input.border} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                />
              </div>

              {/* Qualifications & Skills */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                    Qualifications
                  </label>
                  <textarea
                    name="qualifications"
                    rows="3"
                    value={formData.qualifications}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 ${theme.input.bg} border ${theme.input.border} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                    Skills
                  </label>
                  <textarea
                    name="skills"
                    rows="3"
                    value={formData.skills}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 ${theme.input.bg} border ${theme.input.border} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className={`mt-8 pt-6 border-t ${theme.border.primary} flex justify-between items-center`}>
            <div>
              {hasChanges && (
                <span className="text-sm text-amber-500 dark:text-amber-400 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.23 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  You have unsaved changes
                </span>
              )}
            </div>
            
            <div className="flex gap-3">
              <Link
                to="/admin/employees"
                className={`px-6 py-3 ${theme.bg.tertiary} border ${theme.border.primary} ${theme.text.secondary} rounded-lg hover:border-purple-500 hover:text-purple-600 transition-colors font-medium`}
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || !hasChanges}
                className={`px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors ${
                  isSubmitting || !hasChanges ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white inline mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="w-5 h-5 inline mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${theme.bg.secondary} rounded-xl shadow-lg border ${theme.border.primary} p-6 max-w-md w-full`}>
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-rose-500/20 flex items-center justify-center">
              <FiTrash2 className="w-6 h-6 text-rose-500 dark:text-rose-400" />
            </div>
            <h3 className={`text-lg font-semibold ${theme.text.primary} text-center mb-2`}>
              Delete Employee?
            </h3>
            <p className={`${theme.text.secondary} text-center mb-6`}>
              Are you sure you want to delete {formData.firstName} {formData.lastName}? This action cannot be undone and will permanently remove all employee data.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className={`flex-1 px-4 py-3 ${theme.bg.tertiary} border ${theme.border.primary} ${theme.text.secondary} rounded-lg hover:border-purple-500 hover:text-purple-600 transition-colors font-medium`}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium"
              >
                Delete Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditEmployee;

import React, { useState } from "react";
import { FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiBriefcase, FiUpload, FiArrowLeft } from "react-icons/fi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useTheme, useThemeClasses } from "../../../contexts/ThemeContext";
import axios from "axios";

const AddEmployee = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    personalEmail: "",
    phone: "",
    department: "",
    role: "",
    systemRole: "EMPLOYEE",
    managerId: "",
    status: "Active",
    joinDate: "",
    dob: "",
    gender: "",
    employmentType: "Full-time",
    location: "",
    shift: "",
    address: "",
    qualifications: "",
    experience: "",
    skills: "",
    profileImage: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const totalSteps = 3;

  const darkMode = useTheme() || false; // Default to false if undefined
  const theme = useThemeClasses();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors({ ...errors, profileImage: "File size must be less than 5MB" });
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, profileImage: "File must be an image" });
        return;
      }
      setFormData({ ...formData, profileImage: file });
      setErrors({ ...errors, profileImage: "" });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    }

    if (step === 2) {
      if (!formData.department) newErrors.department = "Department is required";
      if (!formData.role) newErrors.role = "Designation is required";
      if (!formData.joinDate) newErrors.joinDate = "Join date is required";
    }

    return newErrors;
  };

  const handleNext = () => {
    const stepErrors = validateStep(activeStep);
    if (Object.keys(stepErrors).length === 0) {
      setActiveStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      setErrors(stepErrors);
    }
  };

  const handlePrev = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allErrors = validateStep(1);
    const step2Errors = validateStep(2);
    const finalErrors = { ...allErrors, ...step2Errors };

    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      setActiveStep(1);
      return;
    }

    setIsSubmitting(true);

    try {
      // Combine firstName and lastName into fullName
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      // Prepare data for API (password will be auto-generated on backend)
      const employeeData = {
        email: formData.email,
        // password is auto-generated: lastname + 4 random digits
        role: formData.systemRole, // Use the explicit system role
        fullName,
        employeeCode: formData.employeeId,
        department: formData.department,
        designation: formData.role,
        dateOfJoining: formData.joinDate,
        phone: formData.phone,
        personalEmail: formData.personalEmail || formData.email,
        dateOfBirth: formData.dob,
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
        profileImage: formData.profileImage, // Handle file upload separately if needed
      };

      const token = localStorage.getItem("token");
      const response = await axios.post("/api/admin/employees", employeeData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Show success message
      const emailAddresses = response.data.credentialsSentTo || [formData.email];
      alert(
        `Employee created successfully!\n\n` +
        `Login credentials have been sent to:\n` +
        `${emailAddresses.join(", ")}\n\n` +
        `Password format: Lastname + 4 random digits`
      );

      // Navigate back to employee list
      navigate("/admin/employees");
    } catch (error) {
      console.error("Error creating employee:", error);
      const errorMessage = error.response?.data?.message || "Failed to create employee. Please try again.";
      alert(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/admin/employees"
          className={`p-2 rounded-lg ${theme.bg.secondary} border ${theme.border.primary} ${theme.text.secondary} hover:text-white hover:border-purple-500 transition-colors`}
        >
          <FiArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className={`text-3xl font-bold ${theme.text.primary} mb-2`}>
            Add New Employee
          </h1>
          <p className={theme.text.secondary}>
            Fill in core HR & employment details. All fields marked with * are required.
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className={`${theme.bg.secondary} rounded-xl p-6 border ${theme.border.primary} shadow-sm mb-6`}>
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 font-medium ${step === activeStep
                ? "border-purple-500 bg-purple-500 text-white"
                : step < activeStep
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : `${theme.border.primary} ${theme.text.muted}`
                }`}>
                {step < activeStep ? "✓" : step}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${step === activeStep ? "text-purple-400" :
                  step < activeStep ? "text-emerald-400" : theme.text.muted
                  }`}>
                  {step === 1 ? "Personal Info" : step === 2 ? "Employment" : "Additional Details"}
                </p>
              </div>
              {step < 3 && (
                <div className={`h-0.5 w-16 mx-4 ${step < activeStep ? "bg-emerald-500" : darkMode ? "bg-gray-700" : "bg-gray-300"
                  }`}></div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {activeStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Image */}
                <div className="lg:col-span-2">
                  <label className={`block text-sm font-medium ${theme.text.secondary} mb-4`}>
                    Profile Image
                  </label>
                  <div className="flex items-center gap-6">
                    <div className={`w-32 h-32 rounded-full border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-400'} flex items-center justify-center overflow-hidden ${darkMode ? 'bg-gray-900/50' : 'bg-gray-100'}`}>
                      {formData.profileImage ? (
                        <img
                          src={URL.createObjectURL(formData.profileImage)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <FiUser className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <span className="text-sm text-gray-500">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className={`inline-flex items-center gap-2 px-4 py-3 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} border ${theme.border.primary} rounded-lg hover:border-purple-500 cursor-pointer ${theme.text.secondary} hover:text-purple-600 transition-colors`}>
                        <FiUpload className="w-5 h-5" />
                        Upload Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-sm text-gray-500 mt-2">
                        Recommended: Square image, 500x500px, max 5MB
                      </p>
                      {errors.profileImage && (
                        <p className="text-sm text-rose-400 mt-1">{errors.profileImage}</p>
                      )}
                    </div>
                  </div>
                </div>

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
                    className={`w-full px-4 py-3 ${theme.input.bg} border ${errors.firstName ? "border-rose-500" : theme.input.border
                      } rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                    placeholder="Enter first name"
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
                    className={`w-full px-4 py-3 ${theme.input.bg} border ${errors.lastName ? "border-rose-500" : theme.input.border
                      } rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                    placeholder="Enter last name"
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
                    className={`w-full px-4 py-3 ${theme.input.bg} border ${errors.email ? "border-rose-500" : theme.input.border
                      } rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                    placeholder="employee@company.com"
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
                    placeholder="personal@email.com"
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
                    className={`w-full px-4 py-3 ${theme.input.bg} border ${errors.phone ? "border-rose-500" : theme.input.border
                      } rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                    placeholder="+91 98765 43210"
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
                    <option value="" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Select Gender</option>
                    <option value="Male" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Male</option>
                    <option value="Female" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Female</option>
                    <option value="Other" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Other</option>
                    <option value="Prefer not to say" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Prefer not to say</option>
                  </select>
                </div>

                {/* Address */}
                <div className="lg:col-span-2">
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
                    placeholder="Complete residential address"
                  />
                </div>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Employee ID */}
                <div>
                  <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                    Employee ID
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 ${theme.input.bg} border ${theme.input.border} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                    placeholder="EMP001"
                  />
                  <p className="text-sm text-gray-500 mt-1">Auto-generated if left empty</p>
                </div>

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
                    className={`w-full px-4 py-3 ${theme.input.bg} border ${errors.department ? "border-rose-500" : theme.input.border
                      } rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                  >
                    <option value="" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Select Department</option>
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
                      Designation *
                    </span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 ${theme.input.bg} border ${errors.role ? "border-rose-500" : theme.input.border
                      } rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                  >
                    <option value="" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Select Designation</option>
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

                {/* System Role */}
                <div>
                  <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                    <span className="flex items-center gap-2">
                      <FiBriefcase className="w-4 h-4 text-purple-400" />
                      System Access Role *
                    </span>
                  </label>
                  <select
                    name="systemRole"
                    value={formData.systemRole}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 ${theme.input.bg} border ${theme.input.border} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                  >
                    <option value="EMPLOYEE" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Employee (Standard Access)</option>
                    <option value="MANAGER" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Manager (Team Access)</option>
                    <option value="ADMIN" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Admin (Full Access)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Determines system permissions/privileges.</p>
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
                    <option value="" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Select Manager</option>
                    <option value="1" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Rahul Sharma (IT Manager)</option>
                    <option value="2" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Simran Kaur (HR Director)</option>
                    <option value="3" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Ankit Mehta (Finance Head)</option>
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
                    <option value="Freelance" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Freelance</option>
                  </select>
                </div>

                {/* Join Date */}
                <div>
                  <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                    <span className="flex items-center gap-2">
                      <FiCalendar className="w-4 h-4 text-purple-400" />
                      Join Date *
                    </span>
                  </label>
                  <input
                    type="date"
                    name="joinDate"
                    value={formData.joinDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 ${theme.input.bg} border ${errors.joinDate ? "border-rose-500" : theme.input.border
                      } rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                  />
                  {errors.joinDate && (
                    <p className="mt-1 text-sm text-rose-400">{errors.joinDate}</p>
                  )}
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

                {/* Location */}
                <div>
                  <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                    <span className="flex items-center gap-2">
                      <FiMapPin className="w-4 h-4 text-purple-400" />
                      Work Location
                    </span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 ${theme.input.bg} border ${theme.input.border} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                    placeholder="e.g., Mumbai Office"
                  />
                </div>

                {/* Shift */}
                <div>
                  <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                    Shift
                  </label>
                  <input
                    type="text"
                    name="shift"
                    value={formData.shift}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 ${theme.input.bg} border ${theme.input.border} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                    placeholder="e.g., General (9 AM - 6 PM)"
                  />
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                    Qualifications
                  </label>
                  <textarea
                    name="qualifications"
                    rows="2"
                    value={formData.qualifications}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 ${theme.input.bg} border ${theme.input.border} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                    placeholder="Educational qualifications and certifications"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                    Experience
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 ${theme.input.bg} border ${theme.input.border} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                    placeholder="e.g., 5 years"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                    Skills
                  </label>
                  <textarea
                    name="skills"
                    rows="2"
                    value={formData.skills}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 ${theme.input.bg} border ${theme.input.border} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${theme.input.text} transition-all`}
                    placeholder="Comma separated skills e.g., JavaScript, React, Project Management"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className={`mt-8 pt-6 border-t ${theme.border.primary} flex justify-between`}>
            <div>
              {activeStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className={`px-6 py-3 ${theme.bg.tertiary} border ${theme.border.primary} ${theme.text.secondary} rounded-lg hover:border-purple-500 hover:text-purple-600 transition-colors font-medium`}
                >
                  Previous
                </button>
              )}
            </div>

            <div className="flex gap-3">
              {activeStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white inline mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating Employee...
                    </>
                  ) : (
                    "Create Employee"
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Preview Section */}
      <div className={`${theme.bg.secondary} rounded-xl p-6 border ${theme.border.primary} shadow-sm`}>
        <h3 className={`text-lg font-semibold ${theme.text.primary} mb-4`}>Employee Preview</h3>
        <div className={`flex items-center gap-4 p-4 rounded-lg ${darkMode ? 'bg-gray-900/50' : 'bg-gray-100'} border ${theme.border.primary}`}>
          <div className={`w-20 h-20 rounded-full border-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'} flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            {formData.profileImage ? (
              <img
                src={URL.createObjectURL(formData.profileImage)}
                alt="Preview"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <FiUser className="w-10 h-10 text-gray-400" />
            )}
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">
              {formData.firstName} {formData.lastName || "New Employee"}
            </h4>
            <p className={theme.text.secondary}>
              {formData.role || "Designation"} • {formData.department || "Department"}
            </p>
            <div className="flex gap-4 mt-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">{formData.email || "email@company.com"}</span>
              <span className={`px-3 py-1 text-xs rounded-full ${formData.status === "Active"
                ? `${darkMode ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border border-emerald-300'}`
                : `${darkMode ? 'bg-gray-900/50 text-gray-300 border border-gray-700' : 'bg-gray-100 text-gray-600 border border-gray-300'}`
                }`}>
                {formData.status || "Status"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;

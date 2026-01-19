import React, { useState } from "react";
import { FiArrowLeft, FiUpload, FiFileText, FiCheck, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useTheme, useThemeClasses} from "../../../contexts/ThemeContext";

const UploadDocument = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    documentType: "",
    category: "",
    description: "",
    confidentialLevel: "Medium",
    expiryDate: "",
    file: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const darkMode = useTheme();
  const theme = useThemeClasses();

  const employees = [
    { id: "EMP001", name: "Rahul Sharma" },
    { id: "EMP002", name: "Simran Kaur" },
    { id: "EMP003", name: "Ankit Mehta" },
    { id: "EMP004", name: "Priya Patel" },
    { id: "EMP005", name: "Rohit Sharma" },
  ];

  const documentTypes = [
    "Offer Letter", "Employment Contract", "Salary Slip", "NDA Agreement",
    "Performance Review", "Background Check", "Education Certificate",
    "ID Proof", "Address Proof", "Experience Letter"
  ];

  const categories = [
    "Employment", "Payroll", "Legal", "HR", "Verification", "Personal"
  ];

  const confidentialLevels = [
    { value: "Low", label: "Low", color: darkMode ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-green-100 text-green-800 border border-green-200" },
    { value: "Medium", label: "Medium", color: darkMode ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-amber-100 text-amber-800 border border-amber-200" },
    { value: "High", label: "High", color: darkMode ? "bg-orange-500/20 text-orange-300 border border-orange-500/30" : "bg-orange-100 text-orange-800 border border-orange-200" },
    { value: "Strict", label: "Strict", color: darkMode ? "bg-red-500/20 text-red-300 border border-red-500/30" : "bg-red-100 text-red-800 border border-red-200" },
  ];

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
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setErrors({ ...errors, file: "File size must be less than 10MB" });
        return;
      }
      
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setErrors({ ...errors, file: "Only PDF, DOC, DOCX, JPG, PNG files are allowed" });
        return;
      }

      setFormData({ ...formData, file });
      setErrors({ ...errors, file: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.employeeId) newErrors.employeeId = "Employee is required";
    if (!formData.documentType) newErrors.documentType = "Document type is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.file) newErrors.file = "File is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            console.log("Document uploaded:", formData);
            setIsSubmitting(false);
            setUploadProgress(0);
            alert("Document uploaded successfully!");
            
            // Reset form
            setFormData({
              employeeId: "",
              documentType: "",
              category: "",
              description: "",
              confidentialLevel: "Medium",
              expiryDate: "",
              file: null,
            });
          }, 500);
        }
      }, 200);
    } else {
      setErrors(validationErrors);
    }
  };

  const removeFile = () => {
    setFormData({ ...formData, file: null });
  };

  // Helper functions for theme classes
  const getBgColor = () => darkMode ? "bg-gray-800" : "bg-white";
  const getBorderColor = () => darkMode ? "border-gray-700" : "border-gray-200";
  const getTextColor = () => darkMode ? "text-white" : "text-gray-800";
  const getSecondaryTextColor = () => darkMode ? "text-gray-400" : "text-gray-600";
  const getInputBg = () => darkMode ? "bg-gray-900" : "bg-gray-50";
  const getCardBg = () => darkMode ? "bg-gray-700/50" : "bg-gray-100";

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/admin/vault"
          className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'} ${getSecondaryTextColor()} hover:text-purple-600`}
        >
          <FiArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className={`text-3xl font-bold ${getTextColor()} mb-2`}>
            Upload Document
          </h1>
          <p className={getSecondaryTextColor()}>
            Securely upload confidential employee documents to the vault.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Document Details Card */}
          <div className={`${getBgColor()} rounded-xl p-6 border ${getBorderColor()} shadow-sm`}>
            <h3 className={`text-lg font-semibold ${getTextColor()} mb-4`}>Document Details</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Employee Selection */}
                <div>
                  <label className={`block text-sm font-medium ${getTextColor()} mb-2`}>
                    Employee *
                  </label>
                  <select
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 ${getInputBg()} border ${
                      errors.employeeId ? "border-rose-500" : getBorderColor()
                    } rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${getTextColor()} transition-all`}
                  >
                    <option value="" className={darkMode ? "bg-gray-800" : "bg-white"}>Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id} className={darkMode ? "bg-gray-800" : "bg-white"}>
                        {emp.name} ({emp.id})
                      </option>
                    ))}
                  </select>
                  {errors.employeeId && (
                    <p className="mt-1 text-sm text-rose-400">{errors.employeeId}</p>
                  )}
                </div>

                {/* Document Type */}
                <div>
                  <label className={`block text-sm font-medium ${getTextColor()} mb-2`}>
                    Document Type *
                  </label>
                  <select
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 ${getInputBg()} border ${
                      errors.documentType ? "border-rose-500" : getBorderColor()
                    } rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${getTextColor()} transition-all`}
                  >
                    <option value="" className={darkMode ? "bg-gray-800" : "bg-white"}>Select Type</option>
                    {documentTypes.map(type => (
                      <option key={type} value={type} className={darkMode ? "bg-gray-800" : "bg-white"}>{type}</option>
                    ))}
                  </select>
                  {errors.documentType && (
                    <p className="mt-1 text-sm text-rose-400">{errors.documentType}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className={`block text-sm font-medium ${getTextColor()} mb-2`}>
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 ${getInputBg()} border ${
                      errors.category ? "border-rose-500" : getBorderColor()
                    } rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${getTextColor()} transition-all`}
                  >
                    <option value="" className={darkMode ? "bg-gray-800" : "bg-white"}>Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat} className={darkMode ? "bg-gray-800" : "bg-white"}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-rose-400">{errors.category}</p>
                  )}
                </div>

                {/* Confidential Level */}
                <div>
                  <label className={`block text-sm font-medium ${getTextColor()} mb-2`}>
                    Confidentiality Level
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {confidentialLevels.map(level => (
                      <label
                        key={level.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="confidentialLevel"
                          value={level.value}
                          checked={formData.confidentialLevel === level.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <span className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.confidentialLevel === level.value
                            ? level.color + " ring-2 ring-offset-1 ring-offset-gray-800 ring-opacity-50"
                            : `${getInputBg()} ${getSecondaryTextColor()} hover:${darkMode ? 'bg-gray-600' : 'bg-gray-200'} hover:text-gray-800`
                        }`}>
                          {level.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Expiry Date */}
                <div>
                  <label className={`block text-sm font-medium ${getTextColor()} mb-2`}>
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 ${getInputBg()} border ${getBorderColor()} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${getTextColor()} transition-all`}
                  />
                  <p className="text-xs text-gray-400 mt-1">Leave empty if no expiry</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={`block text-sm font-medium ${getTextColor()} mb-2`}>
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 ${getInputBg()} border ${getBorderColor()} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${getTextColor()} transition-all placeholder-gray-400`}
                  placeholder="Add any additional notes or description about this document..."
                />
              </div>
            </form>
          </div>

          {/* File Upload Card */}
          <div className={`${getBgColor()} rounded-xl p-6 border ${getBorderColor()} shadow-sm`}>
            <h3 className={`text-lg font-semibold ${getTextColor()} mb-4`}>File Upload</h3>
            
            {!formData.file ? (
              <div className={`border-2 border-dashed ${getBorderColor()} rounded-xl p-8 text-center ${getCardBg()}`}>
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${getInputBg()} flex items-center justify-center`}>
                  <FiUpload className="w-8 h-8 text-gray-500" />
                </div>
                <h4 className={`text-lg font-medium ${getTextColor()} mb-2`}>Upload Document</h4>
                <p className={`${getSecondaryTextColor()} mb-4`}>
                  Drag and drop your file here or click to browse
                </p>
                <label className="relative group inline-flex items-center gap-2 px-6 py-3 rounded-lg cursor-pointer">
                  <div className="relative bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow hover:shadow-md">
                    <div className="flex items-center gap-2 px-6 py-3">
                      <FiUpload className="w-5 h-5" />
                      Browse Files
                    </div>
                  </div>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </label>
                <p className="text-sm text-gray-500 mt-4">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                </p>
              </div>
            ) : (
              <div className={`border ${getBorderColor()} rounded-xl p-6 ${getCardBg()}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg ${darkMode ? 'bg-emerald-500/10' : 'bg-emerald-100'} flex items-center justify-center border ${darkMode ? 'border-emerald-500/30' : 'border-emerald-200'}`}>
                      <FiFileText className={`w-6 h-6 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-white">{formData.file.name}</p>
                      <p className={`text-sm ${getSecondaryTextColor()}`}>
                        {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeFile}
                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'} text-rose-400 hover:text-rose-300`}
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                
                {isSubmitting && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className={`h-2 ${getInputBg()} rounded-full overflow-hidden`}>
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {errors.file && (
              <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg">
                <p className="text-sm text-rose-400">{errors.file}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="space-y-6">
          {/* Preview Card */}
          <div className={`${getBgColor()} rounded-xl p-6 border ${getBorderColor()} shadow-sm`}>
            <h3 className={`text-lg font-semibold ${getTextColor()} mb-4`}>Document Preview</h3>
            <div className="space-y-4">
              <div className={`p-4 ${getCardBg()} rounded-xl border ${getBorderColor()}`}>
                <p className={`text-sm ${getSecondaryTextColor()} mb-1`}>Employee</p>
                <p className={`font-medium ${getTextColor()}`}>
                  {formData.employeeId 
                    ? employees.find(e => e.id === formData.employeeId)?.name || "Not selected"
                    : "Not selected"
                  }
                </p>
              </div>
              <div className={`p-4 ${getCardBg()} rounded-xl border ${getBorderColor()}`}>
                <p className={`text-sm ${getSecondaryTextColor()} mb-1`}>Document Type</p>
                <p className={`font-medium ${getTextColor()}`}>
                  {formData.documentType || "Not selected"}
                </p>
              </div>
              <div className={`p-4 ${getCardBg()} rounded-xl border ${getBorderColor()}`}>
                <p className={`text-sm ${getSecondaryTextColor()} mb-1`}>Confidentiality</p>
                <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${
                  confidentialLevels.find(l => l.value === formData.confidentialLevel)?.color || `${getInputBg()} ${getSecondaryTextColor()}`
                }`}>
                  {formData.confidentialLevel}
                </span>
              </div>
              {formData.file && (
                <div className={`p-4 ${darkMode ? 'bg-emerald-500/10' : 'bg-emerald-100'} border ${darkMode ? 'border-emerald-500/30' : 'border-emerald-200'} rounded-xl`}>
                  <div className={`flex items-center gap-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    <FiCheck className="w-5 h-5" />
                    <span className="font-medium">File ready for upload</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions Card */}
          <div className={`${getBgColor()} rounded-xl p-6 border ${getBorderColor()} shadow-sm`}>
            <h3 className={`text-lg font-semibold ${getTextColor()} mb-4`}>Actions</h3>
            <div className="space-y-3">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg shadow font-medium transition-all ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""}`}
              >
                <div className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium ${
                  isSubmitting
                    ? `${darkMode ? 'bg-emerald-500/30' : 'bg-emerald-100'} ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}>
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FiUpload className="w-5 h-5" />
                      Upload Document
                    </>
                  )}
                </div>
              </button>
              <Link
                to="/admin/vault"
                className={`w-full block px-4 py-3 border ${getBorderColor()} ${getSecondaryTextColor()} text-center rounded-lg ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'} hover:text-purple-600 font-medium`}
              >
                Cancel
              </Link>
            </div>
          </div>

          {/* Security Tips */}
          <div className={`${darkMode ? 'bg-purple-900/20' : 'bg-purple-50'} border ${darkMode ? 'border-purple-500/20' : 'border-purple-200'} rounded-xl p-4`}>
            <h4 className={`font-medium ${darkMode ? 'text-purple-300' : 'text-purple-700'} mb-2`}>Security Guidelines</h4>
            <ul className={`text-sm ${darkMode ? 'text-purple-200' : 'text-purple-600'} space-y-1`}>
              <li className="flex items-start gap-2">
                <FiCheck className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-500'} mt-0.5 flex-shrink-0`} />
                <span>Only upload necessary documents</span>
              </li>
              <li className="flex items-start gap-2">
                <FiCheck className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-500'} mt-0.5 flex-shrink-0`} />
                <span>Set appropriate confidentiality levels</span>
              </li>
              <li className="flex items-start gap-2">
                <FiCheck className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-500'} mt-0.5 flex-shrink-0`} />
                <span>Review before uploading sensitive data</span>
              </li>
              <li className="flex items-start gap-2">
                <FiCheck className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-500'} mt-0.5 flex-shrink-0`} />
                <span>Set expiry dates for time-sensitive docs</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDocument;
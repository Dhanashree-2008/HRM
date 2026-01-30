// src/pages/manager/UploadDocument.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  Upload,
  FileText,
  Lock,
  Calendar,
  X,
  CheckCircle,
  AlertCircle,
  User
} from 'lucide-react';

const UploadDocument = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    employeeId: '',
    title: '', // Backend expects 'documentType' as the main "type" label, maybe we use title as type?
    // Admin uses 'documentType' dropdown. Manager has 'title' input.
    // I'll map 'title' to 'documentType' or 'description'. 
    // Let's use 'documentType' dropdown for consistency with Admin, 
    // OR allow custom type via Title.
    // Admin: has specific Document Types (Offer Letter, etc). 
    // Manager might want flexibility. 
    // Backend `uploadDocument` uses: { employeeId, documentType, category, description, confidentialLevel, expiryDate }
    // I will add a proper Document Type select and map Title to Description if needed.
    documentType: '',
    category: '',
    description: '',
    confidentialLevel: 'Medium',
    expiryDate: ''
  });

  const categories = [
    'Employment', 'Payroll', 'Legal', 'HR', 'Verification', 'Personal', 'Policy', 'Reports', 'Other'
  ];

  const documentTypes = [
    "Offer Letter", "Employment Contract", "Salary Slip", "NDA Agreement",
    "Performance Review", "Background Check", "Education Certificate",
    "ID Proof", "Address Proof", "Experience Letter", "Other"
  ];

  const confidentialLevels = ['Low', 'Medium', 'High', 'Strict'];

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/admin/employees", {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Admin route returns array of users or object { employees: [] }
      // Based on Admin UploadDocument.jsx:
      let empList = [];
      if (Array.isArray(response.data)) {
        empList = response.data
          .filter(user => user.employee)
          .map(user => ({
            id: user.employee.id,
            name: user.employee.fullName,
            code: user.employee.employeeCode
          }));
      } else if (response.data.employees) {
        empList = response.data.employees.map(emp => ({
          id: emp.id,
          name: emp.fullName,
          code: emp.employeeCode
        }));
      }
      setEmployees(empList);
    } catch (error) {
      console.error("Failed to fetch employees", error);
      toast.error("Failed to load employee list");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !formData.employeeId || !formData.documentType || !formData.category) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    const data = new FormData();
    data.append("employeeId", formData.employeeId);
    data.append("documentType", formData.documentType);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("confidentialLevel", formData.confidentialLevel);
    if (formData.expiryDate) data.append("expiryDate", formData.expiryDate);
    data.append("file", file);

    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/documents/upload", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      toast.success("Document uploaded successfully!");
      navigate('/manager/vault');
    } catch (error) {
      console.error("Upload error", error);
      toast.error(error.response?.data?.message || "Failed to upload document");
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/manager/vault')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Upload Document</h1>
            <p className="text-slate-600">Upload and manage documents in secure vault</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Details Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-blue-100">
                <FileText size={24} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Document Details</h2>
                <p className="text-sm text-slate-600">Enter document information</p>
              </div>
            </div>

            <form id="uploadForm" onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <User size={14} className="inline mr-1" />
                  Employee *
                </label>
                <select
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Document Type *
                  </label>
                  <select
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select Type</option>
                    {documentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the document content..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Lock size={14} className="inline mr-1" />
                    Confidentiality Level
                  </label>
                  <select
                    name="confidentialLevel"
                    value={formData.confidentialLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {confidentialLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={14} className="inline mr-1" />
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-purple-100">
                <Upload size={24} className="text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Upload File</h2>
                <p className="text-sm text-slate-600">Select file to upload</p>
              </div>
            </div>

            <div className="mb-6">
              {!file ? (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    disabled={loading}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <Upload size={48} className="text-slate-400 mb-4" />
                      <p className="text-slate-600 mb-2">Click to upload or drag and drop</p>
                      <p className="text-sm text-slate-500">PDF, DOC, JPG, PNG (Max 10MB)</p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <FileText className="text-blue-500" size={24} />
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                        <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    {!loading && (
                      <button onClick={removeFile} className="p-1 hover:bg-red-50 rounded">
                        <X size={16} className="text-red-500" />
                      </button>
                    )}
                  </div>
                  {loading && (
                    <div className="mt-2">
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 text-right">{uploadProgress}%</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button
                form="uploadForm"
                type="submit"
                disabled={loading || !file}
                className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${loading || !file
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    <span>Upload Document</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/manager/vault')}
                disabled={loading}
                className="w-full py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  Documents are encrypted and stored securely. Ensure you have authorization.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDocument;
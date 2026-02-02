import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Upload,
  FileText,
  Lock,
  Calendar,
  X,
  AlertCircle,
  User,
} from "lucide-react";
// import { useTheme } from "@/context/ThemeContext";

const UploadDocument = () => {
  const navigate = useNavigate();

  // const { isDarkMode } = useTheme();
  const isDarkMode = false; // replace with real theme state

  const themeColors = isDarkMode
    ? {
      primary: "#8b5cf6",
      secondary: "#10b981",
      accent: "#3b82f6",
      warning: "#f59e0b",
      danger: "#ef4444",
      background: "#0f172a",
      card: "#1e293b",
      text: "#f9fafb",
      muted: "#9ca3af",
      border: "#374151",
    }
    : {
      primary: "#2563eb",
      secondary: "#10b981",
      accent: "#8b5cf6",
      warning: "#f59e0b",
      danger: "#ef4444",
      background: "#f8fafc",
      card: "#ffffff",
      text: "#1e293b",
      muted: "#64748b",
      border: "#e2e8f0",
    };

  const [file, setFile] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    employeeId: "",
    documentType: "",
    category: "",
    description: "",
    confidentialLevel: "Medium",
    expiryDate: "",
  });

  const categories = [
    "Employment",
    "Payroll",
    "Legal",
    "HR",
    "Verification",
    "Personal",
    "Policy",
    "Reports",
    "Other",
  ];

  const documentTypes = [
    "Offer Letter",
    "Employment Contract",
    "Salary Slip",
    "NDA Agreement",
    "Performance Review",
    "Background Check",
    "Education Certificate",
    "ID Proof",
    "Address Proof",
    "Experience Letter",
    "Other",
  ];

  const confidentialLevels = ["Low", "Medium", "High", "Strict"];

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/admin/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let list = [];
      if (Array.isArray(res.data)) {
        list = res.data
          .filter((u) => u.employee)
          .map((u) => ({
            id: u.employee.id,
            name: u.employee.fullName,
            code: u.employee.employeeCode,
          }));
      } else if (res.data.employees) {
        list = res.data.employees.map((e) => ({
          id: e.id,
          name: e.fullName,
          code: e.employeeCode,
        }));
      }
      setEmployees(list);
    } catch {
      toast.error("Failed to load employee list");
    }
  };

  const handleInputChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }
    setFile(f);
  };

  const removeFile = () => setFile(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !formData.employeeId || !formData.documentType || !formData.category) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => v && data.append(k, v));
    data.append("file", file);

    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/documents/upload", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (e) =>
          setUploadProgress(Math.round((e.loaded * 100) / e.total)),
      });

      toast.success("Document uploaded successfully");
      navigate("/manager/vault");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (b) =>
    b ? `${(b / 1024 / 1024).toFixed(2)} MB` : "0 MB";

  return (
    <div
      className="p-6 min-h-screen"
      style={{ backgroundColor: themeColors.background }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate("/manager/vault")}
          className="p-2 rounded-lg"
          style={{ color: themeColors.text }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: themeColors.text }}>
            Upload Document
          </h1>
          <p style={{ color: themeColors.muted }}>
            Upload and manage documents securely
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <div
            className="p-6 rounded-xl"
            style={{
              backgroundColor: themeColors.card,
              border: `1px solid ${themeColors.border}`,
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Employee */}
              <div>
                <label style={{ color: themeColors.text }} className="block mb-2">
                  <User size={14} className="inline mr-1" /> Employee *
                </label>
                <select
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    border: `1px solid ${themeColors.border}`,
                  }}
                >
                  <option value="">Select Employee</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Type & Category */}
              <div className="grid md:grid-cols-2 gap-6">
                <select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleInputChange}
                  className="px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    border: `1px solid ${themeColors.border}`,
                  }}
                >
                  <option value="">Document Type *</option>
                  {documentTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    border: `1px solid ${themeColors.border}`,
                  }}
                >
                  <option value="">Category *</option>
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="Description..."
                className="w-full px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: themeColors.background,
                  color: themeColors.text,
                  border: `1px solid ${themeColors.border}`,
                }}
              />

              {/* Confidentiality & Expiry */}
              <div className="grid md:grid-cols-2 gap-6">
                <select
                  name="confidentialLevel"
                  value={formData.confidentialLevel}
                  onChange={handleInputChange}
                  className="px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    border: `1px solid ${themeColors.border}`,
                  }}
                >
                  {confidentialLevels.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>

                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    border: `1px solid ${themeColors.border}`,
                  }}
                />
              </div>
            </form>
          </div>
        </div>

        {/* File Upload */}
        <div>
          <div
            className="p-6 rounded-xl"
            style={{
              backgroundColor: themeColors.card,
              border: `1px solid ${themeColors.border}`,
            }}
          >
            {!file ? (
              <label className="block border-2 border-dashed p-8 rounded-lg text-center cursor-pointer"
                style={{ borderColor: themeColors.border }}
              >
                <Upload size={40} style={{ color: themeColors.muted }} />
                <p style={{ color: themeColors.muted }}>Click to upload</p>
                <input type="file" hidden onChange={handleFileChange} />
              </label>
            ) : (
              <div className="border p-3 rounded-lg"
                style={{ borderColor: themeColors.border }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p style={{ color: themeColors.text }}>{file.name}</p>
                    <p style={{ color: themeColors.muted }} className="text-sm">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  {!loading && (
                    <button onClick={removeFile}>
                      <X size={16} style={{ color: themeColors.danger }} />
                    </button>
                  )}
                </div>

                {loading && (
                  <div className="mt-2">
                    <div className="h-2 rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${uploadProgress}%`,
                          backgroundColor: themeColors.primary,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !file}
              className="w-full mt-4 py-3 rounded-lg font-medium"
              style={{
                backgroundColor: loading ? themeColors.border : themeColors.primary,
                color: "#fff",
              }}
            >
              {loading ? "Uploading..." : "Upload Document"}
            </button>

            <div className="mt-4 p-3 rounded-lg"
              style={{
                backgroundColor: themeColors.background,
                border: `1px solid ${themeColors.border}`,
              }}
            >
              <div className="flex gap-2">
                <AlertCircle size={16} style={{ color: themeColors.accent }} />
                <p style={{ color: themeColors.muted }} className="text-sm">
                  Documents are securely stored and encrypted.
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

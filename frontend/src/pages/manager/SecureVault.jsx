import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  FileText,
  Download,
  Eye,
  Trash2,
  Filter,
  Calendar,
  User,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
// import { useTheme } from "@/context/ThemeContext"; // adjust if needed

export default function SecureVault() {
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

  const [searchTerm, setSearchTerm] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/documents", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setDocuments(
          res.data.documents.map((doc) => ({
            id: doc.id,
            name: doc.name,
            employee: doc.employee
              ? doc.employee.fullName
              : `EMP-${doc.employeeId}`,
            category: doc.category,
            size: doc.fileSize || "Unknown",
            uploadedDate: new Date(doc.createdAt).toLocaleDateString(),
            access: doc.confidentialLevel || "Medium",
            fileUrl: `http://localhost:5000${doc.fileUrl}`,
          }))
        );
      }
    } catch {
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Document deleted");
      fetchDocuments();
    } catch {
      toast.error("Delete failed");
    }
  };

  const filteredDocs = documents.filter(
    (d) =>
      (d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.employee.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === "All Categories" || d.category === categoryFilter)
  );

  return (
    <div
      className="p-6 space-y-6 min-h-screen"
      style={{ backgroundColor: themeColors.background }}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: themeColors.text }}>
            Secure Document Vault
          </h1>
          <p style={{ color: themeColors.muted }}>
            Store and manage confidential documents
          </p>
        </div>

        <Link
          to="/manager/documents/upload"
          className="flex items-center gap-2 px-4 py-2 rounded-lg"
          style={{
            backgroundColor: themeColors.primary,
            color: "#fff",
          }}
        >
          <Plus size={18} />
          Upload Document
        </Link>
      </div>

      {/* Filters */}
      <div
        className="p-4 rounded-xl flex gap-4"
        style={{
          backgroundColor: themeColors.card,
          border: `1px solid ${themeColors.border}`,
        }}
      >
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: themeColors.muted }}
          />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2 rounded-lg outline-none"
            style={{
              backgroundColor: themeColors.background,
              color: themeColors.text,
              border: `1px solid ${themeColors.border}`,
            }}
          />
        </div>

        <div className="relative">
          <Filter
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: themeColors.muted }}
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg"
            style={{
              backgroundColor: themeColors.background,
              color: themeColors.text,
              border: `1px solid ${themeColors.border}`,
            }}
          >
            <option>All Categories</option>
            <option>Employment</option>
            <option>Payroll</option>
            <option>Legal</option>
            <option>HR</option>
            <option>Verification</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: themeColors.card,
          border: `1px solid ${themeColors.border}`,
        }}
      >
        <table className="w-full">
          <thead style={{ backgroundColor: themeColors.background }}>
            <tr>
              {["Document", "Category", "Size", "Employee", "Access", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-sm"
                    style={{ color: themeColors.muted }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="py-8 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredDocs.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center">
                  No documents found
                </td>
              </tr>
            ) : (
              filteredDocs.map((doc) => (
                <tr
                  key={doc.id}
                  style={{ borderTop: `1px solid ${themeColors.border}` }}
                >
                  <td className="px-4 py-4">
                    <div className="flex gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p
                          className="font-medium"
                          style={{ color: themeColors.text }}
                        >
                          {doc.name}
                        </p>
                        <div
                          className="flex gap-1 text-sm"
                          style={{ color: themeColors.muted }}
                        >
                          <Calendar size={12} /> {doc.uploadedDate}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4" style={{ color: themeColors.text }}>
                    {doc.category}
                  </td>

                  <td className="px-4" style={{ color: themeColors.text }}>
                    {doc.size}
                  </td>

                  <td className="px-4 flex items-center gap-2">
                    <User size={14} />
                    <span style={{ color: themeColors.text }}>
                      {doc.employee}
                    </span>
                  </td>

                  <td className="px-4">
                    <span
                      className="px-3 py-1 text-xs rounded"
                      style={{
                        backgroundColor:
                          doc.access === "Low"
                            ? "#dcfce7"
                            : doc.access === "Medium"
                              ? "#fef3c7"
                              : doc.access === "High"
                                ? "#ffedd5"
                                : themeColors.danger,
                        color:
                          doc.access === "Strict" ? "#fff" : "#1e293b",
                      }}
                    >
                      {doc.access}
                    </span>
                  </td>

                  <td className="px-4">
                    <div className="flex gap-2">
                      <button onClick={() => window.open(doc.fileUrl)}>
                        <Eye size={16} style={{ color: themeColors.accent }} />
                      </button>
                      <a href={doc.fileUrl} download>
                        <Download
                          size={16}
                          style={{ color: themeColors.secondary }}
                        />
                      </a>
                      <button onClick={() => handleDelete(doc.id)}>
                        <Trash2
                          size={16}
                          style={{ color: themeColors.danger }}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

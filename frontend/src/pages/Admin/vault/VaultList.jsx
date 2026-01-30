import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiFilter, FiDownload, FiEye, FiTrash2, FiFileText, FiLock, FiCalendar, FiUsers, FiDatabase } from "react-icons/fi";
import { useTheme, useThemeClasses } from "../../../contexts/ThemeContext";

import axios from "axios";
import { toast } from "react-hot-toast";

const VaultList = () => {
  const [search, setSearch] = useState("");
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [typeFilter, setTypeFilter] = useState("All");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const darkMode = useTheme();
  const theme = useThemeClasses();

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/documents", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        // Map backend data to frontend structure if necessary
        // Backend returns: { id, employeeId, name, type, category, fileUrl, fileSize, uploadDate, employee: { ... } }
        // Frontend expects: { id, employee, employeeId, type, category, uploadedBy, uploadDate, size, status }
        const mappedDocs = response.data.documents.map(doc => ({
          id: doc.id,
          employee: doc.employee ? doc.employee.fullName : `EMP-${doc.employeeId}`,
          employeeId: doc.employee?.employeeCode || `ID-${doc.employeeId}`,
          type: doc.type,
          category: doc.category,
          uploadedBy: "System",
          uploadDate: doc.uploadDate,
          fileUrl: `http://localhost:5000${doc.fileUrl}`, // Ensure full URL
          size: doc.fileSize || "Unknown",
          status: "Active" // Default status as we didn't implement expiry check in backend yet
        }));
        setDocuments(mappedDocs);
      }
    } catch (error) {
      console.error("Failed to fetch documents", error);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Document deleted");
      fetchDocuments(); // Refresh list
    } catch (error) {
      console.error("Delete error", error);
      toast.error("Failed to delete document");
    }
  };

  // Helpers (Moved back)
  const filtered = documents
    .filter(doc =>
      doc.employee.toLowerCase().includes(search.toLowerCase().trim()) ||
      doc.type.toLowerCase().includes(search.toLowerCase().trim())
    )
    .filter(doc =>
      typeFilter === "All" ? true : doc.category === typeFilter
    );

  const toggleSelectDoc = (id) => {
    setSelectedDocs(prev =>
      prev.includes(id)
        ? prev.filter(docId => docId !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedDocs.length === filtered.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(filtered.map(doc => doc.id));
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Employment": return darkMode ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-purple-100 text-purple-800 border border-purple-200";
      case "Payroll": return darkMode ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case "Legal": return darkMode ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-amber-100 text-amber-800 border border-amber-200";
      case "HR": return darkMode ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : "bg-blue-100 text-blue-800 border border-blue-200";
      case "Verification": return darkMode ? "bg-pink-500/20 text-pink-300 border border-pink-500/30" : "bg-pink-100 text-pink-800 border border-pink-200";
      default: return darkMode ? "bg-gray-500/20 text-gray-300 border border-gray-500/30" : "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    return status === "Active"
      ? darkMode ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-emerald-100 text-emerald-800 border border-emerald-200"
      : darkMode ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-rose-100 text-rose-800 border border-rose-200";
  };

  const getBgColor = () => darkMode ? "bg-gray-800" : "bg-white";
  const getBorderColor = () => darkMode ? "border-gray-700" : "border-gray-200";
  const getTextColor = () => darkMode ? "text-white" : "text-gray-800";
  const getSecondaryTextColor = () => darkMode ? "text-gray-400" : "text-gray-600";
  const getInputBg = () => darkMode ? "bg-gray-900" : "bg-gray-50";
  const getCardBg = () => darkMode ? "bg-gray-700/50" : "bg-gray-100";
  const getHeaderBg = () => darkMode ? "bg-gray-900/50" : "bg-gray-50";

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${getTextColor()} mb-2`}>
            Secure Vault
          </h1>
          <p className={getSecondaryTextColor()}>
            Securely store and manage confidential employee documents.
          </p>
        </div>
        <Link
          to="/admin/vault/upload"
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload Document
        </Link>
      </div>





      {/* Search & Filter */}
      <div className={`${getBgColor()} rounded-xl p-6 border ${getBorderColor()} shadow-sm mb-6`}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${getSecondaryTextColor()}`} />
              <input
                type="text"
                placeholder="Search documents by employee name or type..."
                className={`w-full pl-12 pr-4 py-3 ${getInputBg()} border ${getBorderColor()} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${getTextColor()} placeholder-gray-400 transition-all`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              className={`px-4 py-3 ${getInputBg()} border ${getBorderColor()} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${getTextColor()}`}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All" className={darkMode ? "bg-gray-800" : "bg-white"}>All Categories</option>
              <option value="Employment" className={darkMode ? "bg-gray-800" : "bg-white"}>Employment</option>
              <option value="Payroll" className={darkMode ? "bg-gray-800" : "bg-white"}>Payroll</option>
              <option value="Legal" className={darkMode ? "bg-gray-800" : "bg-white"}>Legal</option>
              <option value="HR" className={darkMode ? "bg-gray-800" : "bg-white"}>HR</option>
              <option value="Verification" className={darkMode ? "bg-gray-800" : "bg-white"}>Verification</option>
            </select>

          </div>
        </div>

        {/* Batch Actions */}
        {selectedDocs.length > 0 && (
          <div className="mt-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
                {selectedDocs.length}
              </div>
              <span className="text-purple-400 font-medium">
                {selectedDocs.length} document{selectedDocs.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex gap-2">
              <button className={`px-4 py-2 ${getInputBg()} border ${getBorderColor()} rounded-lg text-sm ${getSecondaryTextColor()} hover:border-purple-500 hover:text-purple-600 transition-colors`}>
                Bulk Download
              </button>
              <button className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm">
                Archive Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Documents Table */}
      <div className={`${getBgColor()} rounded-xl border ${getBorderColor()} overflow-hidden shadow-sm`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={getHeaderBg()}>
              <tr>
                <th className="p-4 border-b border-gray-700 text-left">
                  <input
                    type="checkbox"
                    checked={selectedDocs.length === filtered.length && filtered.length > 0}
                    onChange={selectAll}
                    className="rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500/20"
                  />
                </th>
                <th className={`p-4 border-b ${getBorderColor()} text-left text-sm font-semibold ${getTextColor()}`}>
                  Document
                </th>
                <th className={`p-4 border-b ${getBorderColor()} text-left text-sm font-semibold ${getTextColor()}`}>
                  Employee
                </th>
                <th className={`p-4 border-b ${getBorderColor()} text-left text-sm font-semibold ${getTextColor()}`}>
                  Category
                </th>
                <th className={`p-4 border-b ${getBorderColor()} text-left text-sm font-semibold ${getTextColor()}`}>
                  Upload Details
                </th>
                <th className={`p-4 border-b ${getBorderColor()} text-left text-sm font-semibold ${getTextColor()}`}>
                  Status
                </th>
                <th className={`p-4 border-b ${getBorderColor()} text-left text-sm font-semibold ${getTextColor()}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.id} className={darkMode ? "hover:bg-gray-900/30 transition-colors" : "hover:bg-gray-50/50 transition-colors"}>
                  <td className="p-4 border-b border-gray-700">
                    <input
                      type="checkbox"
                      checked={selectedDocs.includes(doc.id)}
                      onChange={() => toggleSelectDoc(doc.id)}
                      className="rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500/20"
                    />
                  </td>
                  <td className="p-4 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} flex items-center justify-center border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'}`}>
                        <FiFileText className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                      </div>
                      <div>
                        <p className={`font-medium ${getTextColor()}`}>{doc.type}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs ${getSecondaryTextColor()}`}>{doc.size}</span>
                          <span className={`text-xs ${getSecondaryTextColor()}`}>•</span>
                          <span className={`text-xs ${getSecondaryTextColor()}`}>PDF</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 border-b border-gray-700">
                    <div>
                      <p className={`font-medium ${getTextColor()}`}>{doc.employee}</p>
                      <p className={`text-sm ${getSecondaryTextColor()}`}>{doc.employeeId}</p>
                    </div>
                  </td>
                  <td className="p-4 border-b border-gray-700">
                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${getCategoryColor(doc.category)}`}>
                      {doc.category}
                    </span>
                  </td>
                  <td className="p-4 border-b border-gray-700">
                    <div>
                      <p className={`text-sm ${getTextColor()}`}>{doc.uploadedBy}</p>
                      <p className={`text-xs ${getSecondaryTextColor()}`}>{doc.uploadDate}</p>
                    </div>
                  </td>
                  <td className="p-4 border-b border-gray-700">
                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(doc.status)}`}>
                      <span className={`w-2 h-2 rounded-full ${doc.status === "Active" ? (darkMode ? 'bg-emerald-500' : 'bg-emerald-600') : (darkMode ? 'bg-rose-500' : 'bg-rose-600')}`}></span>
                      {doc.status}
                    </span>
                  </td>
                  <td className="p-4 border-b border-gray-700">
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(doc.fileUrl, '_blank')}
                        className={`p-2 rounded-lg ${getInputBg()} border ${getBorderColor()} ${getSecondaryTextColor()} hover:text-purple-400 hover:border-purple-500/50 transition-colors`}
                        title="View"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <a
                        href={doc.fileUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 rounded-lg ${getInputBg()} border ${getBorderColor()} text-purple-400 hover:text-purple-300 hover:border-purple-500/50 transition-colors flex items-center justify-center`}
                        title="Download"
                      >
                        <FiDownload className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className={`p-2 rounded-lg ${getInputBg()} border ${getBorderColor()} text-rose-400 hover:text-rose-300 hover:border-rose-500/50 transition-colors`}
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <div className="max-w-md mx-auto">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${getInputBg()} flex items-center justify-center border ${getBorderColor()}`}>
                        <FiFileText className="w-8 h-8 text-gray-500" />
                      </div>
                      <h3 className={`text-lg font-medium ${getTextColor()} mb-2`}>No documents found</h3>
                      <p className={`${getSecondaryTextColor()} mb-4`}>Try adjusting your search or filter criteria</p>
                      <button
                        onClick={() => {
                          setSearch("");
                          setTypeFilter("All");
                        }}
                        className="text-purple-400 hover:text-purple-300 font-medium"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`px-6 py-4 border-t ${getBorderColor()} flex items-center justify-between`}>
          <div className={`text-sm ${getSecondaryTextColor()}`}>
            Showing <span className={`font-medium ${getTextColor()}`}>1-{filtered.length}</span> of{" "}
            <span className={`font-medium ${getTextColor()}`}>{documents.length}</span> documents
          </div>
          <div className="flex gap-2">
            <button className={`px-3 py-2 ${getInputBg()} border ${getBorderColor()} rounded-lg ${getSecondaryTextColor()} hover:border-purple-500 hover:text-purple-600 transition-colors disabled:opacity-50`}>
              Previous
            </button>
            <button className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
              1
            </button>
            <button className={`px-3 py-2 ${getInputBg()} border ${getBorderColor()} rounded-lg ${getSecondaryTextColor()} hover:border-purple-500 hover:text-purple-600 transition-colors`}>
              2
            </button>
            <button className={`px-3 py-2 ${getInputBg()} border ${getBorderColor()} rounded-lg ${getSecondaryTextColor()} hover:border-purple-500 hover:text-purple-600 transition-colors`}>
              3
            </button>
            <button className={`px-3 py-2 ${getInputBg()} border ${getBorderColor()} rounded-lg ${getSecondaryTextColor()} hover:border-purple-500 hover:text-purple-600 transition-colors`}>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Vault Security Info */}
      <div className={`mt-6 ${darkMode ? 'bg-purple-900/20' : 'bg-purple-50'} rounded-xl p-6 border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'}`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full ${darkMode ? 'bg-purple-500/20' : 'bg-purple-100'} flex items-center justify-center`}>
            <FiLock className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <div className="flex-1">
            <h4 className={`text-lg font-semibold ${darkMode ? 'text-purple-300' : 'text-purple-700'} mb-2`}>Vault Security Status</h4>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              All documents are encrypted with AES-256 encryption. Access is logged and monitored 24/7.
              Last security audit: <span className={`${darkMode ? 'text-emerald-400' : 'text-emerald-600'} font-medium`}>Passed ✓</span>
            </p>
            <div className="flex gap-4 mt-3">
              <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-purple-100 text-purple-700 border border-purple-200'}`}>
                Encrypted Storage
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                Access Logging
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                Backup Enabled
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultList;
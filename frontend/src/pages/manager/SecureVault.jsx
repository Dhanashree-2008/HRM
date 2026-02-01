import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, FileText, Lock, Download, Eye, Trash2, Filter, Calendar, User } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function SecureVault() {
  const [searchTerm, setSearchTerm] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All Categories');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/documents", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        const mappedDocs = response.data.documents.map(doc => ({
          id: doc.id,
          name: doc.name,
          employee: doc.employee ? doc.employee.fullName : `EMP-${doc.employeeId}`,
          employeeId: doc.employee?.employeeCode || `ID-${doc.employeeId}`,
          type: doc.type,
          size: doc.fileSize || "Unknown",
          uploadedBy: "System", // Backend doesn't return uploader yet, assuming System/Admin
          uploadedDate: new Date(doc.createdAt).toLocaleDateString(),
          category: doc.category,
          access: doc.confidentialLevel || 'Medium',
          fileUrl: `http://localhost:5000${doc.fileUrl}`
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Document deleted");
      fetchDocuments();
    } catch (error) {
      console.error("Delete error", error);
      toast.error("Failed to delete document");
    }
  };

  const filteredDocs = documents.filter(doc =>
    (doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.employee.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (categoryFilter === 'All Categories' || doc.category === categoryFilter)
  );

  const getAccessColor = (access) => {
    switch (access) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Strict': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getFileIcon = (type) => {
    // Simple icon logic based on type string (which might be MIME or extension-like)
    return <FileText className="text-blue-600" size={20} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Secure Document Vault</h1>
          <p className="text-slate-600">Store and manage confidential documents securely</p>
        </div>
        <Link
          to="/manager/documents/upload"
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus size={18} />
          <span>Upload Document</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="search"
              placeholder="Search documents by name, category or employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex space-x-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <select
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
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
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="py-3 px-4 text-left text-sm font-medium text-slate-700">Document</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-slate-700">Category</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-slate-700">Size</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-slate-700">Employee</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-slate-700">Access Level</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">Loading documents...</td>
                </tr>
              ) : filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">No documents found.</td>
                </tr>
              ) : (
                filteredDocs.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          {getFileIcon(doc.type)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{doc.name}</p>
                          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                            <Calendar size={12} />
                            <span>{doc.uploadedDate}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-slate-700">{doc.category}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-slate-700">{doc.size}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-slate-500" />
                        <span className="text-slate-700">{doc.employee}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded text-xs font-medium ${getAccessColor(doc.access)}`}>
                        {doc.access}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => window.open(doc.fileUrl, '_blank')}
                          className="p-2 hover:bg-slate-100 rounded-lg"
                          title="Preview"
                        >
                          <Eye size={16} className="text-blue-600" />
                        </button>
                        <a
                          href={doc.fileUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-slate-100 rounded-lg flex items-center"
                          title="Download"
                        >
                          <Download size={16} className="text-green-600" />
                        </a>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 hover:bg-slate-100 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-red-600" />
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
    </div>
  );
}
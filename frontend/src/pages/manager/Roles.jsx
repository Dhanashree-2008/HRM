import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Search, Plus, Shield, Users, Edit, Trash2, Filter, CheckCircle } from 'lucide-react';
import roleService from '../../services/roleService';
import { toast } from 'react-hot-toast';

export default function Roles() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState('All Levels');

  const { isDarkMode = true } = useOutletContext() || {};

  // Theme colors synchronized with Dashboard.jsx
  const themeColors = isDarkMode ? {
    primary: '#8b5cf6',      // Purple
    secondary: '#10b981',    // Green
    accent: '#3b82f6',       // Blue
    warning: '#f59e0b',      // Amber
    danger: '#ef4444',       // Red
    background: '#0f172a',   // Dark background
    card: '#1e293b',         // Dark card
    text: '#f9fafb',         // Light text
    muted: '#9ca3af',        // Muted text
    border: '#374151',       // Border color
    inputBg: '#1e293b',      // Input background
  } : {
    primary: '#2563eb',      // Blue
    secondary: '#10b981',    // Green
    accent: '#8b5cf6',       // Purple
    warning: '#f59e0b',      // Amber
    danger: '#ef4444',       // Red
    background: '#f8fafc',   // Light slate
    card: '#ffffff',         // White
    text: '#1e293b',         // Slate 800
    muted: '#64748b',        // Slate 500
    border: '#e2e8f0',       // Light border
    inputBg: '#ffffff',      // Input background
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await roleService.getAllRoles();
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      await roleService.deleteRole(id);
      toast.success("Role deleted successfully");
      fetchRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error(error.response?.data?.message || "Failed to delete role");
    }
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Since backend doesn't have 'level' yet, we'll auto-assign color based on name or user count for now
  const getLevelColor = (roleName) => {
    const name = roleName.toLowerCase();
    if (name.includes('admin') || name.includes('manager')) return { bg: `${themeColors.danger}20`, text: themeColors.danger };
    if (name.includes('lead') || name.includes('head')) return { bg: `${themeColors.warning}20`, text: themeColors.warning };
    return { bg: `${themeColors.secondary}20`, text: themeColors.secondary };
  };

  return (
    <div className="space-y-6 transition-colors duration-300" style={{ backgroundColor: themeColors.background, minHeight: '100vh', padding: '1.5rem' }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold transition-colors duration-300" style={{ color: themeColors.text }}>Roles & Permissions</h1>
          <p className="transition-colors duration-300" style={{ color: themeColors.muted }}>Manage system roles and access permissions</p>
        </div>
        <button
          onClick={() => navigate('/manager/roles/add')}
          className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg shadow-sm hover:opacity-90 transition-colors duration-300"
          style={{ backgroundColor: themeColors.primary }}
        >
          <Plus size={18} />
          <span>Add Role</span>
        </button>
      </div>

      <div className="rounded-xl shadow-sm p-6 transition-colors duration-300" style={{ backgroundColor: themeColors.card, border: `1px solid ${themeColors.border}` }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300" size={18} style={{ color: themeColors.muted }} />
            <input
              type="search"
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300"
              style={{
                backgroundColor: themeColors.inputBg,
                borderColor: themeColors.border,
                color: themeColors.text,
                '--tw-ring-color': themeColors.primary
              }}
            />
          </div>
          <div className="flex space-x-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300" size={18} style={{ color: themeColors.muted }} />
              <select
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 appearance-none transition-colors duration-300"
                style={{
                  backgroundColor: themeColors.inputBg,
                  borderColor: themeColors.border,
                  color: themeColors.text,
                  '--tw-ring-color': themeColors.primary
                }}
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
              >
                <option>All Levels</option>
                {/* Add more filter logic if backend supports it */}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 transition-colors duration-300" style={{ color: themeColors.muted }}>Loading roles...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRoles.map(role => (
              <div key={role.id} className="border rounded-xl p-6 hover:shadow-md transition-all duration-300" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: `${themeColors.primary}20` }}>
                      <Shield size={24} style={{ color: themeColors.primary }} />
                    </div>
                    <div>
                      <h3 className="font-semibold transition-colors duration-300" style={{ color: themeColors.text }}>{role.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {(() => {
                          const style = getLevelColor(role.name);
                          return (
                            <span className={`px-2 py-1 rounded text-xs font-medium transition-colors duration-300`} style={{ backgroundColor: style.bg, color: style.text }}>
                              Role
                            </span>
                          );
                        })()}
                        <div className="flex items-center gap-1 text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>
                          <Users size={14} />
                          <span>{role.userCount || 0} users</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {/* Add edit functionality later if needed */}
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="p-2 rounded-lg transition-colors duration-300 hover:opacity-80"
                      style={{ backgroundColor: `${themeColors.danger}10` }}
                      title="Delete Role"
                    >
                      <Trash2 size={16} style={{ color: themeColors.danger }} />
                    </button>
                  </div>
                </div>

                <p className="mb-4 transition-colors duration-300" style={{ color: themeColors.muted }}>{role.description || 'No description provided'}</p>

                <div className="space-y-2">
                  <h4 className="font-medium transition-colors duration-300" style={{ color: themeColors.text }}>Permissions:</h4>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions && Object.keys(role.permissions).filter(k => role.permissions[k]).length > 0 ? (
                      Object.keys(role.permissions)
                        .filter(k => role.permissions[k])
                        .slice(0, 5) // Show only first 5
                        .map((perm, idx) => (
                          <span key={idx} className="flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors duration-300"
                            style={{ backgroundColor: `${themeColors.secondary}20`, color: themeColors.secondary }}>
                            <CheckCircle size={12} />
                            {perm.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        ))
                    ) : (
                      <span className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>No active permissions</span>
                    )}
                    {role.permissions && Object.keys(role.permissions).filter(k => role.permissions[k]).length > 5 && (
                      <span className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>+{Object.keys(role.permissions).filter(k => role.permissions[k]).length - 5} more</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredRoles.length === 0 && (
              <div className="col-span-full text-center py-10 transition-colors duration-300" style={{ color: themeColors.muted }}>
                No roles found matching your search.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
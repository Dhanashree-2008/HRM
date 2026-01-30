import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Shield, Users, Edit, Trash2, Filter, CheckCircle } from 'lucide-react';
import roleService from '../../services/roleService';
import { toast } from 'react-hot-toast';

export default function Roles() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState('All Levels');

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
    if (name.includes('admin') || name.includes('manager')) return 'bg-red-100 text-red-800';
    if (name.includes('lead') || name.includes('head')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Roles & Permissions</h1>
          <p className="text-slate-600">Manage system roles and access permissions</p>
        </div>
        <button
          onClick={() => navigate('/manager/roles/add')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus size={18} />
          <span>Add Role</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="search"
              placeholder="Search roles..."
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
          <div className="text-center py-10">Loading roles...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRoles.map(role => (
              <div key={role.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Shield className="text-purple-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{role.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(role.name)}`}>
                          Role
                        </span>
                        <div className="flex items-center gap-1 text-sm text-slate-600">
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
                      className="p-2 hover:bg-slate-100 rounded-lg"
                      title="Delete Role"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>

                <p className="text-slate-600 mb-4">{role.description || 'No description provided'}</p>

                <div className="space-y-2">
                  <h4 className="font-medium text-slate-700">Permissions:</h4>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions && Object.keys(role.permissions).filter(k => role.permissions[k]).length > 0 ? (
                      Object.keys(role.permissions)
                        .filter(k => role.permissions[k])
                        .slice(0, 5) // Show only first 5
                        .map((perm, idx) => (
                          <span key={idx} className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                            <CheckCircle size={12} />
                            {perm.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        ))
                    ) : (
                      <span className="text-sm text-slate-500">No active permissions</span>
                    )}
                    {role.permissions && Object.keys(role.permissions).filter(k => role.permissions[k]).length > 5 && (
                      <span className="text-sm text-slate-500">+{Object.keys(role.permissions).filter(k => role.permissions[k]).length - 5} more</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredRoles.length === 0 && (
              <div className="col-span-full text-center py-10 text-slate-500">
                No roles found matching your search.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
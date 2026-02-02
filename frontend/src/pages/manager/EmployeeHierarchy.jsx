// src/pages/manager/EmployeeHierarchy.jsx
import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  User,
  Mail,
  Phone,
  Building,
  Edit2,
  Eye,
  BarChart3,
  Target,
  TrendingUp,
  UserPlus
} from 'lucide-react';

const EmployeeHierarchy = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNodes, setExpandedNodes] = useState(['ceo', 'cto', 'cmo', 'hr-head']);
  const [viewMode, setViewMode] = useState('hierarchy'); // 'hierarchy' or 'grid'

  // Theme definition
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
    hover: 'rgba(59, 130, 246, 0.1)', // Hover state
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
    hover: '#f1f5f9',        // Hover state
  };

  const hierarchyData = {
    id: 'ceo',
    name: 'John CEO',
    title: 'Chief Executive Officer',
    department: 'Executive',
    email: 'john.ceo@litehr.com',
    phone: '+1 555 0100',
    avatar: 'JC',
    employees: [
      {
        id: 'cto',
        name: 'Sarah CTO',
        title: 'Chief Technology Officer',
        department: 'Engineering',
        email: 'sarah.cto@litehr.com',
        phone: '+1 555 0101',
        avatar: 'SC',
        employees: [
          {
            id: 'eng-manager',
            name: 'Mike Johnson',
            title: 'Engineering Manager',
            department: 'Engineering',
            email: 'mike.j@litehr.com',
            phone: '+1 555 0102',
            avatar: 'MJ',
            employees: [
              {
                id: 'se1',
                name: 'Alex Chen',
                title: 'Senior Developer',
                department: 'Engineering',
                email: 'alex.c@litehr.com',
                phone: '+1 555 0103',
                avatar: 'AC',
                employees: []
              },
              {
                id: 'se2',
                name: 'Priya Sharma',
                title: 'Senior Developer',
                department: 'Engineering',
                email: 'priya.s@litehr.com',
                phone: '+1 555 0104',
                avatar: 'PS',
                employees: []
              },
            ]
          },
          {
            id: 'product-manager',
            name: 'David Lee',
            title: 'Product Manager',
            department: 'Product',
            email: 'david.l@litehr.com',
            phone: '+1 555 0105',
            avatar: 'DL',
            employees: [
              {
                id: 'pd1',
                name: 'Lisa Wang',
                title: 'Product Designer',
                department: 'Product',
                email: 'lisa.w@litehr.com',
                phone: '+1 555 0106',
                avatar: 'LW',
                employees: []
              },
            ]
          }
        ]
      },
      {
        id: 'cmo',
        name: 'Robert Brown',
        title: 'Chief Marketing Officer',
        department: 'Marketing',
        email: 'robert.b@litehr.com',
        phone: '+1 555 0107',
        avatar: 'RB',
        employees: [
          {
            id: 'marketing-manager',
            name: 'Emily Davis',
            title: 'Marketing Manager',
            department: 'Marketing',
            email: 'emily.d@litehr.com',
            phone: '+1 555 0108',
            avatar: 'ED',
            employees: [
              {
                id: 'ma1',
                name: 'Tom Wilson',
                title: 'Content Strategist',
                department: 'Marketing',
                email: 'tom.w@litehr.com',
                phone: '+1 555 0109',
                avatar: 'TW',
                employees: []
              },
              {
                id: 'ma2',
                name: 'Sophia Garcia',
                title: 'Social Media Manager',
                department: 'Marketing',
                email: 'sophia.g@litehr.com',
                phone: '+1 555 0110',
                avatar: 'SG',
                employees: []
              },
            ]
          }
        ]
      },
      {
        id: 'hr-head',
        name: 'Jennifer Wilson',
        title: 'Head of HR',
        department: 'Human Resources',
        email: 'jennifer.w@litehr.com',
        phone: '+1 555 0111',
        avatar: 'JW',
        employees: [
          {
            id: 'hr-manager',
            name: 'Michael Clark',
            title: 'HR Manager',
            department: 'Human Resources',
            email: 'michael.c@litehr.com',
            phone: '+1 555 0112',
            avatar: 'MC',
            employees: [
              {
                id: 'hr1',
                name: 'Kevin Brown',
                title: 'HR Executive',
                department: 'Human Resources',
                email: 'kevin.b@litehr.com',
                phone: '+1 555 0113',
                avatar: 'KB',
                employees: []
              },
            ]
          }
        ]
      },
      {
        id: 'cfo',
        name: 'Richard Taylor',
        title: 'Chief Financial Officer',
        department: 'Finance',
        email: 'richard.t@litehr.com',
        phone: '+1 555 0114',
        avatar: 'RT',
        employees: [
          {
            id: 'finance-manager',
            name: 'Jessica Miller',
            title: 'Finance Manager',
            department: 'Finance',
            email: 'jessica.m@litehr.com',
            phone: '+1 555 0115',
            avatar: 'JM',
            employees: [
              {
                id: 'fi1',
                name: 'Brian Smith',
                title: 'Accountant',
                department: 'Finance',
                email: 'brian.s@litehr.com',
                phone: '+1 555 0116',
                avatar: 'BS',
                employees: []
              },
            ]
          }
        ]
      }
    ]
  };

  const toggleNode = (id) => {
    setExpandedNodes(prev =>
      prev.includes(id)
        ? prev.filter(nodeId => nodeId !== id)
        : [...prev, id]
    );
  };

  const renderTreeNode = (node) => {
    const isExpanded = expandedNodes.includes(node.id);
    const hasChildren = node.employees && node.employees.length > 0;

    return (
      <div key={node.id} className="ml-6">
        <div
          style={{ borderColor: themeColors.border, backgroundColor: themeColors.card }}
          className="flex items-center gap-3 p-4 border rounded-lg mb-3 transition-colors duration-200"
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#1e293b' : '#f8fafc'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = themeColors.card}
        >
          <button
            onClick={() => toggleNode(node.id)}
            style={{ color: hasChildren ? themeColors.text : 'transparent' }}
            className={`p-1`}
            disabled={!hasChildren}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-sm">{node.avatar}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h3 style={{ color: themeColors.text }} className="font-semibold truncate">{node.name}</h3>
              <span style={{ backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : '#eff6ff', color: themeColors.accent }} className="px-2 py-1 text-xs rounded-full whitespace-nowrap">
                {node.department}
              </span>
            </div>
            <p style={{ color: themeColors.muted }} className="text-sm truncate">{node.title}</p>
            <div style={{ color: themeColors.muted }} className="flex flex-wrap items-center gap-3 mt-2 text-xs">
              <span className="flex items-center gap-1 truncate">
                <Building size={12} />
                Reports to: {node.id === 'ceo' ? 'Board' : 'CEO'}
              </span>
              <span className="flex items-center gap-1">
                <Users size={12} />
                Team: {node.employees.length}
              </span>
            </div>
            <div style={{ color: themeColors.muted }} className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-xs truncate">{node.email}</span>
              <span className="text-xs">•</span>
              <span className="text-xs truncate">{node.phone}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => navigate(`/manager/employees?view=${node.id}`)}
              style={{ color: themeColors.text }}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => window.location.href = `mailto:${node.email}`}
              style={{ color: themeColors.text }}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Send Email"
            >
              <Mail size={16} />
            </button>
            <button
              onClick={() => navigate(`/manager/employees/hierarchy?edit=${node.id}`)}
              style={{ color: themeColors.text }}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Edit Position"
            >
              <Edit2 size={16} />
            </button>
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div style={{ borderColor: themeColors.border }} className="border-l-2 pl-4 sm:pl-6">
            {node.employees.map(child => renderTreeNode(child))}
          </div>
        )}
      </div>
    );
  };

  const renderGridView = () => {
    const flattenHierarchy = (node, level = 0) => {
      const employees = [{ ...node, level }];
      node.employees?.forEach(child => {
        employees.push(...flattenHierarchy(child, level + 1));
      });
      return employees;
    };

    const allEmployees = flattenHierarchy(hierarchyData);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allEmployees.map(employee => (
          <div
            key={employee.id}
            style={{
              borderColor: themeColors.border,
              marginLeft: `${Math.min(employee.level, 3) * 20}px`,
              backgroundColor: themeColors.card
            }}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">{employee.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 style={{ color: themeColors.text }} className="font-semibold truncate">{employee.name}</h3>
                <p style={{ color: themeColors.muted }} className="text-sm truncate">{employee.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span style={{ backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : '#eff6ff', color: themeColors.accent }} className="px-2 py-0.5 text-xs rounded-full">
                    {employee.department}
                  </span>
                  <span style={{ color: themeColors.muted }} className="text-xs">Level {employee.level}</span>
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  <span style={{ color: themeColors.muted }} className="text-xs truncate">{employee.email}</span>
                  <span style={{ color: themeColors.muted }} className="text-xs truncate">{employee.phone}</span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => navigate(`/manager/employees?view=${employee.id}`)}
                    style={{ borderColor: themeColors.border, color: themeColors.text }}
                    className="px-3 py-1 text-xs border rounded hover:opacity-80"
                  >
                    View
                  </button>
                  <button
                    onClick={() => window.location.href = `mailto:${employee.email}`}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Contact
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: themeColors.background, minHeight: '100vh', color: themeColors.text }} className="p-4 md:p-6 transition-colors duration-300">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/manager/employees')}
              style={{
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
                color: themeColors.muted
              }}
              className="p-2 border rounded-lg hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 style={{ color: themeColors.text }} className="text-2xl font-bold">Employee Hierarchy</h1>
              <p style={{ color: themeColors.muted }}>Visualize organizational structure and reporting lines</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode(viewMode === 'hierarchy' ? 'grid' : 'hierarchy')}
              style={{ borderColor: themeColors.border, color: themeColors.text, backgroundColor: themeColors.card }}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:opacity-90"
            >
              {viewMode === 'hierarchy' ? (
                <>
                  <BarChart3 size={18} />
                  <span>Grid View</span>
                </>
              ) : (
                <>
                  <Target size={18} />
                  <span>Hierarchy View</span>
                </>
              )}
            </button>
            <button
              onClick={() => navigate('/manager/employees/add')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <UserPlus size={18} />
              <span>Add Employee</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search employees by name, title, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                backgroundColor: themeColors.inputBg,
                borderColor: themeColors.border,
                color: themeColors.text
              }}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <button style={{ backgroundColor: themeColors.card, borderColor: themeColors.border, color: themeColors.text }} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:opacity-90">
              <Filter size={16} />
              <span>Filter</span>
              <ChevronDown size={16} />
            </button>

            <select
              style={{
                backgroundColor: themeColors.inputBg,
                borderColor: themeColors.border,
                color: themeColors.text
              }}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option>All Departments</option>
              <option>Engineering</option>
              <option>Marketing</option>
              <option>HR</option>
              <option>Finance</option>
              <option>Product</option>
              <option>Executive</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }} className="rounded-xl shadow-sm border p-4 md:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 style={{ color: themeColors.text }} className="text-lg font-semibold">Organizational Structure</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpandedNodes(Object.keys(hierarchyData).concat(hierarchyData.employees.map(e => e.id)))}
              style={{ borderColor: themeColors.border, color: themeColors.text }}
              className="px-3 py-1 text-sm border rounded hover:opacity-80"
            >
              Expand All
            </button>
            <button
              onClick={() => setExpandedNodes(['ceo'])}
              style={{ borderColor: themeColors.border, color: themeColors.text }}
              className="px-3 py-1 text-sm border rounded hover:opacity-80"
            >
              Collapse All
            </button>
          </div>
        </div>

        {viewMode === 'hierarchy' ? (
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {renderTreeNode(hierarchyData)}
            </div>
          </div>
        ) : (
          renderGridView()
        )}

        <div style={{ backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff', borderColor: themeColors.primary }} className="mt-8 p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 style={{ color: isDarkMode ? themeColors.text : '#1e40af' }} className="font-medium">Organization Summary</h3>
              <p style={{ color: isDarkMode ? themeColors.muted : '#1d4ed8' }} className="text-sm">
                Total of 12 employees across 6 departments. 4 direct reports to CEO.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }} className="rounded-xl shadow-sm border p-6">
          <h3 style={{ color: themeColors.text }} className="font-semibold mb-4 flex items-center gap-2">
            <Building size={16} />
            Department Distribution
          </h3>
          <div className="space-y-3">
            {[
              { dept: 'Engineering', count: 5, color: 'bg-blue-500' },
              { dept: 'Marketing', count: 4, color: 'bg-green-500' },
              { dept: 'HR', count: 3, color: 'bg-purple-500' },
              { dept: 'Finance', count: 2, color: 'bg-yellow-500' },
              { dept: 'Product', count: 2, color: 'bg-pink-500' },
              { dept: 'Executive', count: 1, color: 'bg-red-500' }
            ].map(({ dept, count, color }) => (
              <div key={dept} className="flex items-center justify-between">
                <span style={{ color: themeColors.muted }} className="text-sm">{dept}</span>
                <div className="flex items-center gap-3">
                  <div className="w-16 bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${color}`}
                      style={{ width: `${(count / 12) * 100}%` }}
                    ></div>
                  </div>
                  <span style={{ backgroundColor: isDarkMode ? 'rgba(241, 245, 249, 0.1)' : '#f1f5f9', color: themeColors.text }} className="px-2 py-1 text-xs rounded whitespace-nowrap">
                    {count} employee{count !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }} className="rounded-xl shadow-sm border p-6">
          <h3 style={{ color: themeColors.text }} className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={16} />
            Recent Changes
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Mike Johnson', change: 'Promoted to Engineering Manager', date: '2 days ago', type: 'promotion' },
              { name: 'Lisa Wang', change: 'New hire - Product Designer', date: '1 week ago', type: 'new' },
              { name: 'Tom Wilson', change: 'Transferred to Marketing', date: '2 weeks ago', type: 'transfer' },
              { name: 'Sarah CTO', change: 'Added as CTO', date: '1 month ago', type: 'promotion' }
            ].map((item, index) => (
              <div key={index} style={{ borderColor: themeColors.border }} className="p-3 border rounded-lg hover:opacity-90 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${item.type === 'promotion' ? 'bg-green-100 text-green-800' :
                      item.type === 'new' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                    }`}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </span>
                  <p style={{ color: themeColors.text }} className="text-sm font-medium">{item.name}</p>
                </div>
                <p style={{ color: themeColors.muted }} className="text-sm">{item.change}</p>
                <p style={{ color: themeColors.muted }} className="text-xs mt-1">{item.date}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }} className="rounded-xl shadow-sm border p-6">
          <h3 style={{ color: themeColors.text }} className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/manager/employees/add')}
              style={{ borderColor: themeColors.border }}
              className="w-full text-left p-3 border rounded-lg hover:opacity-90 transition-colors flex items-center gap-2"
            >
              <UserPlus size={16} className="text-blue-600" />
              <span style={{ color: themeColors.text }} className="text-sm">Add New Employee</span>
            </button>
            <button
              onClick={() => navigate('/manager/employees')}
              style={{ borderColor: themeColors.border }}
              className="w-full text-left p-3 border rounded-lg hover:opacity-90 transition-colors flex items-center gap-2"
            >
              <Users size={16} className="text-green-600" />
              <span style={{ color: themeColors.text }} className="text-sm">View Employee List</span>
            </button>
            <button
              onClick={() => navigate('/manager/analytics')}
              style={{ borderColor: themeColors.border }}
              className="w-full text-left p-3 border rounded-lg hover:opacity-90 transition-colors flex items-center gap-2"
            >
              <BarChart3 size={16} className="text-purple-600" />
              <span style={{ color: themeColors.text }} className="text-sm">Team Analytics</span>
            </button>
            <button
              onClick={() => window.print()}
              style={{ borderColor: themeColors.border }}
              className="w-full text-left p-3 border rounded-lg hover:opacity-90 transition-colors flex items-center gap-2"
            >
              <Edit2 size={16} className="text-amber-600" />
              <span style={{ color: themeColors.text }} className="text-sm">Print Hierarchy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHierarchy;
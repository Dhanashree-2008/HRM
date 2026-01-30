// src/pages/manager/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import Chatbot from '../../components/Chatbot';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  FileText,
  Shield,
  BarChart3,
  Settings,
  Search,
  Bell,
  LogOut,
  Menu,
  X,
  FolderLock,
  UserPlus,
  Building,
  FileCheck,
  ChevronDown,
  ChevronRight,
  Clock,
  Sun,
  Moon,
  DollarSign,
  Folder,
  Database,
  Clipboard,
  Target,
  TrendingUp,
  Activity,
  PieChart
} from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import LiteHRLogo from '../../images/LiteHR_logo.png';

export default function MainLayout({ logout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    employees: false,
    departments: false,
    roles: false,
    attendance: false,
    leaves: false,
    recruitment: false,
    vault: false
  });
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark read", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all read", err);
    }
  };

  const handleClearAll = async () => {
    try {
      await notificationService.clearAll();
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to clear notifications", err);
    }
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('litehr-theme');
    const isDark = savedTheme === 'dark';
    setDarkMode(isDark);
    applyTheme(isDark);
  }, []);

  // Apply theme to document
  const applyTheme = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#0f172a';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
    }
  };

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('litehr-theme', newDarkMode ? 'dark' : 'light');
    applyTheme(newDarkMode);
  };

  // Toggle section dropdown
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Navigation sections with dropdown structure
  const navigationSections = [
    {
      id: 'main',
      title: 'Main',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: <LayoutDashboard size={20} />,
          path: '/manager/dashboard'
        },
      ]
    },
    {
      id: 'employees',
      title: 'Employee Management',
      hasDropdown: true,
      icon: <Users size={20} />,
      items: [
        {
          id: 'employee-list',
          label: 'Employee List',
          icon: <Users size={16} />,
          path: '/manager/employees'
        },
      ]
    },
    {
      id: 'departments',
      title: 'Department Management',
      hasDropdown: true,
      icon: <Building size={20} />,
      items: [
        {
          id: 'department-list',
          label: 'Department List',
          icon: <Building size={16} />,
          path: '/manager/departments'
        },
        {
          id: 'add-department',
          label: 'Add Department',
          icon: <Building size={16} />,
          path: '/manager/departments/add'
        },
      ]
    },
    {
      id: 'roles',
      title: 'Roles & Permissions',
      hasDropdown: true,
      icon: <Shield size={20} />,
      items: [
        {
          id: 'role-list',
          label: 'Role List',
          icon: <Shield size={16} />,
          path: '/manager/roles'
        },
        {
          id: 'add-role',
          label: 'Add Role',
          icon: <Shield size={16} />,
          path: '/manager/roles/add'
        },
      ]
    },
    {
      id: 'attendance',
      title: 'Attendance Tracking',
      hasDropdown: false,
      icon: <Calendar size={20} />,
      items: [
        {
          id: 'attendance-monthly',
          label: 'Monthly Attendance',
          icon: <Calendar size={16} />,
          path: '/manager/attendance'
        },
      ]
    },
    {
      id: 'leaves',
      title: 'Leave Management',
      hasDropdown: true,
      icon: <FileCheck size={20} />,
      items: [
        {
          id: 'leave-requests',
          label: 'Leave Requests',
          icon: <FileCheck size={16} />,
          path: '/manager/leave-approval'
        },
        {
          id: 'leave-policy',
          label: 'Leave Policy',
          icon: <FileText size={16} />,
          path: '/manager/leave-policy'
        },
      ]
    },
    {
      id: 'recruitment',
      title: 'Recruitment',
      hasDropdown: true,
      icon: <Briefcase size={20} />,
      items: [
        {
          id: 'job-openings',
          label: 'Job Openings',
          icon: <Briefcase size={16} />,
          path: '/manager/recruitment'
        },
      ]
    },
    {
      id: 'vault',
      title: 'Secure Vault',
      hasDropdown: true,
      icon: <FolderLock size={20} />,
      items: [
        {
          id: 'documents',
          label: 'Document List',
          icon: <FolderLock size={16} />,
          path: '/manager/documents'
        },
        {
          id: 'upload-document',
          label: 'Upload Document',
          icon: <FileText size={16} />,
          path: '/manager/documents/upload'
        },
      ]
    },
    {
      id: 'settings',
      title: 'Settings',
      hasDropdown: false,
      icon: <Settings size={20} />,
      items: [
        {
          id: 'general-settings',
          label: 'General Settings',
          icon: <Settings size={16} />,
          path: '/manager/settings'
        },
      ]
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    if (logout) logout();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (sidebarOpen) setSidebarOpen(false);
  };

  const handleDirectLink = (path) => {
    navigate(path);
    if (sidebarOpen) setSidebarOpen(false);
  };

  // Check if item or any child is active
  const isItemActive = (item) => {
    const currentPath = location.pathname;
    if (item.path === currentPath) return true;
    if (item.items) {
      return item.items.some(child => child.path === currentPath);
    }
    return false;
  };

  // Check if child item is active
  const isChildActive = (path) => {
    return location.pathname === path;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/manager/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  // Add scrollbar CSS dynamically
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'custom-scrollbar-styles';
    style.textContent = `
      /* Custom scrollbar for sidebar */
      .sidebar-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: ${darkMode ? '#475569 #1e293b' : '#cbd5e1 #f1f5f9'};
        overscroll-behavior: contain;
      }
      
      .sidebar-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      
      .sidebar-scrollbar::-webkit-scrollbar-track {
        background: ${darkMode ? '#1e293b' : '#f1f5f9'};
        border-radius: 3px;
      }
      
      .sidebar-scrollbar::-webkit-scrollbar-thumb {
        background: ${darkMode ? '#475569' : '#cbd5e1'};
        border-radius: 3px;
      }
      
      .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
        background: ${darkMode ? '#64748b' : '#94a3b8'};
      }
      
      /* Custom scrollbar for main content */
      .main-content-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: ${darkMode ? '#475569 #0f172a' : '#cbd5e1 #f8fafc'};
        overscroll-behavior: contain;
      }
      
      .main-content-scrollbar::-webkit-scrollbar {
        width: 8px;
      }
      
      .main-content-scrollbar::-webkit-scrollbar-track {
        background: ${darkMode ? '#0f172a' : '#f8fafc'};
        border-radius: 4px;
      }
      
      .main-content-scrollbar::-webkit-scrollbar-thumb {
        background: ${darkMode ? '#475569' : '#cbd5e1'};
        border-radius: 4px;
      }
      
      .main-content-scrollbar::-webkit-scrollbar-thumb:hover {
        background: ${darkMode ? '#64748b' : '#94a3b8'};
      }
      
      /* Lock main content height */
      .main-content-container {
        max-height: calc(100vh - 64px);
        overflow-y: auto;
      }
      
      /* Sidebar container with fixed height */
      .sidebar-container {
        height: calc(100vh - 64px);
      }

      /* Dropdown animation */
      .dropdown-transition {
        transition: all 0.3s ease-in-out;
        overflow: hidden;
      }

      /* Notification scrollbar */
      .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: ${darkMode ? '#475569 #1e293b' : '#cbd5e1 #f1f5f9'};
      }
      
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-track {
        background: ${darkMode ? '#1e293b' : '#f1f5f9'};
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: ${darkMode ? '#475569' : '#cbd5e1'};
        border-radius: 3px;
      }
    `;

    // Remove old style if exists
    const oldStyle = document.getElementById('custom-scrollbar-styles');
    if (oldStyle) {
      oldStyle.remove();
    }

    document.head.appendChild(style);

    return () => {
      const styleToRemove = document.getElementById('custom-scrollbar-styles');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [darkMode]);

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-slate-50 text-gray-900'}`}>
      {/* Top Navigation Bar - Fixed */}
      <header className={`h-16 border-b flex-shrink-0 sticky top-0 z-50 shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
        }`}>
        <div className="h-full px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg lg:hidden transition-colors ${darkMode
                ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div
              onClick={() => navigate('/manager/dashboard')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2 shadow-sm">
                <img
                  src={LiteHRLogo}
                  alt="LiteHR"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <div className="hidden md:block">
                <p className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                  Manager Portal
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-slate-400'
                }`} size={18} />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search employees, departments..."
                className={`pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 lg:w-64 transition-all ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
                  : 'bg-white border-slate-300 text-slate-700 placeholder-slate-400'
                  }`}
              />
            </form>

            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${darkMode
                ? 'text-yellow-400 hover:text-yellow-300 hover:bg-gray-700'
                : 'text-indigo-600 hover:text-indigo-700 hover:bg-slate-100'
                }`}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notification Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-lg relative transition-colors ${darkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}>
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>

              {showNotifications && (
                <div className={`absolute right-0 top-12 w-80 rounded-xl shadow-xl border z-50 overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
                  }`}>
                  <div className={`p-4 border-b flex justify-between items-center ${darkMode ? 'border-gray-700' : 'border-slate-200'
                    }`}>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                      Notifications
                    </h3>
                    <div className="flex gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-xs text-blue-500 hover:text-blue-600 hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                      {notifications.length > 0 && (
                        <button
                          onClick={handleClearAll}
                          className="text-xs text-red-500 hover:text-red-600 hover:underline"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className={`p-8 text-center ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                        <Bell size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No notifications</p>
                      </div>
                    ) : (
                      notifications.map(item => (
                        <div
                          key={item.id}
                          className={`p-4 border-b last:border-0 transition-colors ${!item.isRead
                            ? (darkMode ? 'bg-gray-700/50' : 'bg-blue-50/50')
                            : ''
                            } ${darkMode ? 'border-gray-700 hover:bg-gray-700/30' : 'border-slate-100 hover:bg-slate-50'}`}
                        >
                          <div className="flex gap-3">
                            <div className={`mt-1 p-2 rounded-full h-fit flex-shrink-0 ${item.type === 'alert'
                              ? 'bg-red-100 text-red-600'
                              : item.type === 'success'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-blue-100 text-blue-600'
                              }`}>
                              <Bell size={14} />
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-slate-800'
                                }`}>
                                {item.title}
                              </p>
                              <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-slate-600'
                                }`}>
                                {item.message}
                              </p>
                              <div className="flex justify-between items-center">
                                <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-slate-400'
                                  }`}>
                                  {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {!item.isRead && (
                                  <button
                                    onClick={() => handleMarkRead(item.id)}
                                    className="text-[10px] text-blue-500 hover:text-blue-600 hover:underline"
                                  >
                                    Mark read
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600"
                onClick={() => navigate('/manager/settings')}
              >
                <span className="text-white font-medium text-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'M'}
                </span>
              </div>
              <div className="hidden md:block">
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                  {user.name || 'Manager'}
                </p>
                <p className={`text-xs flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                  <Clock size={10} />
                  Last active: Now
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`
          w-64 border-r
          transform transition-transform duration-300 flex-shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static
          fixed lg:relative top-16 lg:top-0 left-0 h-[calc(100vh-4rem)] lg:h-full z-40
          flex flex-col shadow-sm sidebar-container
          ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}
        `}>
          {/* Sidebar Content with Scrollbar */}
          <div className="p-4 flex-1 overflow-y-auto sidebar-scrollbar">
            {navigationSections.map((section) => (
              <div key={section.id} className="mb-2">
                {/* Direct link sections (Attendance, Settings) */}
                {!section.hasDropdown && section.id !== 'main' ? (
                  <button
                    onClick={() => handleDirectLink(section.items[0].path)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                      ${isChildActive(section.items[0].path)
                        ? (darkMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-600 text-white')
                        : (darkMode
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900')
                      }
                    `}
                  >
                    {section.icon}
                    <span>{section.title}</span>
                  </button>
                ) : section.hasDropdown ? (
                  <>
                    {/* Dropdown Section Header */}
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                        ${isItemActive(section)
                          ? (darkMode
                            ? 'bg-gray-700 text-blue-400'
                            : 'bg-slate-100 text-blue-600')
                          : (darkMode
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900')
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        {section.icon}
                        <span>{section.title}</span>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`transform transition-transform duration-300 ${expandedSections[section.id] ? 'rotate-180' : ''
                          }`}
                      />
                    </button>

                    {/* Dropdown Items */}
                    <div className={`
                      dropdown-transition
                      ${expandedSections[section.id] ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}
                    `}>
                      <div className="ml-8 space-y-1">
                        {section.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleNavigation(item.path)}
                            className={`
                              w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all
                              ${isChildActive(item.path)
                                ? (darkMode
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-blue-600 text-white')
                                : (darkMode
                                  ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900')
                              }
                            `}
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  /* Main Section */
                  <div>
                    <h3 className={`text-xs font-semibold uppercase tracking-wider mb-2 px-3 ${darkMode ? 'text-gray-500' : 'text-slate-500'
                      }`}>
                      {section.title}
                    </h3>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleNavigation(item.path)}
                          className={`
                            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                            ${isChildActive(item.path)
                              ? (darkMode
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-600 text-white')
                              : (darkMode
                                ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900')
                            }
                          `}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-slate-200 bg-slate-50'
            }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                  LiteHR v1.0.0
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                  Manager Access
                </p>
              </div>
              <button
                onClick={handleLogout}
                className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${darkMode
                  ? 'text-red-400 hover:text-red-300 hover:bg-gray-800'
                  : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                  }`}
                title="Logout"
              >
                <LogOut size={16} />
                <span className="text-xs hidden lg:inline">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <div className="main-content-container main-content-scrollbar">
              <div className={`p-4 md:p-6 ${darkMode ? 'bg-gray-900' : 'bg-slate-50'
                }`}>
                <Outlet context={{ darkMode }} />
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className={`px-6 py-4 border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
            }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                  © 2024 LiteHR Manager Portal
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-600' : 'text-slate-400'
                  }`}>
                  For internal use only
                </p>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className={`text-sm hover:underline ${darkMode
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-blue-600 hover:text-blue-700'
                    }`}
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className={`text-sm hover:underline ${darkMode
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-blue-600 hover:text-blue-700'
                    }`}
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className={`text-sm hover:underline ${darkMode
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-blue-600 hover:text-blue-700'
                    }`}
                >
                  Help & Support
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
      <Chatbot />
    </div>
  );
}
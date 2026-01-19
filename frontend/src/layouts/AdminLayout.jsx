import { ThemeWrapper } from '../contexts/ThemeContext';
import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"; // Added useNavigate
import {
  FiHome,
  FiUsers,
  FiLayers,
  FiCalendar,
  FiSettings,
  FiLogOut,
  FiBell,
  FiChevronDown,
  FiUser,
  FiMessageSquare,
  FiGrid,
  FiBriefcase,
  FiShield,
  FiFileText,
  FiPieChart,
  FiClipboard,
  FiSearch,
  FiTrendingUp,
  FiActivity,
  FiLock,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { AiOutlineAudit } from "react-icons/ai";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate(); // Added useNavigate
  const [userDropdown, setUserDropdown] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null);

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("/api/auth/getUser", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  // Initialize theme from localStorage or default to dark
  useEffect(() => {
    const savedTheme = localStorage.getItem('litehr-theme');
    if (savedTheme) {
      const isDark = savedTheme === 'dark';
      setDarkMode(isDark);
      applyTheme(isDark);
    } else {
      setDarkMode(true);
      applyTheme(true);
    }
  }, []);

  // Apply theme classes to document
  const applyTheme = (isDark) => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark-mode');
      html.classList.remove('light-mode');
    } else {
      html.classList.add('light-mode');
      html.classList.remove('dark-mode');
    }
  };

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('litehr-theme', newDarkMode ? 'dark' : 'light');
    applyTheme(newDarkMode);
  };

  const toggleMenu = (label) => {
    setExpandedMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  // Function to handle logo click
  const handleLogoClick = () => {
    navigate('/admin/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const userInitials = user?.employee?.fullName
    ? user.employee.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AU';

  const menuItems = [
    { label: "Dashboard", icon: <FiGrid />, path: "/admin/dashboard" },

    // Employees Module
    {
      label: "Employees",
      icon: <FiUsers />,
      path: "/admin/employees",
      subItems: [
        { label: "Employee List", path: "/admin/employees" },
        { label: "Add Employee", path: "/admin/employees/add" },
      ]
    },

    // Departments Module
    {
      label: "Departments",
      icon: <HiOutlineOfficeBuilding />,
      path: "/admin/departments",
      subItems: [
        { label: "Department List", path: "/admin/departments" },
        { label: "Add Department", path: "/admin/departments/add" },
      ]
    },

    // Roles & Permissions Module
    {
      label: "Roles & Permissions",
      icon: <FiShield />,
      path: "/admin/roles",
      subItems: [
        { label: "Role List", path: "/admin/roles" },
        { label: "Add Role", path: "/admin/roles/add" },
      ]
    },

    // Attendance Module
    {
      label: "Attendance",
      icon: <FiCalendar />,
      path: "/admin/attendance",
      subItems: [
        { label: "Monthly", path: "/admin/attendance/monthly" },
        { label: "Reports", path: "/admin/attendance/reports" },
      ]
    },

    // Leaves Module
    {
      label: "Leaves",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>,
      path: "/admin/leaves",
      subItems: [
        { label: "Leave Requests", path: "/admin/leaves/requests" },
        { label: "Leave Policy", path: "/admin/leaves/policy" },
      ]
    },

    // Recruitment Module
    {
      label: "Recruitment",
      icon: <FiBriefcase />,
      path: "/admin/recruitment",
      subItems: [
        { label: "Job Openings", path: "/admin/recruitment/jobs" },
        { label: "Add Job", path: "/admin/recruitment/add-job" },
        { label: "Applications", path: "/admin/recruitment/applications" },
      ]
    },

    // Secure Vault Module
    {
      label: "Secure Vault",
      icon: <FiLock />,
      path: "/admin/vault",
      subItems: [
        { label: "Document List", path: "/admin/vault" },
        { label: "Upload Document", path: "/admin/vault/upload" },
      ]
    },

    // Analytics Module
    {
      label: "Analytics",
      icon: <FiTrendingUp />,
      path: "/admin/analytics",
      subItems: [
        { label: "Dashboard", path: "/admin/analytics" },
      ]
    },

    // Settings Module
    { label: "Settings", icon: <FiSettings />, path: "/admin/settings" },
  ];

  const notifications = [
    { id: 1, text: "New leave request from Rahul Sharma", time: "2 min ago", unread: true },
    { id: 2, text: "Performance review scheduled", time: "1 hour ago", unread: true },
    { id: 3, text: "System maintenance tonight", time: "3 hours ago", unread: false },
  ];

  // Helper function to check if a path is active
  const isActivePath = (itemPath, currentPath) => {
    if (itemPath === currentPath) return true;
    if (currentPath.startsWith(itemPath) && itemPath !== "/admin") return true;
    return false;
  };

  // Helper function to check if any sub-item is active
  const isSubItemActive = (subItems, currentPath) => {
    return subItems?.some(subItem => isActivePath(subItem.path, currentPath));
  };

  // Determine sidebar background based on theme
  const sidebarBg = darkMode ? "bg-gray-800" : "bg-white";
  const sidebarText = darkMode ? "text-white" : "text-gray-800";
  const sidebarBorder = darkMode ? "border-gray-700" : "border-gray-200";
  const sidebarHoverBg = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100";

  // Determine main content background
  const headerBg = darkMode ? "bg-gray-800" : "bg-white";
  const headerText = darkMode ? "text-white" : "text-gray-800";
  const headerBorder = darkMode ? "border-gray-700" : "border-gray-200";

  return (
    <div className={`flex h-screen transition-colors duration-300`}>
      {/* SIDEBAR */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} ${sidebarBg} ${sidebarText} flex flex-col transition-all duration-300 shadow-lg z-20 border-r ${sidebarBorder}`}>

        {/* Logo - Now clickable */}
        <div className={`px-6 py-5 border-b ${sidebarBorder}`}>
          <div className="flex items-center justify-start">
            {/* Expanded sidebar logo - Clickable */}
            {!sidebarCollapsed && (
              <div
                className="w-[160px] h-auto flex items-start justify-start mr-4 cursor-pointer"
                onClick={handleLogoClick}
                title="Go to Dashboard"
              >
                <img
                  src="/assets/logo.png"
                  alt="LiteHR Logo"
                  className="w-[100px] h-auto object-contain hover:opacity-80 transition-opacity"
                  style={{
                    filter: darkMode ? 'invert(0)' : 'invert(58%) sepia(81%) saturate(2878%) hue-rotate(246deg) brightness(97%) contrast(94%)'
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML =
                      `<div class="${darkMode ? 'text-white hover:text-purple-300' : 'text-purple-600 hover:text-purple-700 font-bold'} text-lg cursor-pointer transition-colors" title="Go to Dashboard">LiteHR</div>`;
                  }}
                />
              </div>
            )}

            {/* Collapsed sidebar logo - Clickable */}
            {sidebarCollapsed && (
              <div
                className="w-8 h-8 flex items-center justify-start cursor-pointer"
                onClick={handleLogoClick}
                title="Go to Dashboard"
              >
                <img
                  src="/assets/logo.png"
                  alt="LiteHR Logo"
                  className="w-full h-auto object-contain hover:opacity-80 transition-opacity"
                  style={{
                    filter: darkMode ? 'invert(0)' : 'invert(58%) sepia(81%) saturate(2878%) hue-rotate(246deg) brightness(97%) contrast(94%)'
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML =
                      `<div class="${darkMode ? 'text-white hover:text-purple-300' : 'text-purple-600 hover:text-purple-700 font-bold'} text-sm cursor-pointer transition-colors" title="Go to Dashboard">LH</div>`;
                  }}
                />
              </div>
            )}

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`p-2 rounded-lg ${sidebarHoverBg} transition-colors ml-auto`}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={sidebarCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = isActivePath(item.path, location.pathname) || isSubItemActive(item.subItems, location.pathname);
            const isExpanded = expandedMenus[item.label];
            const hasSubItems = item.subItems && item.subItems.length > 0;

            const activeBg = darkMode ? "bg-purple-600" : "bg-purple-100";
            const activeText = darkMode ? "text-white" : "text-purple-800";
            const inactiveText = darkMode ? "text-gray-300" : "text-gray-600";
            const inactiveHoverText = darkMode ? "hover:text-white" : "hover:text-gray-900";
            const inactiveHoverBg = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100";
            const subItemActiveBg = darkMode ? "bg-purple-600/20" : "bg-purple-50";
            const subItemActiveText = darkMode ? "text-white" : "text-purple-700";
            const subItemBorder = darkMode ? "border-purple-500" : "border-purple-500";

            return (
              <div
                key={item.path}
                className="space-y-1"
              >
                {hasSubItems ? (
                  <>
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className={[
                        "relative w-full flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200",
                        isActive
                          ? `${activeBg} ${activeText}`
                          : `${inactiveText} ${inactiveHoverText} ${inactiveHoverBg}`,
                        sidebarCollapsed ? "justify-center" : ""
                      ].join(" ")}
                      title={sidebarCollapsed ? item.label : ""}
                    >
                      <span className="text-lg">
                        {item.icon}
                      </span>
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </button>

                    {/* Sub-menu items */}
                    {!sidebarCollapsed && item.subItems && (
                      <div className={`
                        ml-4 space-y-1 pl-3 border-l ${darkMode ? 'border-gray-700' : 'border-gray-300'}
                        overflow-hidden transition-all duration-200 ease-in-out
                        ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                      `}>
                        <div className="pb-2 pt-1">
                          {item.subItems.map((subItem) => {
                            const isSubActive = location.pathname === subItem.path;
                            return (
                              <Link
                                key={subItem.path}
                                to={subItem.path}
                                className={[
                                  "relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                                  "transition-all duration-200",
                                  isSubActive
                                    ? `${subItemActiveBg} ${subItemActiveText} border-l-2 ${subItemBorder}`
                                    : `${inactiveText} ${inactiveHoverText} ${inactiveHoverBg}`
                                ].join(" ")}
                              >
                                <div
                                  className={`w-1.5 h-1.5 rounded-full ${isSubActive
                                      ? (darkMode ? "bg-purple-500" : "bg-purple-600")
                                      : (darkMode ? "bg-gray-500" : "bg-gray-400")
                                    }`}
                                />
                                <span>{subItem.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={[
                      "flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200",
                      isActive
                        ? `${activeBg} ${activeText}`
                        : `${inactiveText} ${inactiveHoverText} ${inactiveHoverBg}`,
                      sidebarCollapsed ? "justify-center" : ""
                    ].join(" ")}
                    title={sidebarCollapsed ? item.label : ""}
                  >
                    <span className="text-lg">
                      {item.icon}
                    </span>
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {isActive && (
                          <span className={`w-2 h-2 rounded-full ${darkMode ? 'bg-purple-400' : 'bg-purple-600'}`}></span>
                        )}
                      </>
                    )}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className={`p-4 border-t ${sidebarBorder}`}>
          {!sidebarCollapsed ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-purple-600' : 'bg-purple-500'} flex items-center justify-center text-white font-bold`}>
                  {userInitials}
                </div>
                <div>
                  <p className={`font-medium ${sidebarText}`}>
                    {user?.employee?.fullName || "Admin User"}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Admin</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className={`w-full flex items-center justify-center gap-2 text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} ${sidebarText} px-3 py-2 rounded-lg hover:bg-purple-600 dark:hover:bg-purple-100 ${darkMode ? 'hover:text-white' : 'hover:text-purple-800'} transition-all duration-200 border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
              >
                <FiLogOut />
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-purple-600' : 'bg-purple-500'} flex items-center justify-center text-white font-bold text-sm`}>
                {userInitials}
              </div>
              <button
                onClick={handleLogout}
                className={`p-2 rounded-lg ${sidebarHoverBg} transition-colors`}
              >
                <FiLogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className={`${headerBg} px-6 py-3 border-b ${headerBorder} flex justify-between items-center shadow-sm`}>
          <div>
            <h1 className={`text-lg font-semibold ${headerText}`}>
              {(() => {
                const activeItem = menuItems.find(item =>
                  isActivePath(item.path, location.pathname) || isSubItemActive(item.subItems, location.pathname)
                );

                if (activeItem) {
                  // Check if a sub-item is active
                  const activeSubItem = activeItem.subItems?.find(subItem =>
                    location.pathname === subItem.path
                  );

                  if (activeSubItem) {
                    return `${activeItem.label} › ${activeSubItem.label}`;
                  }
                  return activeItem.label;
                }
                return "Dashboard";
              })()}
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              HR Management System
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Dark/Light Mode Toggle */}
            <div>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg ${sidebarHoverBg} transition-colors`}
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? (
                  <FiSun className="w-5 h-5 text-amber-300" />
                ) : (
                  <FiMoon className="w-5 h-5 text-purple-600" />
                )}
              </button>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`p-2 rounded-lg ${sidebarHoverBg} transition-colors relative`}
              >
                <IoMdNotificationsOutline className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.filter(n => n.unread).length}
                </span>
              </button>

              {notificationsOpen && (
                <div className={`absolute right-0 mt-2 w-80 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg border ${sidebarBorder} py-2 z-50`}>
                  <div className={`px-4 py-3 border-b ${sidebarBorder}`}>
                    <h3 className={`font-semibold ${sidebarText}`}>Notifications</h3>
                  </div>
                  {notifications.map(notif => (
                    <div key={notif.id} className={`px-4 py-3 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors ${notif.unread ? (darkMode ? 'bg-purple-600/10' : 'bg-purple-50') : ''}`}>
                      <p className={`text-sm ${sidebarText}`}>{notif.text}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                        {notif.time}
                      </p>
                    </div>
                  ))}
                  <div className={`border-t ${sidebarBorder} px-4 py-3`}>
                    <Link
                      to="/admin/notifications"
                      onClick={() => setNotificationsOpen(false)}
                      className={`block w-full text-center text-sm ${darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'} transition-colors`}
                    >
                      View All Updates
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Clock */}
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} ${darkMode ? 'text-gray-300' : 'text-gray-600'} px-4 py-2 rounded-lg text-sm font-medium border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className={`flex items-center gap-2 p-2 rounded-lg ${sidebarHoverBg} transition-colors`}
              >
                <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-purple-600' : 'bg-purple-500'} flex items-center justify-center text-white font-bold text-sm`}>
                  {userInitials}
                </div>
                <FiChevronDown className={`transition-transform ${userDropdown ? 'rotate-180' : ''} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              </button>

              {userDropdown && (
                <div className={`absolute right-0 mt-2 w-48 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg border ${sidebarBorder} py-2 z-50`}>
                  <div className={`px-4 py-3 border-b ${sidebarBorder}`}>
                    <p className={`font-semibold ${sidebarText}`}>
                      {user?.employee?.fullName || "Admin User"}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      {user?.email || "admin@hr.com"}
                    </p>
                  </div>
                  <button className={`w-full text-left px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'} transition-colors`}>
                    <FiUser className="inline mr-2" /> Profile
                  </button>
                  <button className={`w-full text-left px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'} transition-colors`}>
                    <FiSettings className="inline mr-2" /> Settings
                  </button>
                  <div className={`border-t ${sidebarBorder} mt-2 pt-2`}>
                    <button
                      onClick={handleLogout}
                      className={`w-full text-left px-4 py-2 text-sm ${darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-50'} transition-colors`}
                    >
                      <FiLogOut className="inline mr-2" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className={`flex-1 overflow-y-auto p-6 transition-colors duration-300`}>
          <div className="w-full">
            <ThemeWrapper darkMode={darkMode}>
              <Outlet />
            </ThemeWrapper>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
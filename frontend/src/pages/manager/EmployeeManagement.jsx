import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Filter, Plus, Mail, Phone, ChevronDown, MoreVertical, XCircle, User, Briefcase, Calendar } from 'lucide-react';
import { managerService } from '../../services/managerService';

const EmployeeManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await managerService.getEmployees();
      const formatted = data.map(item => ({
        id: item.id,
        name: item.employee?.fullName || 'N/A',
        email: item.email,
        phone: item.employee?.phone || 'N/A',
        department: item.employee?.department?.name || item.employee?.department || 'N/A',
        role: item.role,
        status: (item.employee?.status || 'active').toLowerCase(),
        avatar: item.employee?.fullName ? item.employee.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'UE',
        original: item,
        // Additional details for modal
        designation: item.employee?.designation || 'N/A',
        joiningDate: item.employee?.joiningDate || 'N/A',
        address: item.employee?.address || 'N/A'
      }));
      setEmployees(formatted);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch employees", err);
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  if (loading) return <div className="p-6 text-center" style={{ color: themeColors.muted }}>Loading team members...</div>;

  return (
    <div className="space-y-6 transition-colors duration-300" style={{ backgroundColor: themeColors.background, minHeight: '100vh', padding: '1.5rem' }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold transition-colors duration-300" style={{ color: themeColors.text }}>Team Members</h1>
          <p className="transition-colors duration-300" style={{ color: themeColors.muted }}>Manage your team members and their details</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="rounded-xl shadow-sm p-4 transition-colors duration-300" style={{ backgroundColor: themeColors.card, border: `1px solid ${themeColors.border}` }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300" size={18} style={{ color: themeColors.muted }} />
            <input
              type="search"
              placeholder="Search by name, department, or role..."
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
              >
                <option>All Departments</option>
                <option>Engineering</option>
                <option>Marketing</option>
                <option>Sales</option>
                <option>HR</option>
              </select>
            </div>
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
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Members', value: employees.length, color: themeColors.text },
          { label: 'Active', value: employees.filter(e => e.status === 'active').length, color: themeColors.secondary },
          { label: 'Departments', value: [...new Set(employees.map(e => e.department))].length, color: themeColors.accent },
          { label: 'Avg. Attendance', value: '--%', color: themeColors.primary }, // Placeholder for now
        ].map((stat, i) => (
          <div key={i} className="rounded-xl shadow-sm p-4 transition-colors duration-300" style={{ backgroundColor: themeColors.card, border: `1px solid ${themeColors.border}` }}>
            <p className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>{stat.label}</p>
            <p className="text-2xl font-bold mt-2 transition-colors duration-300" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Employee Table */}
      <div className="rounded-xl shadow-sm overflow-hidden transition-colors duration-300" style={{ backgroundColor: themeColors.card, border: `1px solid ${themeColors.border}` }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="transition-colors duration-300" style={{ backgroundColor: isDarkMode ? `${themeColors.background}` : '#f8fafc' }}>
                <th className="py-3 px-4 text-left text-sm font-medium transition-colors duration-300" style={{ color: themeColors.text }}>Employee</th>
                <th className="py-3 px-4 text-left text-sm font-medium transition-colors duration-300" style={{ color: themeColors.text }}>Contact</th>
                <th className="py-3 px-4 text-left text-sm font-medium transition-colors duration-300" style={{ color: themeColors.text }}>Department</th>
                <th className="py-3 px-4 text-left text-sm font-medium transition-colors duration-300" style={{ color: themeColors.text }}>Role</th>
                <th className="py-3 px-4 text-left text-sm font-medium transition-colors duration-300" style={{ color: themeColors.text }}>Status</th>
                <th className="py-3 px-4 text-left text-sm font-medium transition-colors duration-300" style={{ color: themeColors.text }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y transition-colors duration-300" style={{ divideColor: themeColors.border }}>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:opacity-90 transition-colors duration-300" style={{ backgroundColor: themeColors.card }}>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: `${themeColors.primary}20` }}>
                        <span className="font-semibold transition-colors duration-300" style={{ color: themeColors.text }}>{employee.avatar}</span>
                      </div>
                      <div>
                        <p className="font-medium transition-colors duration-300" style={{ color: themeColors.text }}>{employee.name}</p>
                        <p className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>{employee.id ? `ID: EMP${String(employee.id).substring(0, 6)}` : 'ID: N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Mail size={14} style={{ color: themeColors.muted }} />
                        <span className="text-sm transition-colors duration-300" style={{ color: themeColors.text }}>{employee.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone size={14} style={{ color: themeColors.muted }} />
                        <span className="text-sm transition-colors duration-300" style={{ color: themeColors.text }}>{employee.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="transition-colors duration-300" style={{ color: themeColors.text }}>{employee.department}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="transition-colors duration-300" style={{ color: themeColors.text }}>{employee.role}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300`}
                      style={{
                        backgroundColor: employee.status === 'active' ? `${themeColors.secondary}20` : `${themeColors.danger}20`,
                        color: employee.status === 'active' ? themeColors.secondary : themeColors.danger
                      }}>
                      {employee.status ? (employee.status.charAt(0).toUpperCase() + employee.status.slice(1)) : 'Unknown'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewEmployee(employee)}
                        className="text-sm font-medium hover:underline transition-colors duration-300"
                        style={{ color: themeColors.primary }}
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center transition-colors duration-300" style={{ color: themeColors.muted }}>
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Details Modal */}
      {showModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fadeIn transition-colors duration-300" style={{ backgroundColor: themeColors.card }}>
            {/* Modal Header */}
            <div className="relative p-6 rounded-t-xl overflow-hidden transition-colors duration-300" style={{ backgroundColor: isDarkMode ? themeColors.background : '#1e293b' }}>
              <div className="absolute top-0 right-0 p-4 z-50">
                <button onClick={closeModal} className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors">
                  <XCircle size={24} />
                </button>
              </div>

              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
                <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white/20 shadow-lg transition-colors duration-300" style={{ backgroundColor: themeColors.card, color: themeColors.text }}>
                  {selectedEmployee.avatar}
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white">{selectedEmployee.name}</h3>
                  <p className="text-blue-200">{selectedEmployee.designation}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
                    <span className="flex items-center text-sm bg-white/10 px-3 py-1 rounded-full backdrop-blur-md text-white">
                      <Briefcase size={14} className="mr-2" /> {selectedEmployee.department}
                    </span>
                    <span className="flex items-center text-sm bg-white/10 px-3 py-1 rounded-full backdrop-blur-md text-white">
                      <User size={14} className="mr-2" /> {selectedEmployee.role}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300`}
                      style={{
                        backgroundColor: selectedEmployee.status === 'active' ? `${themeColors.secondary}20` : `${themeColors.danger}20`,
                        color: selectedEmployee.status === 'active' ? themeColors.secondary : themeColors.danger
                      }}>
                      {selectedEmployee.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body with Tabs */}
            <ModalTabs employee={selectedEmployee} themeColors={themeColors} isDarkMode={isDarkMode} />
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for Tabs to keep main file clean
const ModalTabs = ({ employee, themeColors, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [leaveBalances, setLeaveBalances] = useState({});
  const [attendanceStats, setAttendanceStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    earlyExit: 0,
    overtime: 0,
  });

  useEffect(() => {
    if (activeTab === 'leaves') { // Fetch on tab activation or initially if we want pre-loading
      fetchLeaveBalance();
    } else if (activeTab === 'attendance') {
      fetchAttendanceStats();
    }
  }, [activeTab]);

  const fetchLeaveBalance = async () => {
    try {
      setLoading(true);
      const balances = await managerService.getLeaveBalanceByEmployeeId(employee.id);

      const balObj = {
        earned: { total: 0, used: 0, remaining: 0 },
        sick: { total: 0, used: 0, remaining: 0 },
        casual: { total: 0, used: 0, remaining: 0 },
      };

      if (Array.isArray(balances)) {
        balances.forEach(b => {
          const code = (b.code || b.leaveType?.code || b.leaveType || '').toLowerCase();
          let key = '';
          if (code.includes('casual') || code === 'cl') key = 'casual';
          else if (code.includes('sick') || code === 'sl') key = 'sick';
          else if (code.includes('earned') || code.includes('paid') || code === 'el' || code === 'pl') key = 'earned';

          if (key) {
            balObj[key] = {
              total: b.total || (b.used + b.remaining),
              used: b.used,
              remaining: b.remaining
            };
          }
        });
      }
      setLeaveBalances(balObj);
    } catch (err) {
      console.error("Failed to fetch leave balance", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceStats = async () => {
    try {
      setLoading(true);
      const attendance = await managerService.getEmployeeAttendance(employee.id);

      // Calculate stats client-side based on history
      // This is a simple calculation based on status strings
      const stats = {
        present: 0,
        absent: 0,
        late: 0,
        earlyExit: 0,
        overtime: 0,
      };

      if (Array.isArray(attendance)) {
        attendance.forEach(record => {
          const status = (record.status || '').toUpperCase();
          if (status === 'PRESENT') stats.present++;
          else if (status === 'LATE') stats.late++;
          else if (status === 'ABSENT') stats.absent++;
          else if (status === 'HALF_DAY') { stats.present += 0.5; stats.absent += 0.5; }

          if (record.overtimeHours > 0) stats.overtime += record.overtimeHours;
          if (record.checkOutTime && record.shiftEndTime && new Date(record.checkOutTime) < new Date(record.shiftEndTime)) stats.earlyExit++;
        });
      }
      setAttendanceStats(stats);
    } catch (err) {
      console.error("Failed to fetch attendance", err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'leaves', label: 'Leaves', icon: Briefcase },
    { id: 'performance', label: 'Performance', icon: MoreVertical },
  ];

  return (
    <div>
      {/* Tab Nav */}
      <div className="flex border-b px-6 pt-4 space-x-6 overflow-x-auto transition-colors duration-300" style={{ borderColor: themeColors.border }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 flex items-center space-x-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap`}
              style={{
                borderColor: activeTab === tab.id ? themeColors.primary : 'transparent',
                color: activeTab === tab.id ? themeColors.primary : themeColors.muted
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6 h-[400px] overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-full transition-colors duration-300" style={{ color: themeColors.muted }}>Loading data...</div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-xl border transition-colors duration-300" style={{ backgroundColor: isDarkMode ? `${themeColors.background}` : '#f8fafc', borderColor: themeColors.border }}>
                    <h4 className="text-sm font-semibold mb-3 flex items-center transition-colors duration-300" style={{ color: themeColors.text }}><Mail size={16} className="mr-2" style={{ color: themeColors.primary }} /> Contact Info</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs transition-colors duration-300" style={{ color: themeColors.muted }}>Email Address</p>
                        <p className="text-sm font-medium transition-colors duration-300" style={{ color: themeColors.text }}>{employee.email}</p>
                      </div>
                      <div>
                        <p className="text-xs transition-colors duration-300" style={{ color: themeColors.muted }}>Phone Number</p>
                        <p className="text-sm font-medium transition-colors duration-300" style={{ color: themeColors.text }}>{employee.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border transition-colors duration-300" style={{ backgroundColor: isDarkMode ? `${themeColors.background}` : '#f8fafc', borderColor: themeColors.border }}>
                    <h4 className="text-sm font-semibold mb-3 flex items-center transition-colors duration-300" style={{ color: themeColors.text }}><Briefcase size={16} className="mr-2" style={{ color: themeColors.accent }} /> Professional Info</h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs transition-colors duration-300" style={{ color: themeColors.muted }}>Joining Date</p>
                          <p className="text-sm font-medium transition-colors duration-300" style={{ color: themeColors.text }}>{employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs transition-colors duration-300" style={{ color: themeColors.muted }}>Employee ID</p>
                          <p className="text-sm font-medium transition-colors duration-300" style={{ color: themeColors.text }}>{employee.original.employeeCode || `EMP${employee.id}`}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs transition-colors duration-300" style={{ color: themeColors.muted }}>Address</p>
                        <p className="text-sm font-medium transition-colors duration-300" style={{ color: themeColors.text }}>{employee.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Overview Stats */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 transition-colors duration-300" style={{ color: themeColors.text }}>Quick Overview</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg border text-center transition-colors duration-300" style={{ backgroundColor: `${themeColors.secondary}10`, borderColor: `${themeColors.secondary}30` }}>
                      <p className="text-2xl font-bold transition-colors duration-300" style={{ color: themeColors.secondary }}>{employee.status === 'active' ? 'Active' : 'Inactive'}</p>
                      <p className="text-xs transition-colors duration-300" style={{ color: themeColors.secondary }}>Status</p>
                    </div>
                    <div className="p-4 rounded-lg border text-center transition-colors duration-300" style={{ backgroundColor: `${themeColors.primary}10`, borderColor: `${themeColors.primary}30` }}>
                      <p className="text-2xl font-bold transition-colors duration-300" style={{ color: themeColors.primary }}>Full Time</p>
                      <p className="text-xs transition-colors duration-300" style={{ color: themeColors.primary }}>Type</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="space-y-6">
                <div className="p-4 rounded-lg border mb-4 transition-colors duration-300" style={{ backgroundColor: `${themeColors.primary}10`, borderColor: `${themeColors.primary}30` }}>
                  <p className="text-sm" style={{ color: themeColors.primary }}>
                    <strong>Note:</strong> These statistics are a snapshot of the current month.
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { label: 'Present', value: attendanceStats.present, color: themeColors.secondary },
                    { label: 'Absent', value: attendanceStats.absent, color: themeColors.danger },
                    { label: 'Late', value: attendanceStats.late, color: themeColors.warning },
                    { label: 'Early Exit', value: attendanceStats.earlyExit, color: '#f97316' }, // Orange
                    { label: 'Overtime', value: `${attendanceStats.overtime}h`, color: themeColors.primary }
                  ].map((stat, i) => (
                    <div key={i} className="p-4 rounded-xl border shadow-sm text-center transition-colors duration-300" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}>
                      <p className="text-3xl font-bold transition-colors duration-300" style={{ color: stat.color }}>{stat.value}</p>
                      <p className="text-xs uppercase tracking-wider mt-1 transition-colors duration-300" style={{ color: themeColors.muted }}>{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'leaves' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold transition-colors duration-300" style={{ color: themeColors.text }}>Leave Balance</h4>
                <div className="grid grid-cols-1 gap-4">
                  {Object.keys(leaveBalances).length > 0 ? Object.entries(leaveBalances).map(([type, balance]) => (
                    <div key={type} className="p-5 rounded-xl border shadow-sm flex flex-col justify-center transition-colors duration-300" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}>
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-bold capitalize transition-colors duration-300" style={{ color: themeColors.text }}>{type} Leave</h5>
                        <span className="text-sm font-medium transition-colors duration-300" style={{ color: themeColors.muted }}>{balance.remaining} remaining</span>
                      </div>
                      <div className="w-full rounded-full h-2.5 overflow-hidden transition-colors duration-300" style={{ backgroundColor: themeColors.background }}>
                        <div
                          className={`h-2.5 rounded-full`}
                          style={{
                            width: `${(balance.remaining / (balance.total || 1)) * 100}%`,
                            backgroundColor: type === 'earned' ? themeColors.accent : type === 'sick' ? themeColors.secondary : themeColors.primary
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-2 text-xs transition-colors duration-300" style={{ color: themeColors.muted }}>
                        <span>Used: {balance.used}</span>
                        <span>Total: {balance.total}</span>
                      </div>
                    </div>
                  )) : (
                    <p className="text-center py-4 transition-colors duration-300" style={{ color: themeColors.muted }}>No leave data available.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: isDarkMode ? `${themeColors.background}` : '#f1f5f9', color: themeColors.muted }}>
                  <MoreVertical size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-medium transition-colors duration-300" style={{ color: themeColors.text }}>Performance Review</h4>
                  <p className="max-w-xs mx-auto transition-colors duration-300" style={{ color: themeColors.muted }}>Performance data and reviews will be available here once the designated appraisal cycle begins.</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;
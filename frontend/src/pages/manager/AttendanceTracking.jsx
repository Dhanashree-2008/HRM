import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  ChevronDown,
  Eye,
  User,
  Mail,
  Phone,
  BarChart3,
  Plus,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Edit
} from 'lucide-react';
import { managerService } from '../../services/managerService';
import ManagerAttendanceCalendar from './ManagerAttendanceCalendar';

const AttendanceTracking = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showMarkAttendance, setShowMarkAttendance] = useState(false);
  const [markingData, setMarkingData] = useState({
    employeeId: '',
    status: 'present',
    notes: ''
  });

  // Updated attendance data to match dashboard metrics
  const [attendanceData, setAttendanceData] = useState([]);
  const [analytics, setAnalytics] = useState({
    trends: { weekly: 0, monthly: 0, late: 0 },
    departmentStats: []
  });
  const [loading, setLoading] = useState(true);

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
    fetchAttendance();
    fetchAnalytics();
  }, [selectedDate]);

  const fetchAnalytics = async () => {
    try {
      const data = await managerService.getTeamAttendanceAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
    }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      // Fetch both attendance records and all employees to ensure full list
      const [attendanceRes, employeesRes] = await Promise.all([
        managerService.getTeamAttendance(selectedDate),
        managerService.getEmployees()
      ]);

      const attendanceList = attendanceRes.teamAttendance || attendanceRes || [];
      const employeeList = Array.isArray(employeesRes) ? employeesRes : (employeesRes.employees || []);

      const formatted = employeeList.map((user) => {
        // user is the User object, user.employee is the Employee Profile
        const empProfile = user.employee;
        if (!empProfile) return null; // Skip users without employee profile

        // Find attendance record for this employee
        const record = attendanceList.find(r =>
          r.employeeId === empProfile.id ||
          (r.employee && r.employee.id === empProfile.id)
        );

        return {
          id: record?.id || `emp-${empProfile.id}`,
          employeeId: empProfile.id,
          employee: empProfile.fullName || 'Unknown',
          department: empProfile.department || 'N/A',
          status: record ? (record.status ? record.status.toLowerCase() : 'present') : 'absent',
          checkIn: record?.markIn ? new Date(record.markIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
          checkOut: record?.markOut ? new Date(record.markOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
          lateMinutes: record?.lateMinutes || 0,
          notes: record?.notes || '',
          avatar: (empProfile.fullName || 'U').split(' ').map(n => n[0]).join('').substring(0, 2),
          email: empProfile.personalEmail || user.email || '',
          phone: empProfile.phone || '',
          attendanceScore: record?.attendanceScore || 0
        };
      }).filter(Boolean);

      setAttendanceData(formatted);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  const departments = ['All Departments', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
  const statusOptions = ['All', 'Present', 'Absent', 'Late', 'Half-Day'];

  const filteredData = attendanceData.filter(record => {
    // Allow both 'all' and 'All Departments' values from selects
    if (selectedDepartment !== 'all' && selectedDepartment.toLowerCase() !== 'all departments' && record.department && record.department.toLowerCase() !== selectedDepartment.toLowerCase()) return false;
    if (selectedStatus !== 'all' && selectedStatus.toLowerCase() !== 'all' && record.status && record.status.toLowerCase() !== selectedStatus.toLowerCase()) return false;
    if (searchTerm && !record.employee.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !record.department.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Calculate overall attendance percentage to match dashboard (92%)
  const calculateOverallAttendance = () => {
    const totalRecords = attendanceData.length;
    if (!totalRecords) return 0;
    const presentRecords = attendanceData.filter(r => {
      const s = (r.status || '').toLowerCase();
      return s === 'present' || s === 'half-day' || s === 'late';
    }).length;
    return Math.round((presentRecords / totalRecords) * 100);
  };

  // Calculate average attendance score to match employee management page
  const calculateAverageAttendanceScore = () => {
    if (!attendanceData.length) return 0;
    const totalScore = attendanceData.reduce((sum, record) => sum + (record.attendanceScore || 0), 0);
    return Math.round(totalScore / attendanceData.length);
  };

  const handleMarkAttendance = async (employeeId, newStatus, notes = '') => {
    try {
      await managerService.markEmployeeAttendance({
        employeeId,
        status: newStatus,
        date: selectedDate,
        notes: notes
      });
      await fetchAttendance();
      setShowMarkAttendance(false);
      setMarkingData({ employeeId: '', status: 'present', notes: '' });
      // Optional: Add success toast
    } catch (error) {
      console.error("Failed to mark attendance:", error);
      alert(`Failed to mark attendance: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleExportAttendance = (format = 'csv') => {
    let dataStr, fileName, mimeType;

    if (format === 'csv') {
      const headers = ['Employee', 'Department', 'Status', 'Check In', 'Check Out', 'Late Minutes', 'Notes', 'Attendance Score'];
      const rows = attendanceData.map(record =>
        [record.employee, record.department, record.status, record.checkIn, record.checkOut, record.lateMinutes, record.notes, record.attendanceScore].join(',')
      );
      dataStr = [headers.join(','), ...rows].join('\n');
      fileName = `attendance-${selectedDate}-${new Date().getTime()}.csv`;
      mimeType = 'text/csv';
    } else {
      const exportData = {
        date: selectedDate,
        attendance: attendanceData,
        overallAttendance: calculateOverallAttendance(),
        averageScore: calculateAverageAttendanceScore(),
        generated: new Date().toISOString()
      };
      dataStr = JSON.stringify(exportData, null, 2);
      fileName = `attendance-data-${new Date().getTime()}.json`;
      mimeType = 'application/json';
    }

    const dataBlob = new Blob([dataStr], { type: mimeType });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);

    setShowExportOptions(false);
    alert(`Attendance exported as ${format.toUpperCase()}!`);
  };

  const handleSendEmail = (email, subject = 'Regarding your attendance') => {
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    window.open(mailtoLink, '_blank');
  };

  const handleCallEmployee = (phone) => {
    const telLink = `tel:${phone.replace(/\D/g, '')}`;
    window.open(telLink, '_blank');
  };

  const handleViewEmployee = (employeeName) => {
    navigate(`/manager/employees?search=${employeeName}`);
  };

  const handleViewAnalytics = () => {
    navigate('/manager/dashboard');
  };

  const handleViewCalendar = () => {
    setViewMode('calendar');
  };

  const handleViewDashboard = () => {
    navigate('/manager/dashboard');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return { bg: `${themeColors.secondary}20`, text: themeColors.secondary };
      case 'absent': return { bg: `${themeColors.danger}20`, text: themeColors.danger };
      case 'late': return { bg: `${themeColors.warning}20`, text: themeColors.warning };
      case 'half-day': return { bg: `${themeColors.accent}20`, text: themeColors.accent };
      default: return { bg: `${themeColors.muted}20`, text: themeColors.muted };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle size={16} style={{ color: themeColors.secondary }} />;
      case 'absent': return <XCircle size={16} style={{ color: themeColors.danger }} />;
      case 'late': return <AlertCircle size={16} style={{ color: themeColors.warning }} />;
      case 'half-day': return <Clock size={16} style={{ color: themeColors.accent }} />;
      default: return null;
    }
  };

  const attendanceSummary = {
    present: attendanceData.filter(r => r.status === 'present').length,
    absent: attendanceData.filter(r => r.status === 'absent').length,
    late: attendanceData.filter(r => r.status === 'late').length,
    halfDay: attendanceData.filter(r => r.status === 'half-day').length,
    total: attendanceData.length
  };

  if (viewMode === 'calendar') {
    return (
      <div className="space-y-6">
        <ManagerAttendanceCalendar onBack={() => setViewMode('daily')} />
      </div>
    );
  }

  return (
    <div className="space-y-6 transition-colors duration-300" style={{ backgroundColor: themeColors.background, minHeight: '100vh', padding: '1.5rem' }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold transition-colors duration-300" style={{ color: themeColors.text }}>Attendance Tracking</h1>
          <p className="transition-colors duration-300" style={{ color: themeColors.muted }}>Track and manage daily attendance records</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowMarkAttendance(true)}
            className="px-4 py-2 rounded-lg hover:opacity-90 flex items-center space-x-2 text-white"
            style={{ backgroundColor: themeColors.primary }}
          >
            <Plus size={18} />
            <span>Mark Attendance</span>
          </button>
          <div className="relative">
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="px-4 py-2 border rounded-lg hover:opacity-80 flex items-center space-x-2 transition-colors duration-300"
              style={{
                borderColor: themeColors.border,
                color: themeColors.text,
                backgroundColor: themeColors.card
              }}
            >
              <Download size={18} />
              <span>Export</span>
              <ChevronDown size={16} />
            </button>
            {showExportOptions && (
              <div className="absolute top-full right-0 mt-1 border rounded-lg shadow-lg z-10 min-w-[160px] transition-colors duration-300" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}>
                <button
                  onClick={() => handleExportAttendance('csv')}
                  className="w-full px-4 py-2 text-left hover:opacity-80 transition-colors duration-300"
                  style={{ color: themeColors.text }}
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => handleExportAttendance('json')}
                  className="w-full px-4 py-2 text-left hover:opacity-80 transition-colors duration-300"
                  style={{ color: themeColors.text }}
                >
                  Export as JSON
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showMarkAttendance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="rounded-xl shadow-lg max-w-md w-full border transition-colors duration-300" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold transition-colors duration-300" style={{ color: themeColors.text }}>Mark Attendance</h3>
                <button
                  onClick={() => setShowMarkAttendance(false)}
                  className="transition-colors duration-300 hover:opacity-80"
                  style={{ color: themeColors.muted }}
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 transition-colors duration-300" style={{ color: themeColors.text }}>
                    Select Employee
                  </label>
                  <select
                    value={markingData.employeeId}
                    onChange={(e) => setMarkingData({ ...markingData, employeeId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg transition-colors duration-300"
                    style={{
                      backgroundColor: themeColors.inputBg,
                      borderColor: themeColors.border,
                      color: themeColors.text
                    }}
                  >
                    <option value="">Select an employee</option>
                    {attendanceData.map(emp => (
                      <option key={emp.employeeId} value={emp.employeeId}>{emp.employee}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 transition-colors duration-300" style={{ color: themeColors.text }}>
                    Status
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['present', 'absent', 'late', 'half-day'].map(status => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setMarkingData({ ...markingData, status })}
                        className={`p-3 rounded-lg text-center capitalize transition-all ${markingData.status === status
                          ? 'ring-2 ring-blue-500 font-bold'
                          : 'opacity-70'
                          }`}
                        style={{
                          backgroundColor:
                            status === 'present' ? `${themeColors.secondary}20` :
                              status === 'absent' ? `${themeColors.danger}20` :
                                status === 'late' ? `${themeColors.warning}20` :
                                  `${themeColors.accent}20`,
                          color:
                            status === 'present' ? themeColors.secondary :
                              status === 'absent' ? themeColors.danger :
                                status === 'late' ? themeColors.warning :
                                  themeColors.accent
                        }}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 transition-colors duration-300" style={{ color: themeColors.text }}>
                    Notes
                  </label>
                  <textarea
                    value={markingData.notes}
                    onChange={(e) => setMarkingData({ ...markingData, notes: e.target.value })}
                    placeholder="Optional notes..."
                    className="w-full px-3 py-2 border rounded-lg transition-colors duration-300"
                    style={{
                      backgroundColor: themeColors.inputBg,
                      borderColor: themeColors.border,
                      color: themeColors.text
                    }}
                    rows="2"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => handleMarkAttendance(markingData.employeeId, markingData.status, markingData.notes)}
                  disabled={!markingData.employeeId}
                  className={`flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors duration-300 ${!markingData.employeeId ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{ backgroundColor: themeColors.primary }}
                >
                  Save Attendance
                </button>
                <button
                  onClick={() => setShowMarkAttendance(false)}
                  className="px-4 py-2 border rounded-lg hover:opacity-80 transition-colors duration-300"
                  style={{ borderColor: themeColors.border, color: themeColors.text }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => setSelectedStatus('present')}
          className="rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow duration-300"
          style={{ backgroundColor: themeColors.card, border: `1px solid ${themeColors.border}` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>Present Today</p>
              <p className="text-3xl font-bold mt-2 transition-colors duration-300" style={{ color: themeColors.secondary }}>{attendanceSummary.present}</p>
            </div>
            <div className="p-3 rounded-full transition-colors duration-300" style={{ backgroundColor: `${themeColors.secondary}20` }}>
              <CheckCircle size={24} style={{ color: themeColors.secondary }} />
            </div>
          </div>
        </div>

        <div
          onClick={() => setSelectedStatus('absent')}
          className="rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow duration-300"
          style={{ backgroundColor: themeColors.card, border: `1px solid ${themeColors.border}` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>Absent Today</p>
              <p className="text-3xl font-bold mt-2 transition-colors duration-300" style={{ color: themeColors.danger }}>{attendanceSummary.absent}</p>
            </div>
            <div className="p-3 rounded-full transition-colors duration-300" style={{ backgroundColor: `${themeColors.danger}20` }}>
              <XCircle size={24} style={{ color: themeColors.danger }} />
            </div>
          </div>
        </div>

        <div
          onClick={() => setSelectedStatus('late')}
          className="rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow duration-300"
          style={{ backgroundColor: themeColors.card, border: `1px solid ${themeColors.border}` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>Late Arrivals</p>
              <p className="text-3xl font-bold mt-2 transition-colors duration-300" style={{ color: themeColors.warning }}>{attendanceSummary.late}</p>
            </div>
            <div className="p-3 rounded-full transition-colors duration-300" style={{ backgroundColor: `${themeColors.warning}20` }}>
              <Clock size={24} style={{ color: themeColors.warning }} />
            </div>
          </div>
        </div>

        <div
          onClick={handleViewAnalytics}
          className="rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow duration-300"
          style={{ backgroundColor: themeColors.card, border: `1px solid ${themeColors.border}` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>Attendance Rate</p>
              <p className="text-3xl font-bold mt-2 transition-colors duration-300" style={{ color: themeColors.primary }}>
                {calculateOverallAttendance()}%
              </p>
            </div>
            <div className="p-3 rounded-full transition-colors duration-300" style={{ backgroundColor: `${themeColors.primary}20` }}>
              <BarChart3 size={24} style={{ color: themeColors.primary }} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm transition-colors duration-300" style={{ color: themeColors.secondary }}>
            <TrendingUp size={14} className="mr-1" />
            <span>+2.5% from yesterday</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl shadow-sm p-6 transition-colors duration-300" style={{ backgroundColor: themeColors.card, border: `1px solid ${themeColors.border}` }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold transition-colors duration-300" style={{ color: themeColors.text }}>Quick Actions</h3>
          <button
            onClick={handleViewDashboard}
            className="text-sm hover:underline transition-colors duration-300"
            style={{ color: themeColors.primary }}
          >
            Dashboard
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setShowMarkAttendance(true)}
            className="p-4 border rounded-lg hover:opacity-80 flex flex-col items-center justify-center transition-colors duration-300"
            style={{ borderColor: themeColors.border, color: themeColors.text, backgroundColor: `${themeColors.primary}10` }}
          >
            <Plus size={24} className="mb-2" style={{ color: themeColors.primary }} />
            <span className="text-sm font-medium">Mark Attendance</span>
          </button>

          <button
            onClick={handleViewCalendar}
            className="p-4 border rounded-lg hover:opacity-80 flex flex-col items-center justify-center transition-colors duration-300"
            style={{ borderColor: themeColors.border, color: themeColors.text, backgroundColor: `${themeColors.secondary}10` }}
          >
            <Calendar size={24} className="mb-2" style={{ color: themeColors.secondary }} />
            <span className="text-sm font-medium">View Calendar</span>
          </button>

          <button
            onClick={handleViewAnalytics}
            className="p-4 border rounded-lg hover:opacity-80 flex flex-col items-center justify-center transition-colors duration-300"
            style={{ borderColor: themeColors.border, color: themeColors.text, backgroundColor: `${themeColors.accent}10` }}
          >
            <BarChart3 size={24} className="mb-2" style={{ color: themeColors.accent }} />
            <span className="text-sm font-medium">Analytics</span>
          </button>

          <button
            onClick={() => handleExportAttendance('csv')}
            className="p-4 border rounded-lg hover:opacity-80 flex flex-col items-center justify-center transition-colors duration-300"
            style={{ borderColor: themeColors.border, color: themeColors.text, backgroundColor: `${themeColors.warning}10` }}
          >
            <Download size={24} className="mb-2" style={{ color: themeColors.warning }} />
            <span className="text-sm font-medium">Export Data</span>
          </button>
        </div>
      </div>

      <div className="rounded-xl shadow-sm p-6 transition-colors duration-300" style={{ backgroundColor: themeColors.card, border: `1px solid ${themeColors.border}` }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <div>
              <h3 className="text-lg font-semibold transition-colors duration-300" style={{ color: themeColors.text }}>Daily Attendance</h3>
              <p className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>Date: {selectedDate}</p>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border rounded-lg transition-colors duration-300"
              style={{
                backgroundColor: themeColors.inputBg,
                borderColor: themeColors.border,
                color: themeColors.text
              }}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300" size={18} style={{ color: themeColors.muted }} />
              <input
                type="search"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300"
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
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 appearance-none transition-colors duration-300"
                  style={{
                    backgroundColor: themeColors.inputBg,
                    borderColor: themeColors.border,
                    color: themeColors.text,
                    '--tw-ring-color': themeColors.primary
                  }}
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept.toLowerCase().replace(' ', '-')}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 appearance-none transition-colors duration-300"
                style={{
                  backgroundColor: themeColors.inputBg,
                  borderColor: themeColors.border,
                  color: themeColors.text,
                  '--tw-ring-color': themeColors.primary
                }}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status.toLowerCase().replace('-', '')}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="transition-colors duration-300" style={{ backgroundColor: isDarkMode ? `${themeColors.background}` : '#f8fafc' }}>
                <th className="py-3 px-4 text-left text-sm font-medium transition-colors duration-300" style={{ color: themeColors.text }}>Employee</th>
                <th className="py-3 px-4 text-left text-sm font-medium transition-colors duration-300" style={{ color: themeColors.text }}>Department</th>
                <th className="py-3 px-4 text-left text-sm font-medium transition-colors duration-300" style={{ color: themeColors.text }}>Status</th>
                <th className="py-3 px-4 text-left text-sm font-medium transition-colors duration-300" style={{ color: themeColors.text }}>Check In</th>
                <th className="py-3 px-4 text-left text-sm font-medium transition-colors duration-300" style={{ color: themeColors.text }}>Check Out</th>
                <th className="py-3 px-4 text-left text-sm font-medium transition-colors duration-300" style={{ color: themeColors.text }}>Attendance Score</th>
                <th className="py-3 px-4 text-left text-sm font-medium transition-colors duration-300" style={{ color: themeColors.text }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y transition-colors duration-300" style={{ divideColor: themeColors.border }}>
              {filteredData.map((record) => (
                <tr key={record.id} className="hover:opacity-90 transition-colors duration-300" style={{ backgroundColor: themeColors.card }}>
                  <td className="py-4 px-4">
                    <div
                      onClick={() => handleViewEmployee(record.employee)}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: `${themeColors.primary}20` }}>
                        <span className="font-semibold transition-colors duration-300" style={{ color: themeColors.text }}>{record.avatar}</span>
                      </div>
                      <div>
                        <p className="font-medium transition-colors duration-300" style={{ color: themeColors.text }}>{record.employee}</p>
                        <p className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>{record.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="transition-colors duration-300" style={{ color: themeColors.text }}>{record.department}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(record.status)}
                      {(() => {
                        const statusStyle = getStatusColor(record.status);
                        return (
                          <span className="px-3 py-1 rounded text-xs font-medium transition-colors duration-300"
                            style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        );
                      })()}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="transition-colors duration-300" style={{ color: themeColors.text }}>{record.checkIn}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="transition-colors duration-300" style={{ color: themeColors.text }}>{record.checkOut}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-16 rounded-full h-2 mr-2 transition-colors duration-300" style={{ backgroundColor: `${themeColors.border}` }}>
                        <div
                          className={`h-2 rounded-full ${record.attendanceScore >= 95 ? 'bg-green-500' :
                            record.attendanceScore >= 85 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                          style={{ width: `${record.attendanceScore}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${record.attendanceScore >= 95 ? 'text-green-600' :
                        record.attendanceScore >= 85 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                        {record.attendanceScore}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleMarkAttendance(record.employeeId, 'present')}
                        className="p-1 hover:opacity-80 disabled:opacity-50"
                        title="Mark Present"
                        style={{ color: themeColors.secondary }}
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button
                        onClick={() => handleMarkAttendance(record.employeeId, 'absent')}
                        className="p-1 hover:opacity-80 disabled:opacity-50"
                        title="Mark Absent"
                        style={{ color: themeColors.danger }}
                      >
                        <XCircle size={16} />
                      </button>
                      <button
                        onClick={() => handleSendEmail(record.email, 'Regarding your attendance')}
                        className="p-1 hover:opacity-80 disabled:opacity-50"
                        title="Send Email"
                        style={{ color: themeColors.accent }}
                      >
                        <Mail size={16} />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <User size={48} className="mx-auto mb-4 transition-colors duration-300" style={{ color: themeColors.muted }} />
            <h4 className="text-lg font-medium transition-colors duration-300" style={{ color: themeColors.text }}>No Attendance Records Found</h4>
            <p className="mt-2 transition-colors duration-300" style={{ color: themeColors.muted }}>Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDepartment('all');
                setSelectedStatus('all');
              }}
              className="mt-4 px-4 py-2 text-white rounded-lg hover:opacity-90 text-sm transition-colors duration-300"
              style={{ backgroundColor: themeColors.primary }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl shadow-sm p-6 transition-colors duration-300" style={{ backgroundColor: themeColors.card, border: `1px solid ${themeColors.border}` }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold transition-colors duration-300" style={{ color: themeColors.text }}>Attendance Trends</h3>
            <button
              onClick={handleViewAnalytics}
              className="text-sm hover:underline transition-colors duration-300"
              style={{ color: themeColors.primary }}
            >
              View Analytics
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1 transition-colors duration-300" style={{ color: themeColors.text }}>
                <span>This Week</span>
                <span className="flex items-center">
                  <TrendingUp size={14} className="mr-1" style={{ color: themeColors.secondary }} />
                  <span style={{ color: themeColors.secondary }}>{analytics.trends.weekly >= 80 ? '+5%' : '-2%'}</span>
                </span>
              </div>
              <div className="w-full rounded-full h-2 transition-colors duration-300" style={{ backgroundColor: `${themeColors.border}` }}>
                <div className="h-2 rounded-full" style={{ width: `${analytics.trends.weekly}%`, backgroundColor: themeColors.secondary }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1 transition-colors duration-300" style={{ color: themeColors.text }}>
                <span>This Month</span>
                <span className="flex items-center">
                  <TrendingUp size={14} className="mr-1" style={{ color: themeColors.secondary }} />
                  <span style={{ color: themeColors.secondary }}>{analytics.trends.monthly >= 80 ? '+2.5%' : '-1%'}</span>
                </span>
              </div>
              <div className="w-full rounded-full h-2 transition-colors duration-300" style={{ backgroundColor: `${themeColors.border}` }}>
                <div className="h-2 rounded-full" style={{ width: `${analytics.trends.monthly}%`, backgroundColor: themeColors.accent }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1 transition-colors duration-300" style={{ color: themeColors.text }}>
                <span>Late Arrivals</span>
                <span className="flex items-center">
                  <TrendingDown size={14} className="mr-1" style={{ color: themeColors.secondary }} />
                  <span style={{ color: themeColors.secondary }}>{analytics.trends.late <= 5 ? '-10%' : '+2%'}</span>
                </span>
              </div>
              <div className="w-full rounded-full h-2 transition-colors duration-300" style={{ backgroundColor: `${themeColors.border}` }}>
                <div className="h-2 rounded-full" style={{ width: `${analytics.trends.late}%`, backgroundColor: themeColors.warning }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl shadow-sm p-6 transition-colors duration-300" style={{ backgroundColor: themeColors.card, border: `1px solid ${themeColors.border}` }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold transition-colors duration-300" style={{ color: themeColors.text }}>Department Overview</h3>
            <button
              onClick={() => navigate('/analytics')}
              className="text-sm hover:underline transition-colors duration-300"
              style={{ color: themeColors.primary }}
            >
              View Details
            </button>
          </div>
          <div className="space-y-3">
            {analytics.departmentStats.map((dept) => (
              <div key={dept.name} className="flex items-center justify-between">
                <span className="text-sm transition-colors duration-300" style={{ color: themeColors.text }}>{dept.name}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 rounded-full h-2 transition-colors duration-300" style={{ backgroundColor: `${themeColors.border}` }}>
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${dept.present}%`,
                        backgroundColor: dept.present >= 90 ? themeColors.secondary :
                          dept.present >= 80 ? themeColors.warning : themeColors.danger
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-10 text-right transition-colors duration-300" style={{ color: themeColors.text }}>
                    {dept.present}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>

      <div className="rounded-xl p-6 border transition-colors duration-300" style={{ backgroundColor: isDarkMode ? `${themeColors.background}` : '#f8fafc', borderColor: themeColors.border }}>
        <h3 className="font-semibold mb-4 transition-colors duration-300" style={{ color: themeColors.text }}>Attendance Management Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border transition-colors duration-300" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}>
            <div className="flex items-center space-x-2 mb-2">
              <Clock size={18} style={{ color: themeColors.primary }} />
              <span className="font-medium transition-colors duration-300" style={{ color: themeColors.text }}>Regular Monitoring</span>
            </div>
            <p className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>Check attendance daily and address any discrepancies immediately to maintain accurate records.</p>
          </div>

          <div className="p-4 rounded-lg border transition-colors duration-300" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}>
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 size={18} style={{ color: themeColors.accent }} />
              <span className="font-medium transition-colors duration-300" style={{ color: themeColors.text }}>Analyze Patterns</span>
            </div>
            <p className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>Look for recurring late arrivals or absences to identify potential issues early.</p>
          </div>

          <div className="p-4 rounded-lg border transition-colors duration-300" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}>
            <div className="flex items-center space-x-2 mb-2">
              <Users size={18} style={{ color: themeColors.secondary }} />
              <span className="font-medium transition-colors duration-300" style={{ color: themeColors.text }}>Team Communication</span>
            </div>
            <p className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>Maintain open lines of communication with your team regarding attendance policies.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracking;
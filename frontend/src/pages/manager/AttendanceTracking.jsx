import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    if (selectedDepartment !== 'all' && record.department !== selectedDepartment) return false;
    if (selectedStatus !== 'all' && record.status !== selectedStatus) return false;
    if (searchTerm && !record.employee.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !record.department.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Calculate overall attendance percentage to match dashboard (92%)
  const calculateOverallAttendance = () => {
    const totalRecords = attendanceData.length;
    const presentRecords = attendanceData.filter(r => r.status === 'present' || r.status === 'half-day' || r.status === 'late').length;
    return Math.round((presentRecords / totalRecords) * 100);
  };

  // Calculate average attendance score to match employee management page
  const calculateAverageAttendanceScore = () => {
    const totalScore = attendanceData.reduce((sum, record) => sum + record.attendanceScore, 0);
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
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'half-day': return 'bg-blue-100 text-blue-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle size={16} className="text-green-500" />;
      case 'absent': return <XCircle size={16} className="text-red-500" />;
      case 'late': return <AlertCircle size={16} className="text-yellow-500" />;
      case 'half-day': return <Clock size={16} className="text-blue-500" />;
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

  // Department statistics to match analytics page
  const departmentStats = [
    { name: 'Engineering', present: 92, employees: attendanceData.filter(r => r.department === 'Engineering').length },
    { name: 'Marketing', present: 88, employees: attendanceData.filter(r => r.department === 'Marketing').length },
    { name: 'Sales', present: 95, employees: attendanceData.filter(r => r.department === 'Sales').length },
    { name: 'HR', present: 90, employees: attendanceData.filter(r => r.department === 'HR').length },
    { name: 'Finance', present: 85, employees: attendanceData.filter(r => r.department === 'Finance').length },
  ];

  if (viewMode === 'calendar') {
    return (
      <div className="space-y-6">
        <ManagerAttendanceCalendar onBack={() => setViewMode('daily')} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Attendance Tracking</h1>
          <p className="text-slate-600">Track and manage daily attendance records</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowMarkAttendance(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>Mark Attendance</span>
          </button>
          <div className="relative">
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
            >
              <Download size={18} />
              <span>Export</span>
              <ChevronDown size={16} />
            </button>
            {showExportOptions && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[160px]">
                <button
                  onClick={() => handleExportAttendance('csv')}
                  className="w-full px-4 py-2 text-left hover:bg-slate-50"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => handleExportAttendance('json')}
                  className="w-full px-4 py-2 text-left hover:bg-slate-50"
                >
                  Export as JSON
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showMarkAttendance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-800">Mark Attendance</h3>
                <button
                  onClick={() => setShowMarkAttendance(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Select Employee
                  </label>
                  <select
                    value={markingData.employeeId}
                    onChange={(e) => setMarkingData({ ...markingData, employeeId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="">Select an employee</option>
                    {attendanceData.map(emp => (
                      <option key={emp.employeeId} value={emp.employeeId}>{emp.employee}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
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
                          } ${status === 'present' ? 'bg-green-100 text-green-800' :
                            status === 'absent' ? 'bg-red-100 text-red-800' :
                              status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                          }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={markingData.notes}
                    onChange={(e) => setMarkingData({ ...markingData, notes: e.target.value })}
                    placeholder="Optional notes..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    rows="2"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => handleMarkAttendance(markingData.employeeId, markingData.status, markingData.notes)}
                  disabled={!markingData.employeeId}
                  className={`flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${!markingData.employeeId ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Save Attendance
                </button>
                <button
                  onClick={() => setShowMarkAttendance(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
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
          className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Present Today</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{attendanceSummary.present}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle size={24} className="text-green-500" />
            </div>
          </div>
        </div>

        <div
          onClick={() => setSelectedStatus('absent')}
          className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Absent Today</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{attendanceSummary.absent}</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <XCircle size={24} className="text-red-500" />
            </div>
          </div>
        </div>

        <div
          onClick={() => setSelectedStatus('late')}
          className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Late Arrivals</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{attendanceSummary.late}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock size={24} className="text-yellow-500" />
            </div>
          </div>
        </div>

        <div
          onClick={handleViewAnalytics}
          className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Attendance Rate</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {calculateOverallAttendance()}%
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <BarChart3 size={24} className="text-blue-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp size={14} className="mr-1" />
            <span>+2.5% from yesterday</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-800">Quick Actions</h3>
          <button
            onClick={handleViewDashboard}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Dashboard
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setShowMarkAttendance(true)}
            className="p-4 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 flex flex-col items-center justify-center transition-colors"
          >
            <Plus size={24} className="mb-2 text-blue-500" />
            <span className="text-sm font-medium">Mark Attendance</span>
          </button>

          <button
            onClick={handleViewCalendar}
            className="p-4 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 flex flex-col items-center justify-center transition-colors"
          >
            <Calendar size={24} className="mb-2 text-green-500" />
            <span className="text-sm font-medium">View Calendar</span>
          </button>

          <button
            onClick={handleViewAnalytics}
            className="p-4 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 flex flex-col items-center justify-center transition-colors"
          >
            <BarChart3 size={24} className="mb-2 text-purple-500" />
            <span className="text-sm font-medium">Analytics</span>
          </button>

          <button
            onClick={() => handleExportAttendance('csv')}
            className="p-4 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 flex flex-col items-center justify-center transition-colors"
          >
            <Download size={24} className="mb-2 text-yellow-500" />
            <span className="text-sm font-medium">Export Data</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Daily Attendance</h3>
              <p className="text-sm text-slate-600">Date: {selectedDate}</p>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="search"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <tr className="bg-slate-50">
                <th className="py-3 px-4 text-left text-sm font-medium text-slate-700">Employee</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-slate-700">Department</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-slate-700">Status</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-slate-700">Check In</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-slate-700">Check Out</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-slate-700">Attendance Score</th>
                {/*  <th className="py-3 px-4 text-left text-sm font-medium text-slate-700">Notes</th> */}
                <th className="py-3 px-4 text-left text-sm font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredData.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50">
                  <td className="py-4 px-4">
                    <div
                      onClick={() => handleViewEmployee(record.employee)}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                        <span className="font-semibold text-slate-700">{record.avatar}</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{record.employee}</p>
                        <p className="text-sm text-slate-500">{record.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-slate-700">{record.department}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(record.status)}
                      <span className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor(record.status)}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-slate-700">{record.checkIn}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-slate-700">{record.checkOut}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-slate-200 rounded-full h-2 mr-2">
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
                  {/* <td className="py-4 px-4">
                    <span className="text-sm text-slate-600 truncate max-w-[200px] block">
                      {record.notes || '-'}
                    </span>
                  </td> */}
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleMarkAttendance(record.employeeId, 'present')}
                        className="p-1 text-green-600 hover:text-green-800"
                        title="Mark Present"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button
                        onClick={() => handleMarkAttendance(record.employeeId, 'absent')}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Mark Absent"
                      >
                        <XCircle size={16} />
                      </button>
                      <button
                        onClick={() => handleSendEmail(record.email, 'Regarding your attendance')}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Send Email"
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
            <User size={48} className="mx-auto text-slate-300 mb-4" />
            <h4 className="text-lg font-medium text-slate-700">No Attendance Records Found</h4>
            <p className="text-slate-500 mt-2">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDepartment('all');
                setSelectedStatus('all');
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Attendance Trends</h3>
            <button
              onClick={handleViewAnalytics}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View Analytics
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-slate-700 mb-1">
                <span>This Week</span>
                <span className="flex items-center">
                  <TrendingUp size={14} className="text-green-500 mr-1" />
                  <span className="text-green-600">{analytics.trends.weekly >= 80 ? '+5%' : '-2%'}</span>
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${analytics.trends.weekly}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-slate-700 mb-1">
                <span>This Month</span>
                <span className="flex items-center">
                  <TrendingUp size={14} className="text-green-500 mr-1" />
                  <span className="text-green-600">{analytics.trends.monthly >= 80 ? '+2.5%' : '-1%'}</span>
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${analytics.trends.monthly}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-slate-700 mb-1">
                <span>Late Arrivals</span>
                <span className="flex items-center">
                  <TrendingDown size={14} className="text-green-500 mr-1" />
                  <span className="text-green-600">{analytics.trends.late <= 5 ? '-10%' : '+2%'}</span>
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${analytics.trends.late}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Department Overview</h3>
            <button
              onClick={() => navigate('/analytics')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View Details
            </button>
          </div>
          <div className="space-y-3">
            {analytics.departmentStats.map((dept) => (
              <div key={dept.name} className="flex items-center justify-between">
                <span className="text-sm text-slate-700">{dept.name}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-slate-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${dept.present}%`,
                        backgroundColor: dept.present >= 90 ? '#10b981' :
                          dept.present >= 80 ? '#f59e0b' : '#ef4444'
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-slate-800 w-10 text-right">
                    {dept.present}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Attendance Management Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Clock size={18} className="text-blue-500" />
              <span className="font-medium text-blue-800">Regular Monitoring</span>
            </div>
            <p className="text-sm text-slate-600">Check attendance daily and address any discrepancies immediately to maintain accurate records.</p>
          </div>

          <div className="p-4 bg-white rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FileText size={18} className="text-green-500" />
              <span className="font-medium text-green-800">Documentation</span>
            </div>
            <p className="text-sm text-slate-600">Always add notes for special cases like leaves, medical appointments, or work-from-home.</p>
          </div>

          <div className="p-4 bg-white rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Users size={18} className="text-purple-500" />
              <span className="font-medium text-purple-800">Team Communication</span>
            </div>
            <p className="text-sm text-slate-600">Communicate attendance policies clearly and provide regular feedback to team members.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracking;
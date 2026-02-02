// src/pages/manager/ManagerAttendanceCalendar.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Download,
  Filter
} from 'lucide-react';
import { managerService } from '../../services/managerService';

const ManagerAttendanceCalendar = () => {
  const { isDarkMode } = useOutletContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('All');

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

  useEffect(() => {
    fetchAttendanceData();
  }, [currentDate, selectedDepartment]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      // In a real app, you would fetch data for the specific month/year
      // const data = await managerService.getDepartmentAttendance(currentDate.getMonth() + 1, currentDate.getFullYear());
      // For now, using mock data structure based on the requirements

      const mockData = [
        { id: 1, name: 'John Doe', department: 'Engineering', attendance: generateMonthAttendance() },
        { id: 2, name: 'Jane Smith', department: 'Marketing', attendance: generateMonthAttendance() },
        { id: 3, name: 'Mike Johnson', department: 'Engineering', attendance: generateMonthAttendance() },
        { id: 4, name: 'Sarah Williams', department: 'HR', attendance: generateMonthAttendance() },
        { id: 5, name: 'David Brown', department: 'Sales', attendance: generateMonthAttendance() },
      ];

      setAttendanceData(mockData);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMonthAttendance = () => {
    const days = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const statuses = ['present', 'present', 'present', 'present', 'absent', 'late', 'half-day', 'leave'];
    return Array.from({ length: days }, (_, i) => ({
      date: i + 1,
      status: statuses[Math.floor(Math.random() * statuses.length)]
    }));
  };

  const getDaysInMonth = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700';
      case 'absent': return isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700';
      case 'late': return isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700';
      case 'half-day': return isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700';
      case 'leave': return isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700';
      default: return isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'present': return 'P';
      case 'absent': return 'A';
      case 'late': return 'L';
      case 'half-day': return 'HD';
      case 'leave': return 'LV';
      default: return '-';
    }
  };

  return (
    <div style={{ backgroundColor: themeColors.background, minHeight: '100vh', color: themeColors.text }} className="p-4 md:p-6 transition-colors duration-300">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20 text-white">
              <CalendarIcon size={24} />
            </div>
            <div>
              <h1 style={{ color: themeColors.text }} className="text-2xl font-bold">Attendance Calendar</h1>
              <p style={{ color: themeColors.muted }}>Track team attendance and schedules</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { }}
              style={{ borderColor: themeColors.border, color: themeColors.text, backgroundColor: themeColors.card }}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:opacity-90"
            >
              <Download size={18} />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-transparent mb-6">
          <div style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }} className="flex items-center gap-4 p-2 rounded-lg border shadow-sm">
            <button
              onClick={() => changeMonth(-1)}
              style={{ color: themeColors.text }}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span style={{ color: themeColors.text }} className="text-lg font-semibold min-w-[150px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button
              onClick={() => changeMonth(1)}
              style={{ color: themeColors.text }}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ borderColor: themeColors.border, backgroundColor: themeColors.card }} className="flex items-center gap-2 px-3 py-2 border rounded-lg">
              <Filter size={16} className="text-slate-400" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                style={{ backgroundColor: 'transparent', color: themeColors.text }}
                className="bg-transparent border-none focus:outline-none text-sm"
              >
                <option value="All">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">HR</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }} className="rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead style={{ backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc', borderColor: themeColors.border }} className="text-xs uppercase border-b">
              <tr>
                <th scope="col" style={{ color: themeColors.muted }} className="px-6 py-4 font-medium min-w-[200px] sticky left-0 z-10 bg-inherit shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                  Employee
                </th>
                {Array.from({ length: getDaysInMonth() }, (_, i) => (
                  <th key={i} scope="col" style={{ color: themeColors.muted }} className="px-2 py-4 font-medium text-center min-w-[40px]">
                    {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={getDaysInMonth() + 1} className="px-6 py-8 text-center text-slate-500">
                    Loading attendance data...
                  </td>
                </tr>
              ) : attendanceData.length === 0 ? (
                <tr>
                  <td colSpan={getDaysInMonth() + 1} className="px-6 py-8 text-center text-slate-500">
                    No attendance records found for this period.
                  </td>
                </tr>
              ) : (
                attendanceData.map((employee) => (
                  <tr key={employee.id} style={{ borderColor: themeColors.border }} className="border-b hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td style={{ backgroundColor: themeColors.card, color: themeColors.text }} className="px-6 py-4 font-medium sticky left-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium whitespace-nowrap">{employee.name}</div>
                          <div style={{ color: themeColors.muted }} className="text-xs">{employee.department}</div>
                        </div>
                      </div>
                    </td>
                    {employee.attendance.map((record, index) => (
                      <td key={index} className="px-1 py-3 text-center">
                        <div
                          className={`w-8 h-8 mx-auto rounded-lg flex items-center justify-center text-xs font-bold transition-all hover:scale-110 cursor-help ${getStatusColor(record.status)}`}
                          title={`${record.date} ${monthNames[currentDate.getMonth()]}: ${record.status}`}
                        >
                          {getStatusLabel(record.status)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-500/20 border border-green-200 dark:border-green-500/30"></div>
          <span style={{ color: themeColors.muted }} className="text-sm">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30"></div>
          <span style={{ color: themeColors.muted }} className="text-sm">Absent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-100 dark:bg-yellow-500/20 border border-yellow-200 dark:border-yellow-500/30"></div>
          <span style={{ color: themeColors.muted }} className="text-sm">Late</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30"></div>
          <span style={{ color: themeColors.muted }} className="text-sm">Half Day</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-purple-100 dark:bg-purple-500/20 border border-purple-200 dark:border-purple-500/30"></div>
          <span style={{ color: themeColors.muted }} className="text-sm">Leave</span>
        </div>
      </div>
    </div>
  );
};

export default ManagerAttendanceCalendar;
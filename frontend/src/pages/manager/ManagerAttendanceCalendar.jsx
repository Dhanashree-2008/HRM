import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Download,
  ArrowLeft
} from 'lucide-react';
import { managerService } from '../../services/managerService';

const ManagerAttendanceCalendar = ({ onBack }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState([]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentMonthName = months[currentMonth.getMonth()];
  const currentYear = currentMonth.getFullYear();

  useEffect(() => {
    fetchMonthlyAttendance();
  }, [currentMonth]);

  const fetchMonthlyAttendance = async () => {
    try {
      setLoading(true);
      const data = await managerService.getTeamMonthlyAttendance(
        currentMonth.getMonth() + 1,
        currentYear
      );
      setAttendanceData(data);
    } catch (err) {
      console.error("Error fetching monthly attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentYear, currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentYear, currentMonth.getMonth() - 1, 1));
  };

  const daysInMonth = new Date(currentYear, currentMonth.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-50 text-gray-300';
    switch (status.toLowerCase()) {
      case 'present': return 'bg-green-100 text-green-700 font-bold';
      case 'absent': return 'bg-red-100 text-red-700';
      case 'late': return 'bg-yellow-100 text-yellow-700';
      case 'leave': return 'bg-blue-100 text-blue-700';
      case 'weekend': return 'bg-slate-100 text-slate-400';
      default: return 'bg-gray-50';
    }
  };

  const getStatusContent = (status) => {
    if (!status) return '-';
    switch (status.toLowerCase()) {
      case 'present': return 'P';
      case 'absent': return 'A';
      case 'late': return 'L';
      case 'leave': return 'LV';
      default: return '-';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
            {onBack && (
                <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft size={20} className="text-slate-600" />
                </button>
            )}
            <div>
            <h2 className="text-2xl font-bold text-slate-800">Team Attendance Calendar</h2>
            <p className="text-slate-500">
                {currentMonthName} {currentYear}
            </p>
            </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <button 
              onClick={prevMonth}
              className="p-2 hover:bg-white rounded-md transition-all shadow-sm"
            >
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <span className="px-4 font-medium text-slate-700 min-w-[140px] text-center">
              {currentMonthName} {currentYear}
            </span>
            <button 
              onClick={nextMonth}
              className="p-2 hover:bg-white rounded-md transition-all shadow-sm"
            >
              <ChevronRight size={20} className="text-slate-600" />
            </button>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50">
            <Download size={18} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="sticky left-0 bg-slate-50 p-4 text-left font-semibold text-slate-700 min-w-[200px] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  Employee
                </th>
                {days.map(day => {
                   const date = new Date(currentYear, currentMonth.getMonth(), day);
                   const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                   return (
                    <th key={day} className={`p-2 text-center min-w-[40px] border-l border-slate-200 ${isWeekend ? 'bg-slate-100 text-slate-400' : ''}`}>
                        <div className="font-medium">{day}</div>
                        <div className="text-xs font-normal opacity-70">
                        {date.toLocaleDateString('en-US', { weekday: 'narrow' })}
                        </div>
                    </th>
                   );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {attendanceData.map((employee) => (
                <tr key={employee.id} className="hover:bg-slate-50">
                  <td className="sticky left-0 bg-white p-4 font-medium text-slate-800 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    <div className="flex flex-col">
                        <span>{employee.fullName}</span>
                        <span className="text-xs text-slate-500 font-normal">{employee.department}</span>
                    </div>
                  </td>
                  {days.map(day => {
                    const dateStr = `${currentYear}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const record = employee.attendance.find(a => a.date === dateStr);
                    const date = new Date(currentYear, currentMonth.getMonth(), day);
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    
                    let status = record ? record.status : (isWeekend ? 'weekend' : '');
                    
                    return (
                      <td key={day} className={`p-1 text-center border-l border-slate-200`}>
                        <div 
                            className={`w-8 h-8 mx-auto flex items-center justify-center rounded-md text-xs transition-colors cursor-help ${getStatusColor(status)}`}
                            title={record ? `In: ${record.markIn ? new Date(record.markIn).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '-'} | Out: ${record.markOut ? new Date(record.markOut).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '-'}` : ''}
                        >
                          {getStatusContent(status)}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
              {attendanceData.length === 0 && (
                <tr>
                    <td colSpan={daysInMonth + 1} className="p-8 text-center text-slate-500">
                        No employees found for this department.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600">
        <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-green-100 border border-green-200"></span> Present
        </div>
        <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-red-100 border border-red-200"></span> Absent
        </div>
        <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-yellow-100 border border-yellow-200"></span> Late
        </div>
        <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-blue-100 border border-blue-200"></span> Leave
        </div>
      </div>
    </div>
  );
};

export default ManagerAttendanceCalendar;
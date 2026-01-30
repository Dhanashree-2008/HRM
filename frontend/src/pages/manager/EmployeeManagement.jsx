import React, { useState, useEffect } from 'react';
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

  if (loading) return <div className="p-6">Loading team members...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800" style={{ color: '#1E293B' }}>Team Members</h1>
          <p className="text-slate-600" style={{ color: '#475569' }}>Manage your team members and their details</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="search"
              placeholder="Search by name, department, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <select className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Departments</option>
                <option>Engineering</option>
                <option>Marketing</option>
                <option>Sales</option>
                <option>HR</option>
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <select className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
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
        <div className="bg-white rounded-xl shadow-sm p-4" style={{ backgroundColor: '#FFFFFF' }}>
          <p className="text-sm text-slate-600">Total Members</p>
          <p className="text-2xl font-bold text-slate-800 mt-2">{employees.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4" style={{ backgroundColor: '#FFFFFF' }}>
          <p className="text-sm text-slate-600">Active</p>
          <p className="text-2xl font-bold text-green-600 mt-2">{employees.filter(e => e.status === 'active').length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4" style={{ backgroundColor: '#FFFFFF' }}>
          <p className="text-sm text-slate-600">Departments</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">{[...new Set(employees.map(e => e.department))].length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4" style={{ backgroundColor: '#FFFFFF' }}>
          <p className="text-sm text-slate-600">Avg. Attendance</p>
          <p className="text-2xl font-bold text-purple-600 mt-2">--%</p>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50" style={{ backgroundColor: '#F8FAFC' }}>
                <th className="py-3 px-4 text-left text-sm font-medium text-slate-700">Employee</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-slate-700">Contact</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-slate-700">Department</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-slate-700">Role</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-slate-700">Status</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-slate-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                        <span className="font-semibold text-slate-700">{employee.avatar}</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{employee.name}</p>
                        <p className="text-sm text-slate-600">ID: EMP{employee.id.toString().substring(0, 6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Mail size={14} className="text-slate-400" />
                        <span className="text-sm text-slate-700">{employee.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone size={14} className="text-slate-400" />
                        <span className="text-sm text-slate-700">{employee.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-slate-700">{employee.department}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-slate-700">{employee.role}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${employee.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {employee.status ? (employee.status.charAt(0).toUpperCase() + employee.status.slice(1)) : 'Unknown'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewEmployee(employee)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
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
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            {/* Modal Header */}
            <div className="relative bg-slate-800 text-white p-6 rounded-t-xl overflow-hidden">
              <div className="absolute top-0 right-0 p-4 z-50">
                <button onClick={closeModal} className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors">
                  <XCircle size={24} />
                </button>
              </div>

              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
                <div className="w-24 h-24 rounded-full bg-white text-slate-800 flex items-center justify-center text-3xl font-bold border-4 border-white/20 shadow-lg">
                  {selectedEmployee.avatar}
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold">{selectedEmployee.name}</h3>
                  <p className="text-blue-200">{selectedEmployee.designation}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
                    <span className="flex items-center text-sm bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                      <Briefcase size={14} className="mr-2" /> {selectedEmployee.department}
                    </span>
                    <span className="flex items-center text-sm bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                      <User size={14} className="mr-2" /> {selectedEmployee.role}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedEmployee.status === 'active' ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'}`}>
                      {selectedEmployee.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body with Tabs */}
            <ModalTabs employee={selectedEmployee} />
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for Tabs to keep main file clean
const ModalTabs = ({ employee }) => {
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
      <div className="flex border-b border-slate-200 px-6 pt-4 space-x-6 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 flex items-center space-x-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
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
          <div className="flex items-center justify-center h-full text-slate-500">Loading data...</div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center"><Mail size={16} className="mr-2 text-blue-500" /> Contact Info</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-500">Email Address</p>
                        <p className="text-sm font-medium text-slate-700">{employee.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Phone Number</p>
                        <p className="text-sm font-medium text-slate-700">{employee.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center"><Briefcase size={16} className="mr-2 text-purple-500" /> Professional Info</h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500">Joining Date</p>
                          <p className="text-sm font-medium text-slate-700">{employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Employee ID</p>
                          <p className="text-sm font-medium text-slate-700">{employee.original.employeeCode || `EMP${employee.id}`}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Address</p>
                        <p className="text-sm font-medium text-slate-700">{employee.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Overview Stats */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-3">Quick Overview</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-green-50 border border-green-100 text-center">
                      <p className="text-2xl font-bold text-green-600">{employee.status === 'active' ? 'Active' : 'Inactive'}</p>
                      <p className="text-xs text-green-700">Status</p>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 text-center">
                      <p className="text-2xl font-bold text-blue-600">Full Time</p>
                      <p className="text-xs text-blue-700">Type</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> These statistics are a snapshot of the current month.
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-white p-4 rounded-xl border shadow-sm text-center">
                    <p className="text-3xl font-bold text-green-500">{attendanceStats.present}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Present</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border shadow-sm text-center">
                    <p className="text-3xl font-bold text-red-500">{attendanceStats.absent}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Absent</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border shadow-sm text-center">
                    <p className="text-3xl font-bold text-yellow-500">{attendanceStats.late}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Late</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border shadow-sm text-center">
                    <p className="text-3xl font-bold text-orange-500">{attendanceStats.earlyExit}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Early Exit</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border shadow-sm text-center">
                    <p className="text-3xl font-bold text-blue-500">{attendanceStats.overtime}h</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Overtime</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'leaves' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-slate-800">Leave Balance</h4>
                <div className="grid grid-cols-1 gap-4">
                  {Object.keys(leaveBalances).length > 0 ? Object.entries(leaveBalances).map(([type, balance]) => (
                    <div key={type} className="bg-white p-5 rounded-xl border shadow-sm flex flex-col justify-center">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-bold text-slate-700 capitalize">{type} Leave</h5>
                        <span className="text-sm font-medium text-slate-500">{balance.remaining} remaining</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full ${type === 'earned' ? 'bg-blue-500' : type === 'sick' ? 'bg-green-500' : 'bg-purple-500'}`}
                          style={{ width: `${(balance.remaining / (balance.total || 1)) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-slate-400">
                        <span>Used: {balance.used}</span>
                        <span>Total: {balance.total}</span>
                      </div>
                    </div>
                  )) : (
                    <p className="text-slate-500 text-center py-4">No leave data available.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                  <MoreVertical size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-slate-800">Performance Review</h4>
                  <p className="text-slate-500 max-w-xs mx-auto">Performance data and reviews will be available here once the designated appraisal cycle begins.</p>
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
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle, XCircle, Calendar, Filter, Eye, Download, Clock,
  Mail, User, FileText, ChevronDown, Search, Plus, Trash2, Edit,
  Send, Bell, BarChart3, AlertTriangle, MoreVertical, Check, X
} from 'lucide-react';
import { managerService } from '../../services/managerService';

const LeaveApproval = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [activeActionMenu, setActiveActionMenu] = useState(null);

  // Modal State
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(null); // 'approve' | 'reject'
  const [actionReason, setActionReason] = useState('');
  const [actionRequestId, setActionRequestId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add Request Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    leaveType: 'CL',
    fromDate: '',
    toDate: '',
    reason: ''
  });

  const actionMenuRef = useRef(null);

  useEffect(() => {
    fetchRequests();

    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setActiveActionMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return '-';
    }
  };

  const calculateDays = (startStr, endStr) => {
    if (!startStr || !endStr) return 0;
    const start = new Date(startStr);
    const end = new Date(endStr);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    return Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      // Fetch leaves and employees in parallel
      const [leavesRes, employeesRes] = await Promise.allSettled([
        managerService.getAllLeaves(),
        managerService.getEmployees()
      ]);

      const leavesData = leavesRes.status === 'fulfilled' ? leavesRes.value : [];
      const employeesData = employeesRes.status === 'fulfilled' ? employeesRes.value : [];

      // Create a map of employeeId -> employeeProfile for faster lookup
      const employeeMap = {};
      if (Array.isArray(employeesData)) {
        employeesData.forEach(user => {
          // Adjust based on actual API response structure (user.employee or user directly)
          const emp = user.employee || user;
          if (emp && emp.id) {
            employeeMap[emp.id] = emp;
          }
        });
      }

      // Get unique employee IDs from leaves to fetch balances
      const employeeIds = [...new Set(leavesData.map(l => l.employee?.id).filter(Boolean))];

      // Fetch balances for all involved employees
      const balancePromises = employeeIds.map(id =>
        managerService.getLeaveBalanceByEmployeeId(id)
          .then(res => ({ id, balance: res }))
          .catch(err => {
            console.error(`Failed to fetch balance for emp ${id}`, err);
            return { id, balance: null };
          })
      );

      const balancesResults = await Promise.all(balancePromises);
      const balanceMap = {};
      balancesResults.forEach(item => {
        if (item.balance && Array.isArray(item.balance)) {
          const balObj = { casual: 0, sick: 0, earned: 0 };
          item.balance.forEach(b => {
            // Handle both possible structures if backend varies
            const leaveParams = b.leaveType || {};
            const code = b.code || leaveParams.code || leaveParams.name || '';

            // Normalize code comparison
            const lowerCode = code.toLowerCase();
            if (lowerCode.includes('casual') || lowerCode === 'cl') balObj.casual = b.remaining;
            else if (lowerCode.includes('sick') || lowerCode === 'sl') balObj.sick = b.remaining;
            else if ((lowerCode.includes('earned') || lowerCode.includes('paid')) || lowerCode === 'el' || lowerCode === 'al' || lowerCode === 'pl') balObj.earned = b.remaining;
          });
          balanceMap[item.id] = balObj;
        }
      });

      // Transform data to match component expectations
      const formatted = leavesData.map(req => {
        const empId = req.employee?.id;
        const empProfile = employeeMap[empId];

        // Prioritize profile data, then leave request data
        const empName = empProfile?.fullName || req.employee?.fullName || 'Unknown';
        const empDept = empProfile?.department || req.employee?.department || 'N/A';
        const empEmail = empProfile?.personalEmail || empProfile?.email || empProfile?.user?.email || ''; // Try multiple paths
        const empPhone = empProfile?.phone || '';
        const empAvatar = empName !== 'Unknown' ? empName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U';

        // Balances
        const balances = balanceMap[empId] || { casual: 0, sick: 0, earned: 0 };

        // Days calculation
        const daysCount = calculateDays(req.fromDate, req.toDate);

        return {
          id: req.id,
          employee: {
            id: empId,
            name: empName,
            department: empDept,
            avatar: empAvatar,
            email: empEmail,
            phone: empPhone
          },
          type: req.leaveType,
          startDateFormatted: formatDate(req.fromDate),
          endDateFormatted: formatDate(req.toDate),
          rawStartDate: req.fromDate,
          dates: `${formatDate(req.fromDate)} - ${formatDate(req.toDate)}`,
          days: daysCount,
          status: (req.status || '').toLowerCase(),
          reason: req.reason,
          appliedOn: formatDate(req.createdAt),
          leaveBalance: balances,
          approvedOn: req.updatedAt && req.status === 'APPROVED' ? formatDate(req.updatedAt) : null,
          approvedBy: req.approverId ? 'Manager' : null, // improved check
          rejectedOn: req.updatedAt && req.status === 'REJECTED' ? formatDate(req.updatedAt) : null,
          rejectionReason: null // Not supported by backend yet
        };
      });
      setLeaveRequests(formatted);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { value: 'all', label: 'All Requests', count: leaveRequests.length },
    { value: 'pending', label: 'Pending', count: leaveRequests.filter(r => r.status === 'pending').length },
    { value: 'approved', label: 'Approved', count: leaveRequests.filter(r => r.status === 'approved').length },
    { value: 'rejected', label: 'Rejected', count: leaveRequests.filter(r => r.status === 'rejected').length },
  ];

  const getLeaveTypeName = (type) => {
    switch (type) {
      case 'CL': return 'Casual Leave';
      case 'SL': return 'Sick Leave';
      case 'AL': return 'Annual Leave';
      case 'PL': return 'Paid Leave';
      default: return type;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Sick Leave':
      case 'SL': return 'bg-yellow-100 text-yellow-800 border border-yellow-500';
      case 'Casual Leave':
      case 'CL': return 'bg-blue-100 text-blue-800 border border-blue-500';
      case 'Earned Leave':
      case 'AL': return 'bg-green-100 text-green-800 border border-green-500';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const filteredRequests = leaveRequests.filter(request => {
    if (filter !== 'all' && request.status !== filter) return false;
    if (searchTerm && !request.employee.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // --- Advanced Features ---

  const checkCollisions = (request) => {
    return leaveRequests.filter(r =>
      r.id !== request.id &&
      r.status === 'approved' &&
      (r.dates === request.dates) &&
      r.employee.department === request.employee.department
    );
  };

  const openActionModal = (type, id) => {
    setActionType(type);
    setActionRequestId(id);
    setActionReason('');
    setShowActionModal(true);
  };

  const confirmAction = async () => {
    if (!actionRequestId) return;

    try {
      if (actionType === 'approve') {
        await managerService.approveLeave(actionRequestId, actionReason);
        // Optimistic update
        setLeaveRequests(prev => prev.map(req =>
          req.id === actionRequestId ? { ...req, status: 'approved' } : req
        ));
      } else if (actionType === 'reject') {
        if (!actionReason) {
          alert("Please provide a reason for rejection.");
          return;
        }
        await managerService.rejectLeave(actionRequestId, actionReason);
        // Optimistic update
        setLeaveRequests(prev => prev.map(req =>
          req.id === actionRequestId ? { ...req, status: 'rejected' } : req
        ));
      }
      // Re-fetch to ensure consistency
      fetchRequests();
    } catch (err) {
      console.error("Action failed", err);
      alert("Failed to process request: " + (err.response?.data?.message || err.message));
    }

    setShowActionModal(false);
    setSelectedRequest(null);
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
  };

  const handleExportData = (format = 'csv') => {
    let dataStr, fileName, mimeType;

    if (format === 'csv') {
      const headers = ['Employee', 'Department', 'Type', 'Dates', 'Days', 'Status', 'Reason', 'Applied On'];
      const rows = filteredRequests.map(req =>
        [req.employee.name, req.employee.department, req.type, req.dates, req.days, req.status, req.reason, req.appliedOn].join(',')
      );
      dataStr = [headers.join(','), ...rows].join('\n');
      fileName = `leave-requests-${filter}-${new Date().getTime()}.csv`;
      mimeType = 'text/csv';
    } else if (format === 'json') {
      const exportData = {
        filter,
        total: filteredRequests.length,
        requests: filteredRequests
      };
      dataStr = JSON.stringify(exportData, null, 2);
      fileName = `leave-requests-${filter}-${new Date().getTime()}.json`;
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
    alert(`Leave requests exported as ${format.toUpperCase()}!`);
  };

  const handleSendEmail = (email, subject, body) => {
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
  };

  const handleAddNewRequest = () => {
    setShowAddModal(true);
  };

  const handleSubmitNewRequest = async (e) => {
    e.preventDefault();
    try {
      await managerService.applyLeave({
        leaveType: newRequest.leaveType,
        fromDate: newRequest.fromDate,
        toDate: newRequest.toDate,
        reason: newRequest.reason
      });
      alert('Leave request submitted successfully!');
      setShowAddModal(false);
      setNewRequest({
        leaveType: 'CL',
        fromDate: '',
        toDate: '',
        reason: ''
      });
      fetchRequests();
    } catch (err) {
      console.error("Failed to submit leave request:", err);
      alert(err.response?.data?.message || "Failed to submit leave request");
    }
  };

  const handleDeleteRequest = (id, employeeName) => {
    const confirmed = window.confirm(`Delete leave request for ${employeeName}?`);
    if (confirmed) {
      setLeaveRequests(prev => prev.filter(req => req.id !== id));
      alert(`Leave request deleted successfully!`);
    }
  };

  const handleViewCalendar = (dateStr) => {
    if (!dateStr) return;
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      const formatted = date.toISOString().split('T')[0];
      navigate(`/calendar?date=${formatted}`);
    }
  };

  const handleViewAnalytics = () => {
    navigate('/analytics');
  };

  const handleViewEmployeeProfile = (employee) => {
    navigate(`/employees?view=${employee.name.toLowerCase().replace(' ', '-')}`);
  };

  const handleSendReminder = (employee) => {
    const subject = 'Reminder: Action Required on Leave Request';
    const body = `Dear ${employee.name},\n\nThis is a reminder about your pending leave request. Please ensure all required documents are submitted.\n\nBest regards,\nHR Department`;
    handleSendEmail(employee.email, subject, body);
  };

  const getRelevantBalance = (request) => {
    if (!request.leaveBalance) return null;

    // Determine which balance to show based on request type
    let type = request.type;
    // Map code to key
    if (type === 'CL' || type === 'Casual Leave') return { label: 'CL', val: request.leaveBalance.casual, color: 'blue' };
    if (type === 'SL' || type === 'Sick Leave') return { label: 'SL', val: request.leaveBalance.sick, color: 'yellow' };
    if (type === 'AL' || type === 'Earned Leave' || type === 'EL') return { label: 'EL', val: request.leaveBalance.earned, color: 'green' };

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 max-w-[1600px] mx-auto space-y-8">

      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Leave Approval
          </h1>
          <p className="text-slate-500 mt-1">
            Manage and track your team's leave requests efficiently
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddNewRequest}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium shadow-sm transition"
          >
            <Plus size={18} />
            New Request
          </button>

          <div className="relative">
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition"
            >
              <Download size={18} />
              Export
              <ChevronDown size={16} className="text-slate-400" />
            </button>

            {showExportOptions && (
              <div className="absolute right-0 top-14 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 z-50 overflow-hidden">
                <button
                  onClick={() => handleExportData('csv')}
                  className="w-full text-left px-5 py-3 hover:bg-slate-50 text-sm font-medium text-slate-700 transition border-b border-slate-50"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => handleExportData('json')}
                  className="w-full text-left px-5 py-3 hover:bg-slate-50 text-sm font-medium text-slate-700 transition"
                >
                  Export as JSON
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Pending Review</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">
              {leaveRequests.filter(r => r.status === "pending").length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Clock size={22} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Approved</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">
              {leaveRequests.filter(r => r.status === "approved").length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
            <CheckCircle size={22} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Rejected</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">
              {leaveRequests.filter(r => r.status === "rejected").length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <XCircle size={22} />
          </div>
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

        {/* ================= TABLE ================= */}
        <div className={selectedRequest ? "xl:col-span-3" : "xl:col-span-4"}>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

            {/* FILTER BAR */}
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                {filters.map(item => (
                  <button
                    key={item.value}
                    onClick={() => setFilter(item.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === item.value
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search employee..."
                  className="pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Employee</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Leave</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredRequests.map(request => (
                    <tr
                      key={request.id}
                      onClick={() => handleViewDetails(request)}
                      className="hover:bg-slate-50 cursor-pointer transition"
                    >
                      <td className="px-6 py-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {request.employee.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {request.employee.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {request.employee.department}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${getTypeColor(request.type)}`}>
                          {getLeaveTypeName(request.type)}
                        </span>
                        <p className="text-sm text-slate-700 mt-1">
                          {request.days} day(s)
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar size={12} /> {request.dates}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        {request.status === "pending" && (
                          <span className="px-3 py-1.5 text-xs rounded-full bg-orange-50 text-orange-600 border border-orange-100">
                            Pending
                          </span>
                        )}
                        {request.status === "approved" && (
                          <span className="px-3 py-1.5 text-xs rounded-full bg-green-50 text-green-600 border border-green-100">
                            Approved
                          </span>
                        )}
                        {request.status === "rejected" && (
                          <span className="px-3 py-1.5 text-xs rounded-full bg-red-50 text-red-600 border border-red-100">
                            Rejected
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div onClick={(e) => e.stopPropagation()} className="flex justify-end gap-2">
                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={() => openActionModal('approve', request.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                title="Approve"
                              >
                                <Check size={18} />
                              </button>
                              <button
                                onClick={() => openActionModal('reject', request.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Reject"
                              >
                                <X size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ================= DETAILS PANEL ================= */}
        {selectedRequest && (
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Request Details
              </h3>

              <p className="text-sm text-slate-600">
                {selectedRequest.reason}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* ================= NEW REQUEST MODAL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">New Leave Request</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitNewRequest} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Leave Type</label>
                <select
                  value={newRequest.leaveType}
                  onChange={(e) => setNewRequest({ ...newRequest, leaveType: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="CL">Casual Leave (CL)</option>
                  <option value="SL">Sick Leave (SL)</option>
                  <option value="AL">Earned Leave (AL)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">From Date</label>
                  <input
                    type="date"
                    value={newRequest.fromDate}
                    onChange={(e) => setNewRequest({ ...newRequest, fromDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">To Date</label>
                  <input
                    type="date"
                    value={newRequest.toDate}
                    onChange={(e) => setNewRequest({ ...newRequest, toDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
                <textarea
                  value={newRequest.reason}
                  onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  placeholder="Reason for leave..."
                  required
                ></textarea>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ACTION MODAL ================= */}
      {showActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className={`text-lg font-bold ${actionType === 'approve' ? 'text-green-600' : 'text-red-600'}`}>
                {actionType === 'approve' ? 'Approve Request' : 'Reject Request'}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {actionType === 'approve'
                  ? 'Are you sure you want to approve this leave request?'
                  : 'Please provide a reason for rejecting this request.'}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Remark / Reason {actionType === 'reject' && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  placeholder={actionType === 'approve' ? "Optional remark..." : "Reason for rejection..."}
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className={`flex-1 px-4 py-2.5 text-white font-medium rounded-xl shadow-sm transition ${actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                    }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default LeaveApproval;

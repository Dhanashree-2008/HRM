import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
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
      case 'SL': return { bg: `${themeColors.warning}20`, text: themeColors.warning, border: themeColors.warning };
      case 'Casual Leave':
      case 'CL': return { bg: `${themeColors.primary}20`, text: themeColors.primary, border: themeColors.primary };
      case 'Earned Leave':
      case 'AL': return { bg: `${themeColors.secondary}20`, text: themeColors.secondary, border: themeColors.secondary };
      default: return { bg: `${themeColors.muted}20`, text: themeColors.text, border: themeColors.muted };
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
    <div className="min-h-screen p-6 md:p-8 max-w-[1600px] mx-auto space-y-8 transition-colors duration-300" style={{ backgroundColor: themeColors.background }}>

      {/* ================= HEADER ================= */}
      <div className="rounded-2xl border shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors duration-300" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight transition-colors duration-300" style={{ color: themeColors.text }}>
            Leave Approval
          </h1>
          <p className="mt-1 transition-colors duration-300" style={{ color: themeColors.muted }}>
            Manage and track your team's leave requests efficiently
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddNewRequest}
            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-medium shadow-sm hover:opacity-90 transition-colors duration-300"
            style={{ backgroundColor: themeColors.primary }}
          >
            <Plus size={18} />
            New Request
          </button>

          <div className="relative">
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="flex items-center gap-2 px-5 py-2.5 border rounded-xl font-medium hover:opacity-80 transition-colors duration-300"
              style={{ backgroundColor: themeColors.card, borderColor: themeColors.border, color: themeColors.text }}
            >
              <Download size={18} />
              Export
              <ChevronDown size={16} className="transition-colors duration-300" style={{ color: themeColors.muted }} />
            </button>

            {showExportOptions && (
              <div className="absolute right-0 top-14 w-48 rounded-xl shadow-lg border z-50 overflow-hidden transition-colors duration-300" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}>
                <button
                  onClick={() => handleExportData('csv')}
                  className="w-full text-left px-5 py-3 hover:opacity-80 text-sm font-medium transition-colors duration-300 border-b"
                  style={{ color: themeColors.text, borderColor: themeColors.border }}
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => handleExportData('json')}
                  className="w-full text-left px-5 py-3 hover:opacity-80 text-sm font-medium transition-colors duration-300"
                  style={{ color: themeColors.text }}
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
        <div className="rounded-2xl border shadow-sm p-6 flex justify-between transition-colors duration-300" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}>
          <div>
            <p className="text-sm font-medium transition-colors duration-300" style={{ color: themeColors.muted }}>Pending Review</p>
            <h3 className="text-3xl font-bold mt-1 transition-colors duration-300" style={{ color: themeColors.text }}>
              {leaveRequests.filter(r => r.status === "pending").length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: `${themeColors.warning}20`, color: themeColors.warning }}>
            <Clock size={22} />
          </div>
        </div>

        <div className="rounded-2xl border shadow-sm p-6 flex justify-between transition-colors duration-300" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}>
          <div>
            <p className="text-sm font-medium transition-colors duration-300" style={{ color: themeColors.muted }}>Approved</p>
            <h3 className="text-3xl font-bold mt-1 transition-colors duration-300" style={{ color: themeColors.text }}>
              {leaveRequests.filter(r => r.status === "approved").length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: `${themeColors.secondary}20`, color: themeColors.secondary }}>
            <CheckCircle size={22} />
          </div>
        </div>

        <div className="rounded-2xl border shadow-sm p-6 flex justify-between transition-colors duration-300" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}>
          <div>
            <p className="text-sm font-medium transition-colors duration-300" style={{ color: themeColors.muted }}>Rejected</p>
            <h3 className="text-3xl font-bold mt-1 transition-colors duration-300" style={{ color: themeColors.text }}>
              {leaveRequests.filter(r => r.status === "rejected").length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: `${themeColors.danger}20`, color: themeColors.danger }}>
            <XCircle size={22} />
          </div>
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

        {/* ================= TABLE ================= */}
        <div className={selectedRequest ? "xl:col-span-3" : "xl:col-span-4"}>
          <div className="rounded-2xl border shadow-sm overflow-hidden transition-colors duration-300" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}>

            {/* FILTER BAR */}
            <div className="p-5 border-b flex flex-col sm:flex-row gap-4 justify-between transition-colors duration-300" style={{ borderColor: themeColors.border }}>
              <div className="flex items-center gap-2 p-1 rounded-xl transition-colors duration-300" style={{ backgroundColor: isDarkMode ? themeColors.background : '#f1f5f9' }}>
                {filters.map(item => (
                  <button
                    key={item.value}
                    onClick={() => setFilter(item.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${filter === item.value
                      ? "shadow-sm"
                      : "hover:opacity-80"
                      }`}
                    style={{
                      backgroundColor: filter === item.value ? themeColors.card : 'transparent',
                      color: filter === item.value ? themeColors.primary : themeColors.muted
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300" style={{ color: themeColors.muted }} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search employee..."
                  className="pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 transition-colors duration-300"
                  style={{
                    backgroundColor: themeColors.inputBg,
                    color: themeColors.text,
                    border: `1px solid ${themeColors.border}`
                  }}
                />
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="transition-colors duration-300" style={{ backgroundColor: isDarkMode ? themeColors.background : '#f8fafc' }}>
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase transition-colors duration-300" style={{ color: themeColors.muted }}>Employee</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase transition-colors duration-300" style={{ color: themeColors.muted }}>Leave</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase transition-colors duration-300" style={{ color: themeColors.muted }}>Status</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-right transition-colors duration-300" style={{ color: themeColors.muted }}>Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y transition-colors duration-300" style={{ divideColor: themeColors.border }}>
                  {filteredRequests.map(request => (
                    <tr
                      key={request.id}
                      onClick={() => handleViewDetails(request)}
                      className="cursor-pointer transition-colors duration-300 hover:opacity-90"
                      style={{ backgroundColor: themeColors.card }}
                    >
                      <td className="px-6 py-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-300" style={{ backgroundColor: `${themeColors.primary}20`, color: themeColors.primary }}>
                          {request.employee.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-semibold transition-colors duration-300" style={{ color: themeColors.text }}>
                            {request.employee.name}
                          </p>
                          <p className="text-xs transition-colors duration-300" style={{ color: themeColors.muted }}>
                            {request.employee.department}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {(() => {
                          const style = getTypeColor(request.type);
                          return (
                            <span className="px-2 py-1 text-xs font-semibold rounded transition-colors duration-300"
                              style={{ backgroundColor: style.bg, color: style.text, border: `1px solid ${style.border}` }}>
                              {getLeaveTypeName(request.type)}
                            </span>
                          );
                        })()}
                        <p className="text-sm mt-1 transition-colors duration-300" style={{ color: themeColors.text }}>
                          {request.days} day(s)
                        </p>
                        <p className="text-xs flex items-center gap-1 transition-colors duration-300" style={{ color: themeColors.muted }}>
                          <Calendar size={12} /> {request.dates}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        {request.status === "pending" && (
                          <span className="px-3 py-1.5 text-xs rounded-full transition-colors duration-300" style={{ backgroundColor: `${themeColors.warning}20`, color: themeColors.warning, border: `1px solid ${themeColors.warning}` }}>
                            Pending
                          </span>
                        )}
                        {request.status === "approved" && (
                          <span className="px-3 py-1.5 text-xs rounded-full transition-colors duration-300" style={{ backgroundColor: `${themeColors.secondary}20`, color: themeColors.secondary, border: `1px solid ${themeColors.secondary}` }}>
                            Approved
                          </span>
                        )}
                        {request.status === "rejected" && (
                          <span className="px-3 py-1.5 text-xs rounded-full transition-colors duration-300" style={{ backgroundColor: `${themeColors.danger}20`, color: themeColors.danger, border: `1px solid ${themeColors.danger}` }}>
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
                                className="p-2 rounded-lg transition-colors duration-300 hover:opacity-80"
                                style={{ color: themeColors.secondary, backgroundColor: `${themeColors.secondary}10` }}
                                title="Approve"
                              >
                                <Check size={18} />
                              </button>
                              <button
                                onClick={() => openActionModal('reject', request.id)}
                                className="p-2 rounded-lg transition-colors duration-300 hover:opacity-80"
                                style={{ color: themeColors.danger, backgroundColor: `${themeColors.danger}10` }}
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
            <div className="rounded-2xl border shadow-sm p-6 sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto transition-colors duration-300" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}>
              <h3 className="text-lg font-bold mb-4 transition-colors duration-300" style={{ color: themeColors.text }}>
                Request Details
              </h3>

              <p className="text-sm transition-colors duration-300" style={{ color: themeColors.text }}>
                {selectedRequest.reason}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* ================= NEW REQUEST MODAL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="rounded-2xl shadow-xl w-full max-w-md overflow-hidden transition-colors duration-300" style={{ backgroundColor: themeColors.card }}>
            <div className="p-6 border-b flex justify-between items-center transition-colors duration-300" style={{ borderColor: themeColors.border }}>
              <h3 className="text-lg font-bold transition-colors duration-300" style={{ color: themeColors.text }}>New Leave Request</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="transition-colors duration-300 hover:opacity-80"
                style={{ color: themeColors.muted }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitNewRequest} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 transition-colors duration-300" style={{ color: themeColors.text }}>Leave Type</label>
                <select
                  value={newRequest.leaveType}
                  onChange={(e) => setNewRequest({ ...newRequest, leaveType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl outline-none focus:ring-2 transition-colors duration-300"
                  style={{ backgroundColor: themeColors.inputBg, borderColor: themeColors.border, color: themeColors.text, border: `1px solid ${themeColors.border}` }}
                >
                  <option value="CL">Casual Leave (CL)</option>
                  <option value="SL">Sick Leave (SL)</option>
                  <option value="AL">Earned Leave (AL)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 transition-colors duration-300" style={{ color: themeColors.text }}>From Date</label>
                  <input
                    type="date"
                    value={newRequest.fromDate}
                    onChange={(e) => setNewRequest({ ...newRequest, fromDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl outline-none focus:ring-2 transition-colors duration-300"
                    style={{ backgroundColor: themeColors.inputBg, borderColor: themeColors.border, color: themeColors.text, border: `1px solid ${themeColors.border}` }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 transition-colors duration-300" style={{ color: themeColors.text }}>To Date</label>
                  <input
                    type="date"
                    value={newRequest.toDate}
                    onChange={(e) => setNewRequest({ ...newRequest, toDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl outline-none focus:ring-2 transition-colors duration-300"
                    style={{ backgroundColor: themeColors.inputBg, borderColor: themeColors.border, color: themeColors.text, border: `1px solid ${themeColors.border}` }}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 transition-colors duration-300" style={{ color: themeColors.text }}>Reason</label>
                <textarea
                  value={newRequest.reason}
                  onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-xl outline-none focus:ring-2 resize-none transition-colors duration-300"
                  style={{ backgroundColor: themeColors.inputBg, borderColor: themeColors.border, color: themeColors.text, border: `1px solid ${themeColors.border}` }}
                  placeholder="Reason for leave..."
                  required
                ></textarea>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 border font-medium rounded-xl hover:opacity-80 transition-colors duration-300"
                  style={{ borderColor: themeColors.border, color: themeColors.text }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 text-white font-medium rounded-xl hover:opacity-90 transition-colors duration-300 shadow-sm disabled:opacity-50"
                  style={{ backgroundColor: themeColors.primary }}
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
          <div className="rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transition-colors duration-300" style={{ backgroundColor: themeColors.card }}>
            <div className="p-6 border-b transition-colors duration-300" style={{ borderColor: themeColors.border }}>
              <h3 className="text-lg font-bold transition-colors duration-300" style={{ color: actionType === 'approve' ? themeColors.secondary : themeColors.danger }}>
                {actionType === 'approve' ? 'Approve Request' : 'Reject Request'}
              </h3>
              <p className="text-sm mt-1 transition-colors duration-300" style={{ color: themeColors.muted }}>
                {actionType === 'approve'
                  ? 'Are you sure you want to approve this leave request?'
                  : 'Please provide a reason for rejecting this request.'}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 transition-colors duration-300" style={{ color: themeColors.text }}>
                  Remark / Reason {actionType === 'reject' && <span style={{ color: themeColors.danger }}>*</span>}
                </label>
                <textarea
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-xl outline-none focus:ring-2 resize-none transition-colors duration-300"
                  style={{ backgroundColor: themeColors.inputBg, borderColor: themeColors.border, color: themeColors.text, border: `1px solid ${themeColors.border}` }}
                  placeholder={actionType === 'approve' ? "Optional remark..." : "Reason for rejection..."}
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="flex-1 px-4 py-2.5 border font-medium rounded-xl hover:opacity-80 transition-colors duration-300"
                  style={{ borderColor: themeColors.border, color: themeColors.text }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className="flex-1 px-4 py-2.5 text-white font-medium rounded-xl shadow-sm transition-colors duration-300 hover:opacity-90"
                  style={{ backgroundColor: actionType === 'approve' ? themeColors.secondary : themeColors.danger }}
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

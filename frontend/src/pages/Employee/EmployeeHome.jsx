import { useOutletContext, useNavigate, useLocation } from "react-router-dom";
import employeeService from "../../services/employeeService";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Home,
  Clock,
  FileText,
  Calendar,
  Shield,
  User,
  Bell,
  LogOut,
  Menu,
  X,
  Search,
  Download,
  Eye,
  ChevronRight,
  Plus,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  CreditCard,
  Receipt,
  Wallet,
  Banknote,
  FileSpreadsheet,
  CalendarDays,
  Users,
  Sun,
  Moon,
  ChevronLeft,
  ChevronDown,
  FileCheck,
  Target,
  BarChart3,
  TrendingUp as TrendingUpIcon,
  PieChart,
  Activity,
  Check,
  MoreVertical,
  ChevronUp,
  ChevronsUp,
  Briefcase,
  Timer,
  Award,
  Star,
  Circle,
  CheckSquare,
  Square,
  Clock as ClockIcon,
  LogOut as LogOutIcon,
  Coffee,
  Umbrella,
  Heart,
  Plane,
  Home as HomeIcon,
  Building,
  Calendar as CalendarIcon,
  Zap,
  Battery,
  BatteryCharging,
  Wifi,
  WifiOff,
} from "lucide-react";

const EmployeeDashboard = () => {
  // Theme state

  const location = useLocation();
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    // Sync active section with URL path
    const path = location.pathname.split('/').pop();
    if (path && path !== 'employee') {
      setActiveSection(path);
    } else {
      setActiveSection('dashboard');
    }
  }, [location]);



  // Attendance state
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [clockInTime, setClockInTime] = useState("09:00 AM");
  const [clockOutTime, setClockOutTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDateDetails, setShowDateDetails] = useState(false);

  // Task state
  // Task state
  const [tasks, setTasks] = useState([]);


  // Form states
  const [newLeave, setNewLeave] = useState({
    type: "casual",
    from: "",
    to: "",
    reason: "",
  });

  const [newWorklog, setNewWorklog] = useState({
    task: "",
    description: "",
    time: "",
    project: "Alpha",
    date: new Date().toISOString().split("T")[0],
  });

  // Filter states
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showWorklogModal, setShowWorklogModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Enhanced attendance data for calendar with mark-in/out details
  const [attendanceData, setAttendanceData] = useState({});


  // Holiday data
  const [holidayData, setHolidayData] = useState({});

  // Leave Types
  const [leaveTypes, setLeaveTypes] = useState([]);





  // Sample data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Payslip Available",
      message: "December payslip is ready to view",
      time: "2 hours ago",
      read: false,
      type: "info",
    },
  ]);



  const [payslips, setPayslips] = useState([]);


  const [worklogs, setWorklogs] = useState([]);


  const [leaveBalance, setLeaveBalance] = useState({
    casual: 0,
    sick: 0,
    earned: 0,
  });

  const [leaves, setLeaves] = useState([]);

  const [viewPayslip, setViewPayslip] = useState(null);

  const [personalDocuments, setPersonalDocuments] = useState([]);


  // Analytics data
  const [analytics, setAnalytics] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = async () => {
    try {
      const [
        dashboardStats,
        attendanceRecords,
        tasksList,
        leavesList,
        worklogsList,
        leaveBalances,
        holidaysList,
        payslipsList,
        documentsList,
        leaveTypesList
      ] = await Promise.all([
        employeeService.getDashboardStats(),
        employeeService.getAttendance(),
        employeeService.getTasks(),
        employeeService.getLeaves(),
        employeeService.getWorklogs(),
        employeeService.getLeaveBalance(),
        employeeService.getHolidays(),
        employeeService.getPayslips(),
        employeeService.getDocuments(),
        employeeService.getLeaveTypes()
      ]);

      // Calculate weekly hours from worklogs
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      startOfWeek.setHours(0, 0, 0, 0);

      const weeklyHours = worklogsList
        .filter(w => new Date(w.date) >= startOfWeek)
        .reduce((sum, w) => sum + (parseFloat(w.hoursWorked) || 0), 0);

      // Map dashboard stats to analytics object expected by UI
      setAnalytics({
        ...dashboardStats,
        attendanceRate: dashboardStats.attendance?.totalDays ? Math.round((dashboardStats.attendance.presentDays / dashboardStats.attendance.totalDays) * 100) : 0,
        productivity: 90, // Mock/Placeholder
        tasksCompleted: dashboardStats.tasks?.completed + dashboardStats.tasks?.pending > 0
          ? Math.round((dashboardStats.tasks.completed / (dashboardStats.tasks.completed + dashboardStats.tasks.pending)) * 100)
          : 0,
        weeklyHours: weeklyHours.toFixed(1),
        leaveDays: dashboardStats.leaves?.used || 0,
        onTimeArrival: 100, // Placeholder
        workDays: dashboardStats.attendance?.totalDays || 0,
        overtimeHours: 0, // Placeholder
        monthlyHours: 0 // Placeholder
      });

      // Transform attendance array to object keyed by date
      const attendanceMap = {};
      attendanceRecords.forEach(record => {
        const dateStr = new Date(record.date).toISOString().split('T')[0];

        let hours = record.hours || 0;
        // If markIn/markOut exist and hours not calc, calc it
        if (!hours && record.markIn && record.markOut) {
          const start = new Date(record.markIn);
          const end = new Date(record.markOut);
          // Only calc if dates are valid
          if (!isNaN(start) && !isNaN(end)) {
            hours = ((end - start) / (1000 * 60 * 60)).toFixed(1);
          }
        }

        attendanceMap[dateStr] = {
          ...record,
          status: record.markIn ? 'present' : 'absent',
          hours: hours,
          markIn: record.markIn ? new Date(record.markIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--',
          markOut: record.markOut ? new Date(record.markOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--',
          rawMarkIn: record.markIn,
          rawMarkOut: record.markOut
        };
      });
      setAttendanceData(attendanceMap);

      // Check for today's attendance to set clock in/out state
      // Check for today's attendance to set clock in/out state
      const todayStr = new Date().toISOString().split('T')[0];

      const todayRecord = attendanceMap[todayStr];
      if (todayRecord) {
        // Check if marked in (and ignore placeholder string if any)
        const hasMarkedIn = todayRecord.markIn && todayRecord.markIn !== '--:--';
        const hasMarkedOut = todayRecord.markOut && todayRecord.markOut !== '--:--';

        if (hasMarkedIn && !hasMarkedOut) {
          setIsClockedIn(true);
          setClockInTime(todayRecord.markIn);
        } else if (hasMarkedIn && hasMarkedOut) {
          setIsClockedIn(false);
          setClockInTime(todayRecord.markIn);
          setClockOutTime(todayRecord.markOut);
        } else {
          setIsClockedIn(false);
          setClockInTime(null);
        }
      } else {
        setIsClockedIn(false);
        setClockInTime(null);
      }

      setTasks(tasksList.map(t => ({
        ...t,
        completed: t.status === 'COMPLETED'
      })));
      setLeaves(leavesList.map(l => {
        const start = new Date(l.fromDate);
        const end = new Date(l.toDate);
        const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
        return {
          ...l,
          type: l.leaveType,
          from: l.fromDate,
          to: l.toDate,
          days: isNaN(days) ? 0 : days
        };
      }));
      setWorklogs(worklogsList.map(w => ({
        ...w,
        task: "Work Log",
        project: "Internal",
        time: w.hoursWorked ? `${w.hoursWorked} hrs` : '--',
        status: "Completed"
      })));
      setPayslips(payslipsList);
      setPersonalDocuments(documentsList.documents || documentsList || []);


      // Process leave balance
      const balanceMap = { casual: 0, sick: 0, earned: 0 };
      if (Array.isArray(leaveBalances)) {
        leaveBalances.forEach(b => {
          // Backend returns flattened structure: { leaveType: "name", code: "code", ... }
          const typeName = (b.leaveType || b.LeaveType?.name || "").toLowerCase();
          const typeCode = (b.code || b.LeaveType?.code || "").toLowerCase();

          if (typeName.includes('casual') || typeCode === 'cl') balanceMap.casual = b.remaining;
          else if (typeName.includes('sick') || typeCode === 'sl') balanceMap.sick = b.remaining;
          else if (typeName.includes('earned') || typeName.includes('privilege') || typeCode === 'el' || typeCode === 'pl') balanceMap.earned = b.remaining;
        });
      }
      setLeaveBalance(balanceMap);

      // Process holidays
      const holidayMap = {};
      if (Array.isArray(holidaysList)) {
        holidaysList.forEach(h => {
          // Assuming holiday object has date and name/title
          // h.date could be ISO string
          const dateStr = new Date(h.date).toISOString().split('T')[0];
          holidayMap[dateStr] = h.name || h.title;
        });
      }
      setHolidayData(holidayMap);

      setLeaveTypes(Array.isArray(leaveTypesList) ? leaveTypesList : []);

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      // Show more specific error if available
      const errMsg = err.response?.data?.message || err.message || "Failed to load dashboard data";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);


  // Graph data - Dynamic from tasks
  const [taskCompletionData, setTaskCompletionData] = useState([]);

  // Calculate task completion stats when tasks change
  useEffect(() => {
    if (!tasks || tasks.length === 0) {
      setTaskCompletionData([
        { week: "Week 1", completed: 0, total: 0, color: "#7C3AED" },
        { week: "Week 2", completed: 0, total: 0, color: "#2563EB" },
        { week: "Week 3", completed: 0, total: 0, color: "#10B981" },
        { week: "Week 4", completed: 0, total: 0, color: "#F59E0B" },
      ]);
      return;
    }

    const now = new Date();
    const stats = [];
    const colors = ["#7C3AED", "#2563EB", "#10B981", "#F59E0B"]; // Purple, Blue, Green, Amber

    // Generate last 4 weeks
    for (let i = 3; i >= 0; i--) {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - (i * 7 + 6)); // Start of the week window
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(now);
      endOfWeek.setDate(now.getDate() - (i * 7)); // End of the week window
      endOfWeek.setHours(23, 59, 59, 999);

      // Filter tasks created within this window
      const weekTasks = tasks.filter(task => {
        const created = new Date(task.createdAt);
        return created >= startOfWeek && created <= endOfWeek;
      });

      const total = weekTasks.length;
      const completed = weekTasks.filter(t => t.status === "COMPLETED").length;

      stats.push({
        week: i === 0 ? "Current" : `Week -${i}`,
        completed,
        total,
        color: colors[3 - i]
      });
    }

    // stats is already Oldest -> Newest (i=3 to i=0)

    const finalStats = stats.map((s, index) => ({
      ...s,
      week: `Week ${index + 1}`
    }));

    setTaskCompletionData(finalStats);

  }, [tasks]);


  // Calculate today's hours dynamically
  const [todayHours, setTodayHours] = useState("0h 0m");

  useEffect(() => {
    const calculateTodayHours = () => {
      const todayStr = new Date().toISOString().split('T')[0];
      const todayRecord = attendanceData[todayStr];

      if (todayRecord && todayRecord.rawMarkIn) {
        const start = new Date(todayRecord.rawMarkIn);
        const end = todayRecord.rawMarkOut ? new Date(todayRecord.rawMarkOut) : currentTime;

        if (!isNaN(start)) {
          const diffMs = end - start;
          const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
          const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          setTodayHours(`${diffHrs}h ${diffMins}m`);
        } else {
          setTodayHours("0h 0m");
        }
      } else {
        setTodayHours("0h 0m");
      }
    };

    calculateTodayHours();
    // Re-calculate every minute if clocked in
    const interval = setInterval(calculateTodayHours, 60000);
    return () => clearInterval(interval);
  }, [attendanceData, currentTime]);

  // Interactive state for graph hover
  const [hoveredBar, setHoveredBar] = useState(null);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
      });
    }

    // Next month days
    const totalCells = 42;
    const remainingCells = totalCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const changeMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const getAttendanceStatus = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return (
      attendanceData[dateStr] || {
        status: "not-marked",
        hours: 0,
        markIn: "--:--",
        markOut: "--:--",
        breaks: "--",
        overtime: "--",
        productivity: "--",
        notes: "No attendance marked",
      }
    );
  };

  const getHoliday = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return holidayData[dateStr] || null;
  };

  // Enhanced date click handler
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowDateDetails(true);
  };

  // Task completion handler
  // Task completion handler
  const handleTaskComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const newStatus = task.completed ? "PENDING" : "COMPLETED"; // Assuming boolean toggle in UI
      // But verify backend status strings: "PENDING", "COMPLETED", "IN_PROGRESS"

      await employeeService.updateTaskStatus(taskId, task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED');

      // Optimistic update
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed, status: task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' } : task
        )
      );
    } catch (err) {
      console.error("Error updating task:", err);
      // Revert or show error
    }
  };

  // Add new task
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    time: "",
    priority: "medium",
    project: "Alpha",
  });

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      if (!newTask.title) return; // Basic validation

      const createdTask = await employeeService.createTask({
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority.toUpperCase(),
        project: newTask.project, // Note: Backend doesn't have project field in Task model? Investigating.
        // Task model has: title, description, assignedToEmployeeId, assignedByEmployeeId, status, priority, dueDate.
        // It does NOT have 'project' or 'time'. 'time' in frontend seems to be due date or specific time?
        // Frontend has 'time' and 'project'. Backend doesn't. 
        // For now, I will map project/time to description or omit them to prevent errors if backend ignores extra fields.
        // Or better, append to description.
      });

      // Actually, let's just send what we have. If backend ignores it, fine.
      // But we need to make sure we don't break strict mode if any.
      // Let's reload all data to get the fresh list with proper IDs
      await fetchAllData();

      setNewTask({
        title: "",
        description: "",
        time: "",
        priority: "medium",
        project: "Alpha",
      });
      setShowNewTaskModal(false);
    } catch (err) {
      console.error("Failed to add task:", err);
      // Optional: setError("Failed to add task");
    }
  };

  // Attendance functions
  const handleClockIn = async () => {
    try {
      await employeeService.markClockIn();
      setIsClockedIn(true);
      setClockInTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      fetchAllData(); // Refresh data
    } catch (err) {
      console.error("Clock in failed:", err);
    }
  };

  const handleClockOut = async () => {
    try {
      await employeeService.markClockOut();
      setIsClockedIn(false);
      setClockOutTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      fetchAllData(); // Refresh data
    } catch (err) {
      console.error("Clock out failed:", err);
    }
  };

  // Handle leave application
  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      await employeeService.applyLeave({
        leaveType: newLeave.type, // Sending the value directly (code or name)
        fromDate: newLeave.from,
        toDate: newLeave.to,
        reason: newLeave.reason
      });

      setShowLeaveModal(false);
      setNewLeave({ type: "casual", from: "", to: "", reason: "" });
      fetchAllData(); // Refresh list
    } catch (err) {
      console.error("Apply leave failed:", err);
    }
  };

  // Handle worklog submission
  const handleSubmitWorklog = async (e) => {
    e.preventDefault();
    try {
      await employeeService.addWorklog({
        taskName: newWorklog.task,
        description: newWorklog.description,
        hoursWorked: parseFloat(newWorklog.time),
        date: newWorklog.date
      });

      setShowWorklogModal(false);
      setNewWorklog({
        task: "",
        description: "",
        time: "",
        project: "Alpha",
        date: new Date().toISOString().split("T")[0],
      });
      fetchAllData();
    } catch (err) {
      console.error("Add worklog failed:", err);
    }
  };

  // Filtered payslips
  const filteredPayslips = payslips.filter(
    (payslip) => Number(payslip.year) === Number(selectedYear)
  );

  // Filtered documents
  const filteredDocuments = personalDocuments.filter((doc) => {
    const matchesCategory =
      selectedCategory === "all" || doc.category === selectedCategory;
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "present":
      case "work-from-home":
        return { bg: "#D1FAE5", text: "#10B981", icon: CheckCircle };
      case "late":
      case "half-day":
        return { bg: "#FEF3C7", text: "#F59E0B", icon: AlertCircle };
      case "absent":
        return { bg: "#FEE2E2", text: "#EF4444", icon: X };
      case "holiday":
        return { bg: "#E0E7FF", text: "#6366F1", icon: Umbrella };
      case "weekend":
        return { bg: "#F3F4F6", text: "#6B7280", icon: Coffee };
      default:
        return { bg: "#F3F4F6", text: "#6B7280", icon: Clock };
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return CheckCircle;
      case "work-from-home":
        return HomeIcon;
      case "late":
        return Clock;
      case "half-day":
        return ClockIcon;
      case "absent":
        return X;
      case "holiday":
        return Umbrella;
      case "weekend":
        return Coffee;
      default:
        return Clock;
    }
  };



  // Theme state - Now from context
  const { user, isDarkMode } = useOutletContext();
  const userData = user?.employee || {};
  const navigate = useNavigate();

  // Theme colors based on your specification
  const themeColors = {
    // Using your exact color specifications
    primary: "#7C3AED",
    primaryLight: "#EDE9FE",
    secondary: "#2563EB",
    accent: "#10B981",

    // Backgrounds & Surfaces
    appBackground: isDarkMode ? "#0F172A" : "#F8FAFC",
    cardBackground: isDarkMode ? "#1E293B" : "#FFFFFF",
    cardHover: isDarkMode ? "#334155" : "#F1F5F9",
    borderDivider: isDarkMode ? "#334155" : "#E5E7EB",

    // Text Colors
    textPrimary: isDarkMode ? "#F1F5F9" : "#111827",
    textSecondary: isDarkMode ? "#CBD5E1" : "#374151",
    textMuted: isDarkMode ? "#94A3B8" : "#6B7280",
    textDisabled: isDarkMode ? "#64748B" : "#9CA3AF",

    // Status Colors
    success: "#10B981",
    successBg: isDarkMode ? "#064E3B" : "#D1FAE5",
    warning: "#F59E0B",
    warningBg: isDarkMode ? "#78350F" : "#FEF3C7",
    danger: "#EF4444",
    dangerBg: isDarkMode ? "#7F1D1D" : "#FEE2E2",
    info: "#3B82F6",
    infoBg: isDarkMode ? "#1E40AF" : "#DBEAFE",

    // Chart Colors
    chartPurple: "#7C3AED",
    chartBlue: "#2563EB",
    chartGreen: "#10B981",
    chartAmber: "#F59E0B",
    chartRed: "#EF4444",
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard();
      case "tasks":
        return renderTasks();
      case "attendance":
        return renderAttendance();
      case "worklogs":
        return renderWorklogs();
      case "leaves":
        return renderLeaveManagement();
      case "payslips":
        return renderPayslips();
      case "documents":
        return renderPersonalDocuments();
      case "profile":
        return renderProfile();
      default:
        return renderDashboard();
    }
  };

  // Tasks Section
  const renderTasks = () => (
    <div className="space-y-6">
      <div
        className="rounded-lg p-6 border mb-6"
        style={{
          backgroundColor: themeColors.cardBackground,
          borderColor: themeColors.borderDivider,
        }}
      >
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: themeColors.textPrimary }}
        >
          My Tasks
        </h1>
        <p style={{ color: themeColors.textSecondary }}>
          Manage and track your assigned tasks
        </p>
      </div>

      {tasks.length === 0 ? (
        <div
          className="rounded-lg border p-12 text-center"
          style={{
            backgroundColor: themeColors.cardBackground,
            borderColor: themeColors.borderDivider,
          }}
        >
          <Target className="w-12 h-12 mx-auto mb-4 opacity-50" style={{ color: themeColors.textMuted }} />
          <h3 className="text-lg font-medium mb-1" style={{ color: themeColors.textPrimary }}>No tasks assigned</h3>
          <p style={{ color: themeColors.textSecondary }}>You're all caught up!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-lg border p-4 transition-all hover:shadow-md"
              style={{
                backgroundColor: themeColors.cardBackground,
                borderColor: themeColors.borderDivider,
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border`}
                      style={{
                        backgroundColor: task.priority === 'HIGH' ? themeColors.dangerBg : task.priority === 'MEDIUM' ? themeColors.warningBg : themeColors.successBg,
                        color: task.priority === 'HIGH' ? themeColors.danger : task.priority === 'MEDIUM' ? themeColors.warning : themeColors.success,
                        borderColor: 'transparent'
                      }}
                    >
                      {task.priority || 'NORMAL'}
                    </span>
                    {task.dueDate && (
                      <span className="flex items-center text-xs" style={{ color: themeColors.textMuted }}>
                        <CalendarIcon size={12} className="mr-1" />
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold mb-1" style={{ color: themeColors.textPrimary }}>
                    {task.title}
                  </h3>
                  <p className="text-sm mb-3" style={{ color: themeColors.textSecondary }}>
                    {task.description || "No description provided."}
                  </p>

                  <div className="flex items-center gap-2 text-xs" style={{ color: themeColors.textMuted }}>
                    <User size={12} />
                    <span>Assigned by: {task.assigner?.fullName || "Manager"}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => handleTaskComplete(task.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border`}
                    style={{
                      backgroundColor: task.status === 'COMPLETED' ? themeColors.successBg : 'transparent',
                      color: task.status === 'COMPLETED' ? themeColors.success : themeColors.textSecondary,
                      borderColor: task.status === 'COMPLETED' ? 'transparent' : themeColors.borderDivider
                    }}
                  >
                    {task.status === 'COMPLETED' ? (
                      <>
                        <CheckCircle size={16} />
                        Completed
                      </>
                    ) : (
                      <>
                        <Circle size={16} />
                        Mark Complete
                      </>
                    )}
                  </button>
                  <span className="text-xs uppercase font-bold tracking-wider" style={{ color: themeColors.textMuted }}>{task.status?.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Profile Section
  const renderProfile = () => (
    <div className="space-y-6">
      <div
        className="rounded-lg p-6 border mb-6"
        style={{
          backgroundColor: themeColors.cardBackground,
          borderColor: themeColors.borderDivider,
        }}
      >
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: themeColors.textPrimary }}
        >
          My Profile
        </h1>
        <p style={{ color: themeColors.textSecondary }}>
          Manage your personal information and settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div
          className="col-span-1 rounded-lg border p-6 flex flex-col items-center"
          style={{
            backgroundColor: themeColors.cardBackground,
            borderColor: themeColors.borderDivider,
          }}
        >
          <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4" style={{ borderColor: themeColors.primaryLight }}>
            {userData.profileImage ? (
              <img
                src={userData.profileImage}
                alt={userData.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-4xl font-bold"
                style={{ backgroundColor: themeColors.primary, color: "#FFF" }}
              >
                {userData.fullName?.charAt(0) || "U"}
              </div>
            )}
          </div>
          <h2
            className="text-xl font-bold mb-1"
            style={{ color: themeColors.textPrimary }}
          >
            {userData.fullName || "N/A"}
          </h2>
          <p
            className="text-sm mb-4"
            style={{ color: themeColors.textSecondary }}
          >
            {userData.designation || "Employee"}
          </p>
          <div
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: themeColors.successBg,
              color: themeColors.success,
            }}
          >
            {userData.status || "Active"}
          </div>
        </div>

        {/* Details Grid */}
        <div
          className="col-span-1 md:col-span-2 rounded-lg border p-6"
          style={{
            backgroundColor: themeColors.cardBackground,
            borderColor: themeColors.borderDivider,
          }}
        >
          <h3
            className="text-lg font-semibold mb-6"
            style={{ color: themeColors.textPrimary }}
          >
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Employee ID", value: userData.employeeCode || "N/A" },
              { label: "Department", value: userData.department || "N/A" },
              { label: "Email", value: user?.email || "N/A" },
              { label: "Phone", value: userData.phone || "N/A" },
              { label: "Location", value: userData.location || "N/A" },
              { label: "Join Date", value: userData.joiningDate ? new Date(userData.joiningDate).toLocaleDateString() : "N/A" },
            ].map((item, index) => (
              <div key={index}>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: themeColors.textSecondary }}
                >
                  {item.label}
                </label>
                <div
                  className="text-base font-medium"
                  style={{ color: themeColors.textPrimary }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // DashboardHeader
  const DashboardHeader = () => (
    <div
      className="rounded-lg p-6 border mb-6 transform hover:scale-[1.002] transition-all duration-300"
      style={{
        backgroundColor: themeColors.cardBackground,
        borderColor: themeColors.borderDivider,
      }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: themeColors.textPrimary }}
          >
            Welcome back, {userData.fullName || "Employee"}!
          </h1>
          <p style={{ color: themeColors.textSecondary }}>
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <div
            className="rounded-lg p-3 border transform hover:scale-105 transition-all duration-200"
            style={{
              backgroundColor: themeColors.cardBackground,
              borderColor: themeColors.borderDivider,
            }}
          >
            <div className="flex items-center space-x-3">
              <Clock size={20} style={{ color: themeColors.primary }} />
              <div>
                <p
                  className="text-sm"
                  style={{ color: themeColors.textSecondary }}
                >
                  Current Time
                </p>
                <p
                  className="text-lg font-bold"
                  style={{ color: themeColors.textPrimary }}
                >
                  {currentTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
          {/* ThemeToggle in header */}
          {/* <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2.5 rounded-lg border transition-all duration-300 hover:scale-110 hover:opacity-90"
            style={{
              backgroundColor: themeColors.cardBackground,
              borderColor: themeColors.borderDivider,
            }}
          >
            {isDarkMode ? (
              <Sun size={20} style={{ color: themeColors.warning }} />
            ) : (
              <Moon size={20} style={{ color: themeColors.textPrimary }} />
            )}
          </button> */}
        </div>
      </div>
    </div>
  );

  // AttendanceSummary
  const AttendanceSummary = () => (
    <div
      className="rounded-lg p-5 border transform hover:scale-[1.02] transition-all duration-300"
      style={{
        backgroundColor: themeColors.cardBackground,
        borderColor: themeColors.borderDivider,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="p-2 rounded-lg transform hover:rotate-12 transition-transform"
          style={{ backgroundColor: themeColors.primaryLight }}
        >
          <CheckCircle size={20} style={{ color: themeColors.primary }} />
        </div>
        <span
          className="px-2 py-1 rounded text-xs font-semibold transform hover:scale-105 transition-transform"
          style={{
            backgroundColor: isClockedIn
              ? themeColors.successBg
              : themeColors.dangerBg,
            color: isClockedIn ? themeColors.success : themeColors.danger,
          }}
        >
          {isClockedIn ? "CLOCKED IN" : "CLOCKED OUT"}
        </span>
      </div>
      <h3
        className="text-lg font-semibold mb-3"
        style={{ color: themeColors.textPrimary }}
      >
        Attendance
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between transform hover:translate-x-1 transition-transform">
          <span
            style={{ color: themeColors.textSecondary }}
            className="text-sm"
          >
            Clock In
          </span>
          <span
            className="font-medium"
            style={{ color: themeColors.textPrimary }}
          >
            {clockInTime}
          </span>
        </div>
        <div className="flex justify-between transform hover:translate-x-1 transition-transform">
          <span
            style={{ color: themeColors.textSecondary }}
            className="text-sm"
          >
            Clock Out
          </span>
          <span
            className="font-medium"
            style={{ color: themeColors.textPrimary }}
          >
            {clockOutTime || "--:--"}
          </span>
        </div>
        <div className="flex justify-between transform hover:translate-x-1 transition-transform">
          <span
            style={{ color: themeColors.textSecondary }}
            className="text-sm"
          >
            Today's Hours
          </span>
          <span style={{ color: themeColors.success }} className="font-medium">
            {todayHours}
          </span>
        </div>
      </div>
    </div>
  );

  // TaskOverview
  const TaskOverview = () => (
    <div
      className="rounded-lg p-5 border transform hover:scale-[1.02] transition-all duration-300"
      style={{
        backgroundColor: themeColors.cardBackground,
        borderColor: themeColors.borderDivider,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="p-2 rounded-lg transform hover:rotate-12 transition-transform"
          style={{ backgroundColor: themeColors.infoBg }}
        >
          <Target size={20} style={{ color: themeColors.info }} />
        </div>
        <span
          className="text-sm font-medium transform hover:scale-105 transition-transform"
          style={{ color: themeColors.info }}
        >
          Today
        </span>
      </div>
      <h3
        className="text-lg font-semibold mb-3"
        style={{ color: themeColors.textPrimary }}
      >
        Tasks
      </h3>
      <div className="flex items-end mb-2">
        <span
          className="text-2xl font-bold"
          style={{ color: themeColors.textPrimary }}
        >
          {tasks.filter((t) => t.completed).length}/{tasks.length}
        </span>
        <span
          className="text-sm ml-2 flex items-center transform hover:scale-105 transition-transform"
          style={{ color: themeColors.success }}
        >
          <TrendingUp size={14} className="mr-1" />
          {(
            (tasks.filter((t) => t.completed).length / tasks.length) *
            100
          ).toFixed(0)}
          %
        </span>
      </div>
      <div className="text-sm" style={{ color: themeColors.textSecondary }}>
        Completed
      </div>
    </div>
  );

  // LeaveBalanceSummary
  const LeaveBalanceSummary = () => (
    <div
      className="rounded-lg p-5 border transform hover:scale-[1.02] transition-all duration-300"
      style={{
        backgroundColor: themeColors.cardBackground,
        borderColor: themeColors.borderDivider,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="p-2 rounded-lg transform hover:rotate-12 transition-transform"
          style={{ backgroundColor: themeColors.warningBg }}
        >
          <Calendar size={20} style={{ color: themeColors.warning }} />
        </div>
        <span
          className="text-sm font-medium transform hover:scale-105 transition-transform"
          style={{ color: themeColors.warning }}
        >
          Balance
        </span>
      </div>
      <h3
        className="text-lg font-semibold mb-3"
        style={{ color: themeColors.textPrimary }}
      >
        Leave Balance
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between items-center transform hover:translate-x-1 transition-transform">
          <div className="flex items-center">
            <div
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: themeColors.success }}
            ></div>
            <span
              className="text-sm"
              style={{ color: themeColors.textSecondary }}
            >
              Casual
            </span>
          </div>
          <span
            className="font-bold"
            style={{ color: themeColors.textPrimary }}
          >
            {leaveBalance.casual} days
          </span>
        </div>
        <div className="flex justify-between items-center transform hover:translate-x-1 transition-transform">
          <div className="flex items-center">
            <div
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: themeColors.info }}
            ></div>
            <span
              className="text-sm"
              style={{ color: themeColors.textSecondary }}
            >
              Sick
            </span>
          </div>
          <span
            className="font-bold"
            style={{ color: themeColors.textPrimary }}
          >
            {leaveBalance.sick} days
          </span>
        </div>
        <div className="flex justify-between items-center transform hover:translate-x-1 transition-transform">
          <div className="flex items-center">
            <div
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: themeColors.primary }}
            ></div>
            <span
              className="text-sm"
              style={{ color: themeColors.textSecondary }}
            >
              Earned
            </span>
          </div>
          <span
            className="font-bold"
            style={{ color: themeColors.textPrimary }}
          >
            {leaveBalance.earned} days
          </span>
        </div>
      </div>
    </div>
  );

  // WorklogSection
  const WorklogSection = () => (
    <div
      className="rounded-lg p-5 border transform hover:scale-[1.02] transition-all duration-300"
      style={{
        backgroundColor: themeColors.cardBackground,
        borderColor: themeColors.borderDivider,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="p-2 rounded-lg transform hover:rotate-12 transition-transform"
          style={{ backgroundColor: themeColors.successBg }}
        >
          <Timer size={20} style={{ color: themeColors.success }} />
        </div>
        <span
          className="text-sm font-medium transform hover:scale-105 transition-transform"
          style={{ color: themeColors.success }}
        >
          This Week
        </span>
      </div>
      <h3
        className="text-lg font-semibold mb-3"
        style={{ color: themeColors.textPrimary }}
      >
        Working Hours
      </h3>
      <div className="flex items-end mb-3">
        <span
          className="text-2xl font-bold"
          style={{ color: themeColors.textPrimary }}
        >
          {analytics.weeklyHours}h
        </span>
        <span
          className="text-sm ml-2 flex items-center transform hover:scale-105 transition-transform"
          style={{ color: themeColors.success }}
        >
          <TrendingUp size={14} className="mr-1" /> +2.5h
        </span>
      </div>
      <div className="text-sm" style={{ color: themeColors.textSecondary }}>
        Total weekly hours
      </div>
    </div>
  );

  // AnalyticsGraphs - Only Task Completion Graph - Full width like DashboardHeader
  const AnalyticsGraphs = () => (
    <div
      className="rounded-lg border p-6 mb-6 transform hover:scale-[1.002] transition-all duration-300"
      style={{
        backgroundColor: themeColors.cardBackground,
        borderColor: themeColors.borderDivider,
      }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h3
            className="text-xl font-bold mb-2"
            style={{ color: themeColors.textPrimary }}
          >
            Task Completion Trend
          </h3>
          <p className="text-sm" style={{ color: themeColors.textSecondary }}>
            Weekly task completion overview for the last month
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <span
            className="text-xs px-2 py-1 rounded transform hover:scale-105 transition-transform"
            style={{
              backgroundColor: themeColors.infoBg,
              color: themeColors.info,
            }}
          >
            Last 4 Weeks
          </span>
          <span
            className="text-xs px-2 py-1 rounded transform hover:scale-105 transition-transform"
            style={{
              backgroundColor: themeColors.primaryLight,
              color: themeColors.primary,
            }}
          >
            {Math.round(
              taskCompletionData.reduce(
                (sum, item) => sum + (item.completed / item.total) * 100,
                0
              ) / taskCompletionData.length
            )}
            % Avg
          </span>
        </div>
      </div>

      <div className="h-64 flex items-end justify-between">
        {taskCompletionData.map((item, index) => {
          const percentage = (item.completed / item.total) * 100;
          const barHeight = `${percentage}%`;

          return (
            <div
              key={index}
              className="flex flex-col items-center flex-1 mx-2 relative group"
              onMouseEnter={() => setHoveredBar(index)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              {/* Hover Tooltip */}
              {hoveredBar === index && (
                <div
                  className="absolute -top-20 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-lg shadow-xl z-10 min-w-[140px] text-center transition-all duration-200 animate-in fade-in-0 zoom-in-95"
                  style={{
                    backgroundColor: themeColors.cardBackground,
                    border: `1px solid ${themeColors.borderDivider}`,
                    boxShadow: `0 10px 25px ${isDarkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"
                      }`,
                  }}
                >
                  <div
                    className="font-semibold text-sm mb-1"
                    style={{ color: themeColors.textPrimary }}
                  >
                    {item.week}
                  </div>
                  <div
                    className="text-xs mb-2"
                    style={{ color: themeColors.textSecondary }}
                  >
                    {item.completed} of {item.total} tasks completed
                  </div>
                  <div
                    className="text-sm font-bold"
                    style={{ color: themeColors.primary }}
                  >
                    {Math.round(percentage)}% Completion Rate
                  </div>
                  <div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3"
                    style={{
                      backgroundColor: themeColors.cardBackground,
                      borderRight: `1px solid ${themeColors.borderDivider}`,
                      borderBottom: `1px solid ${themeColors.borderDivider}`,
                    }}
                  />
                </div>
              )}

              <div className="mb-2">
                <div
                  className="text-xs font-medium"
                  style={{ color: themeColors.textSecondary }}
                >
                  {item.week}
                </div>
                <div
                  className="text-lg font-bold text-center"
                  style={{ color: themeColors.textPrimary }}
                >
                  {item.completed}
                </div>
              </div>

              {/* Bar container */}
              <div
                className="relative w-16 flex flex-col items-center"
                style={{ height: "180px" }}
              >
                {/* Background line */}
                <div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-full"
                  style={{ backgroundColor: themeColors.borderDivider }}
                />

                {/* Completion bar */}
                <div
                  className="w-10 rounded-t-lg transition-all duration-500 ease-out relative"
                  style={{
                    height: barHeight,
                    backgroundColor:
                      hoveredBar === index ? themeColors.primary : item.color,
                    boxShadow:
                      hoveredBar === index
                        ? `0 0 20px ${item.color}40`
                        : "none",
                    transform:
                      hoveredBar === index ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  {/* Animated glow effect on hover */}
                  {hoveredBar === index && (
                    <div
                      className="absolute inset-0 rounded-t-lg opacity-30 animate-pulse"
                      style={{ backgroundColor: themeColors.primary }}
                    />
                  )}
                </div>

                {/* Percentage indicator */}
                <div
                  className="absolute -right-8 transform -translate-y-1/2 text-xs font-bold px-1.5 py-0.5 rounded transition-all duration-300"
                  style={{
                    backgroundColor: themeColors.cardBackground,
                    border: `1px solid ${themeColors.borderDivider}`,
                    color: themeColors.textPrimary,
                    top: `calc(100% - ${percentage}% + 10px)`,
                    transform: `translateY(-50%) ${hoveredBar === index ? "scale(1.1)" : "scale(1)"
                      }`,
                  }}
                >
                  {Math.round(percentage)}%
                </div>
              </div>

              <div className="mt-2 text-center">
                <div
                  className="text-xs"
                  style={{ color: themeColors.textSecondary }}
                >
                  of {item.total}
                </div>
                <div
                  className={`text-xs font-medium mt-1 px-2 py-0.5 rounded-full transform hover:scale-105 transition-transform ${percentage >= 80
                    ? "text-green-600"
                    : percentage >= 60
                      ? "text-yellow-600"
                      : "text-red-600"
                    }`}
                >
                  {percentage >= 80
                    ? "Excellent"
                    : percentage >= 60
                      ? "Good"
                      : "Needs Improvement"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive legend */}
      <div className="flex flex-wrap justify-center items-center mt-8 space-x-4">
        {taskCompletionData.map((item, index) => (
          <button
            key={index}
            className={`flex items-center px-3 py-1.5 rounded-lg transition-all ${hoveredBar === index ? "scale-105" : ""
              }`}
            style={{
              backgroundColor:
                hoveredBar === index ? themeColors.cardHover : "transparent",
              border: `1px solid ${hoveredBar === index
                ? themeColors.primary
                : themeColors.borderDivider
                }`,
            }}
            onMouseEnter={() => setHoveredBar(index)}
            onMouseLeave={() => setHoveredBar(null)}
            onClick={() => setHoveredBar(hoveredBar === index ? null : index)}
          >
            <div
              className="w-3 h-3 rounded mr-2 transition-all"
              style={{
                backgroundColor:
                  hoveredBar === index ? themeColors.primary : item.color,
                transform: hoveredBar === index ? "scale(1.2)" : "scale(1)",
              }}
            ></div>
            <span
              className="text-xs font-medium"
              style={{ color: themeColors.textPrimary }}
            >
              {item.week}
            </span>
            <span
              className="text-xs ml-2"
              style={{ color: themeColors.textSecondary }}
            >
              ({item.completed}/{item.total})
            </span>
          </button>
        ))}
      </div>

      {/* Summary stats */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6"
        style={{ borderTop: `1px solid ${themeColors.borderDivider}` }}
      >
        <div className="text-center transform hover:scale-105 transition-transform">
          <div
            className="text-2xl font-bold"
            style={{ color: themeColors.success }}
          >
            {taskCompletionData.reduce((sum, item) => sum + item.completed, 0)}
          </div>
          <div className="text-sm" style={{ color: themeColors.textSecondary }}>
            Total Completed Tasks
          </div>
        </div>
        <div className="text-center transform hover:scale-105 transition-transform">
          <div
            className="text-2xl font-bold"
            style={{ color: themeColors.primary }}
          >
            {taskCompletionData.reduce((sum, item) => sum + item.total, 0)}
          </div>
          <div className="text-sm" style={{ color: themeColors.textSecondary }}>
            Total Assigned Tasks
          </div>
        </div>
        <div className="text-center transform hover:scale-105 transition-transform">
          <div
            className="text-2xl font-bold"
            style={{ color: themeColors.info }}
          >
            {Math.round(
              taskCompletionData.length > 0
                ? taskCompletionData.reduce(
                  (sum, item) => sum + (item.total > 0 ? (item.completed / item.total) * 100 : 0),
                  0
                ) / taskCompletionData.length
                : 0
            )}
            %
          </div>
          <div className="text-sm" style={{ color: themeColors.textSecondary }}>
            Average Completion Rate
          </div>
        </div>
      </div>
    </div>
  );

  // Today's Summary Component
  const TodaysSummary = () => {
    // Parse todayHours (e.g., "8h 30m") to calculate overtime
    let overtimeStr = "0m";
    if (todayHours) {
      const parts = todayHours.split(' ');
      let totalMins = 0;
      parts.forEach(p => {
        if (p.includes('h')) totalMins += parseInt(p) * 60;
        if (p.includes('m')) totalMins += parseInt(p);
      });

      const standardDay = 8 * 60;
      if (totalMins > standardDay) {
        const overtimeMins = totalMins - standardDay;
        const otHrs = Math.floor(overtimeMins / 60);
        const otMins = overtimeMins % 60;
        overtimeStr = otHrs > 0 ? `+${otHrs}h ${otMins}m` : `+${otMins}m`;
      }
    }

    const summaryItems = [
      {
        label: "Work Duration",
        value: todayHours || "0h 0m",
        color: themeColors.textPrimary,
        icon: Clock,
      },
      {
        label: "Overtime",
        value: overtimeStr,
        color: themeColors.success,
        icon: TrendingUp,
      },
      {
        label: "Break Time",
        value: "1h 0m", // Placeholder
        color: themeColors.warning,
        icon: Coffee,
      },
      {
        label: "Productivity",
        value: `${analytics.productivity || 0}%`,
        color: themeColors.info,
        icon: Zap,
      },
    ];

    return (
      <div
        className="rounded-lg p-6 border transform hover:scale-[1.002] transition-all duration-300"
        style={{
          backgroundColor: themeColors.cardBackground,
          borderColor: themeColors.borderDivider,
        }}
      >
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: themeColors.textPrimary }}
        >
          Today's Summary
        </h3>
        <div className="space-y-3">
          {summaryItems.map((item, index) => (
            <div
              key={index}
              className="p-3 rounded-lg hover:scale-[1.02] transition-transform group flex items-center justify-between"
              style={{ backgroundColor: themeColors.cardHover }}
            >
              <div className="flex items-center">
                <item.icon
                  size={16}
                  className="mr-2"
                  style={{ color: item.color }}
                />
                <span
                  className="text-sm"
                  style={{ color: themeColors.textSecondary }}
                >
                  {item.label}
                </span>
              </div>
              <span
                className="font-medium flex items-center"
                style={{ color: item.color }}
              >
                {item.value}
                <ChevronRight
                  size={12}
                  className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Payslips Section
  const renderPayslips = () => (
    <div
      className="rounded-lg p-6 border mb-6"
      style={{
        backgroundColor: themeColors.cardBackground,
        borderColor: themeColors.borderDivider,
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: themeColors.textPrimary }}
        >
          My Payslips
        </h1>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium" style={{ color: themeColors.textSecondary }}>Year:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{
              backgroundColor: themeColors.appBackground,
              color: themeColors.textPrimary,
              borderColor: themeColors.borderDivider
            }}
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredPayslips.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredPayslips.map((payslip) => (
            <div
              key={payslip.id}
              className="p-5 rounded-lg border hover:shadow-md transition-all duration-300"
              style={{
                backgroundColor: themeColors.cardHover, // Using cardHover for slight differentiation or cardBackground
                borderColor: themeColors.borderDivider,
              }}
            >
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div
                    className="p-3 rounded-full"
                    style={{ backgroundColor: themeColors.primaryLight }}
                  >
                    <FileSpreadsheet
                      size={24}
                      style={{ color: themeColors.primary }}
                    />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-bold"
                      style={{ color: themeColors.textPrimary }}
                    >
                      {payslip.month}/{payslip.year}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:space-x-4 text-sm mt-1" style={{ color: themeColors.textSecondary }}>
                      <span>Working Days: {payslip.workingDays}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>Present: {payslip.presentDays}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>Unpaid Leave: {payslip.unpaidLeaves}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end min-w-[150px]">
                  <span className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: themeColors.textSecondary }}>Net Salary</span>
                  <span className="text-xl font-bold" style={{ color: themeColors.success }}>₹{parseFloat(payslip.netSalary).toLocaleString('en-IN')}</span>
                  {parseFloat(payslip.deduction) > 0 && (
                    <span className="text-xs text-red-500 mt-1">Deduction: -₹{parseFloat(payslip.deduction).toLocaleString('en-IN')}</span>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setViewPayslip(payslip)}
                    className="p-2 rounded-full hover:bg-opacity-20 transition-colors"
                    style={{ backgroundColor: themeColors.primaryLight }}
                    title="View Details"
                  >
                    <Eye size={18} style={{ color: themeColors.primary }} />
                  </button>
                  <button
                    onClick={() => toast.success("Downloading payslip...")}
                    className="p-2 rounded-full hover:bg-opacity-20 transition-colors"
                    style={{ backgroundColor: themeColors.primaryLight }}
                    title="Download PDF"
                  >
                    <Download size={18} style={{ color: themeColors.primary }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="p-4 rounded-full mb-4" style={{ backgroundColor: themeColors.cardHover }}>
            <FileSpreadsheet size={48} style={{ color: themeColors.textMuted }} />
          </div>
          <h3 className="text-lg font-medium mb-2" style={{ color: themeColors.textSecondary }}>
            No Payslips Found
          </h3>
          <p className="max-w-md" style={{ color: themeColors.textMuted }}>
            Your payslips will appear here once they are generated by the finance department.
          </p>
        </div>
      )}

      {/* View Payslip Modal */}
      {viewPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
              <h2 className="text-xl font-bold dark:text-white">Payslip Details</h2>
              <button onClick={() => setViewPayslip(null)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Employee</p>
                  <p className="font-semibold dark:text-gray-200">{userData.fullName}</p>
                  <p className="text-sm text-gray-500">{userData.employeeCode}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Period</p>
                  <p className="font-semibold dark:text-gray-200">{viewPayslip.month}/{viewPayslip.year}</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Basic Salary</span>
                  <span className="font-medium dark:text-white">₹{parseFloat(viewPayslip.basicSalary).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Attendance</span>
                  <span>{viewPayslip.presentDays} / {viewPayslip.workingDays} Days</span>
                </div>
                <div className="flex justify-between text-red-500">
                  <span>Deductions (Unpaid Leaves: {viewPayslip.unpaidLeaves})</span>
                  <span>-₹{parseFloat(viewPayslip.deduction).toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-3 flex justify-between items-center">
                  <span className="font-bold text-lg dark:text-white">Net Salary</span>
                  <span className="font-bold text-xl text-green-600 dark:text-green-400">₹{parseFloat(viewPayslip.netSalary).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                <FileText size={18} /> Print
              </button>
              <button
                onClick={() => setViewPayslip(null)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Personal Documents Section
  const renderPersonalDocuments = () => (
    <div
      className="rounded-lg p-6 border mb-6"
      style={{
        backgroundColor: themeColors.cardBackground,
        borderColor: themeColors.borderDivider,
      }}
    >
      <h1
        className="text-2xl font-bold mb-6"
        style={{ color: themeColors.textPrimary }}
      >
        Personal Documents
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-transparent focus:ring-2 focus:ring-opacity-50 outline-none transition-all"
            style={{
              borderColor: themeColors.borderDivider,
              color: themeColors.textPrimary,
              '--tw-ring-color': themeColors.primary
            }}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {['all', 'identification', 'education', 'contract', 'other'].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === category
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              style={selectedCategory === category ? { backgroundColor: themeColors.primary } : {}}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredDocuments.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border overflow-hidden" style={{ borderColor: themeColors.borderDivider, backgroundColor: themeColors.cardBackground }}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b" style={{ borderColor: themeColors.borderDivider }}>
                <th className="p-4 font-semibold text-sm" style={{ color: themeColors.textSecondary }}>Document Name</th>
                <th className="p-4 font-semibold text-sm hidden md:table-cell" style={{ color: themeColors.textSecondary }}>Category</th>
                <th className="p-4 font-semibold text-sm hidden md:table-cell" style={{ color: themeColors.textSecondary }}>Upload Date</th>
                <th className="p-4 font-semibold text-sm hidden sm:table-cell" style={{ color: themeColors.textSecondary }}>Size</th>
                <th className="p-4 font-semibold text-sm text-right" style={{ color: themeColors.textSecondary }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors" style={{ borderColor: themeColors.borderDivider }}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: themeColors.textPrimary }}>{doc.name}</p>
                        <p className="text-xs md:hidden" style={{ color: themeColors.textSecondary }}>{doc.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      {doc.category}
                    </span>
                  </td>
                  <td className="p-4 text-sm hidden md:table-cell" style={{ color: themeColors.textPrimary }}>
                    {new Date(doc.uploadDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-sm hidden sm:table-cell" style={{ color: themeColors.textSecondary }}>
                    {doc.size || "2.5 MB"}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="View"
                      >
                        <Eye size={18} style={{ color: themeColors.info }} />
                      </button>
                      <button
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Download"
                      >
                        <Download size={18} style={{ color: themeColors.success }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="p-4 rounded-full mb-4" style={{ backgroundColor: themeColors.cardHover }}>
            <FileText size={48} style={{ color: themeColors.textMuted }} />
          </div>
          <h3 className="text-lg font-medium mb-2" style={{ color: themeColors.textSecondary }}>
            No Documents Found
          </h3>
          <p className="max-w-md" style={{ color: themeColors.textMuted }}>
            {searchQuery ? `No documents matching "${searchQuery}"` : "You haven't uploaded any documents yet."}
          </p>
        </div>
      )}
    </div>
  );



  // Today's Tasks Section
  const TodaysTasksSection = () => (
    <div
      className="rounded-xl border transition-shadow hover:shadow-sm"
      style={{
        backgroundColor: themeColors.cardBackground,
        borderColor: themeColors.borderDivider,
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 border-b flex items-center justify-between"
        style={{ borderColor: themeColors.borderDivider }}
      >
        <h3
          className="text-lg font-semibold tracking-tight"
          style={{ color: themeColors.textPrimary }}
        >
          Today’s Tasks
        </h3>

        <button
          onClick={() => setShowNewTaskModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium shadow-sm transition hover:shadow"
          style={{
            backgroundColor: themeColors.primary,
            color: "#FFFFFF",
          }}
        >
          <Plus size={16} />
          New Task
        </button>
      </div>

      {/* Task List */}
      <div className="p-5 space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => handleTaskComplete(task.id)}
            onMouseEnter={() => setHoveredItem(task.id)}
            onMouseLeave={() => setHoveredItem(null)}
            className="flex gap-3 p-4 rounded-lg border cursor-pointer transition hover:shadow-sm"
            style={{
              backgroundColor: themeColors.cardHover,
              borderColor: themeColors.borderDivider,
            }}
          >
            {/* Checkbox */}
            <div className="mt-0.5 flex-shrink-0">
              {task.completed ? (
                <CheckSquare size={20} style={{ color: themeColors.success }} />
              ) : (
                <Square size={20} style={{ color: themeColors.textMuted }} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <h4
                    className={`text-sm font-medium ${task.completed ? "line-through" : ""
                      }`}
                    style={{
                      color: task.completed
                        ? themeColors.textMuted
                        : themeColors.textPrimary,
                    }}
                  >
                    {task.title}
                  </h4>

                  <p
                    className="mt-1 text-sm leading-relaxed"
                    style={{ color: themeColors.textSecondary }}
                  >
                    {task.description}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        backgroundColor:
                          task.project === "Alpha"
                            ? themeColors.primaryLight
                            : task.project === "Beta"
                              ? themeColors.infoBg
                              : themeColors.warningBg,
                        color:
                          task.project === "Alpha"
                            ? themeColors.primary
                            : task.project === "Beta"
                              ? themeColors.info
                              : themeColors.warning,
                      }}
                    >
                      {task.project}
                    </span>

                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium capitalize"
                      style={{
                        backgroundColor:
                          task.priority === "high"
                            ? themeColors.dangerBg
                            : task.priority === "medium"
                              ? themeColors.warningBg
                              : themeColors.successBg,
                        color:
                          task.priority === "high"
                            ? themeColors.danger
                            : task.priority === "medium"
                              ? themeColors.warning
                              : themeColors.success,
                      }}
                    >
                      {task.priority}
                    </span>

                    <span
                      className="text-xs"
                      style={{ color: themeColors.textMuted }}
                    >
                      {task.time}
                    </span>
                  </div>
                </div>

                {/* Hover Icon */}
                {hoveredItem === task.id && (
                  <ChevronRight
                    size={16}
                    style={{ color: themeColors.textMuted }}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );


  // Enhanced Calendar Section with Interactive Date Details
  const CalendarSection = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const attendance = getAttendanceStatus(selectedDate);
    const holiday = getHoliday(selectedDate);
    const StatusIcon = getStatusIcon(attendance.status);
    const statusColors = getStatusColor(attendance.status);

    return (
      <div className="space-y-4">
        <div
          className="rounded-lg border p-4 transform hover:scale-[1.002] transition-all duration-300"
          style={{
            backgroundColor: themeColors.cardBackground,
            borderColor: themeColors.borderDivider,
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              className="font-semibold"
              style={{ color: themeColors.textPrimary }}
            >
              {currentMonth.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => changeMonth("prev")}
                className="p-1.5 rounded-lg hover:scale-110 transition-transform"
                style={{
                  backgroundColor: themeColors.cardHover,
                  color: themeColors.textPrimary,
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  setCurrentMonth(today);
                  setSelectedDate(today);
                }}
                className="text-xs px-2.5 py-1.5 rounded-lg hover:scale-110 transition-transform"
                style={{
                  backgroundColor: themeColors.primaryLight,
                  color: themeColors.primary,
                }}
              >
                Today
              </button>
              <button
                onClick={() => changeMonth("next")}
                className="p-1.5 rounded-lg hover:scale-110 transition-transform"
                style={{
                  backgroundColor: themeColors.cardHover,
                  color: themeColors.textPrimary,
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium py-1"
                style={{ color: themeColors.textSecondary }}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {daysInMonth.slice(0, 42).map((day, index) => {
              const dayAttendance = getAttendanceStatus(day.date);
              const dayHoliday = getHoliday(day.date);
              const isToday =
                day.date.toDateString() === new Date().toDateString();
              const isSelected =
                selectedDate.toDateString() === day.date.toDateString();
              const isWeekend =
                day.date.getDay() === 0 || day.date.getDay() === 6;

              let dateColor = themeColors.textPrimary;
              let bgColor = "transparent";
              let borderColor = "transparent";

              if (!day.isCurrentMonth) {
                dateColor = themeColors.textMuted;
                bgColor = themeColors.appBackground;
              } else if (dayHoliday) {
                dateColor = "#6366F1";
                bgColor = isSelected ? "#4F46E5" : "#E0E7FF";
              } else if (isWeekend) {
                dateColor = themeColors.warning;
              }

              if (isSelected) {
                bgColor = themeColors.primary;
                dateColor = "#FFFFFF";
                borderColor = themeColors.primary;
              } else if (isToday) {
                bgColor = themeColors.primaryLight;
                borderColor = themeColors.primary;
              }

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(day.date)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                  className={`
                    aspect-square p-1 rounded-lg flex flex-col items-center justify-center text-sm
                    transition-all duration-200 relative overflow-hidden
                    ${!day.isCurrentMonth ? "opacity-60" : ""}
                    hover:z-10 hover:shadow-xl
                  `}
                  style={{
                    color: dateColor,
                    backgroundColor: bgColor,
                    border: `2px solid ${borderColor}`,
                    transform: "scale(1)",
                  }}
                  title={`${day.date.toLocaleDateString()} - ${dayAttendance.status === "not-marked"
                    ? "Not marked"
                    : dayAttendance.status
                    }`}
                >
                  {/* Background effect for attendance status */}
                  {day.isCurrentMonth &&
                    !isSelected &&
                    !isToday &&
                    dayAttendance.status !== "not-marked" &&
                    dayAttendance.status !== "weekend" && (
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundColor: statusColors.text,
                        }}
                      />
                    )}

                  {/* Holiday indicator */}
                  {dayHoliday && (
                    <div
                      className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                      style={{ backgroundColor: "#6366F1" }}
                    />
                  )}

                  <div
                    className={`font-medium relative z-10 ${isSelected ? "text-white" : ""
                      }`}
                  >
                    {day.date.getDate()}
                  </div>

                  {day.isCurrentMonth &&
                    !isSelected &&
                    !isToday &&
                    dayAttendance.status !== "not-marked" &&
                    dayAttendance.status !== "weekend" && (
                      <div
                        className="w-2 h-2 rounded-full mt-0.5 z-10 transition-transform duration-200 hover:scale-150"
                        style={{
                          backgroundColor: statusColors.text,
                        }}
                      />
                    )}

                  {/* Today indicator */}
                  {isToday && !isSelected && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-red-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details Panel */}
        {showDateDetails && (
          <div
            className="rounded-lg border p-4 animate-in slide-in-from-bottom-5 duration-300"
            style={{
              backgroundColor: themeColors.cardBackground,
              borderColor: themeColors.borderDivider,
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <div
                  className="text-xs"
                  style={{ color: themeColors.textSecondary }}
                >
                  Selected Date
                </div>
                <div
                  className="text-lg font-bold flex items-center"
                  style={{ color: themeColors.textPrimary }}
                >
                  <CalendarIcon className="mr-2" size={18} />
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
              <button
                onClick={() => setShowDateDetails(false)}
                className="p-1.5 rounded-lg hover:scale-110 transition-transform"
                style={{ color: themeColors.textMuted }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Holiday Banner */}
            {holiday && (
              <div
                className="mb-4 p-3 rounded-lg flex items-center animate-in fade-in-0 zoom-in-95"
                style={{
                  backgroundColor: "#E0E7FF",
                  border: "1px solid #6366F1",
                }}
              >
                <Umbrella
                  className="mr-2"
                  size={18}
                  style={{ color: "#6366F1" }}
                />
                <div>
                  <div
                    className="font-medium text-sm"
                    style={{ color: "#6366F1" }}
                  >
                    Public Holiday
                  </div>
                  <div className="text-xs" style={{ color: "#6366F1" }}>
                    {holiday}
                  </div>
                </div>
              </div>
            )}

            {/* Attendance Status Card */}
            <div
              className="mb-4 p-3 rounded-lg transform hover:scale-[1.02] transition-all duration-300"
              style={{
                backgroundColor: statusColors.bg,
                border: `1px solid ${statusColors.text}20`,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <StatusIcon
                    className="mr-2"
                    size={20}
                    style={{ color: statusColors.text }}
                  />
                  <div>
                    <div
                      className="font-bold text-sm"
                      style={{ color: statusColors.text }}
                    >
                      {attendance.status === "work-from-home"
                        ? "Work From Home"
                        : attendance.status === "half-day"
                          ? "Half Day"
                          : attendance.status.charAt(0).toUpperCase() +
                          attendance.status.slice(1)}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: statusColors.text }}
                    >
                      {attendance.notes}
                    </div>
                  </div>
                </div>
                {attendance.hours > 0 && (
                  <div className="text-right">
                    <div
                      className="text-lg font-bold"
                      style={{ color: statusColors.text }}
                    >
                      {attendance.hours}h
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: statusColors.text }}
                    >
                      Total Hours
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mark In/Out Details */}
            {(attendance.status === "present" ||
              attendance.status === "late" ||
              attendance.status === "work-from-home" ||
              attendance.status === "half-day") && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className="p-3 rounded-lg transform hover:scale-105 transition-all duration-300 group"
                      style={{
                        backgroundColor: themeColors.cardHover,
                        border: `1px solid ${themeColors.borderDivider}`,
                      }}
                    >
                      <div className="flex items-center mb-1">
                        <ClockIcon
                          className="mr-2"
                          size={16}
                          style={{ color: themeColors.success }}
                        />
                        <span
                          className="text-xs"
                          style={{ color: themeColors.textSecondary }}
                        >
                          Mark In
                        </span>
                      </div>
                      <div
                        className="text-lg font-bold flex items-center"
                        style={{ color: themeColors.textPrimary }}
                      >
                        {attendance.markIn}
                        <ChevronRight
                          className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          size={14}
                        />
                      </div>
                    </div>

                    <div
                      className="p-3 rounded-lg transform hover:scale-105 transition-all duration-300 group"
                      style={{
                        backgroundColor: themeColors.cardHover,
                        border: `1px solid ${themeColors.borderDivider}`,
                      }}
                    >
                      <div className="flex items-center mb-1">
                        <LogOutIcon
                          className="mr-2"
                          size={16}
                          style={{ color: themeColors.danger }}
                        />
                        <span
                          className="text-xs"
                          style={{ color: themeColors.textSecondary }}
                        >
                          Mark Out
                        </span>
                      </div>
                      <div
                        className="text-lg font-bold flex items-center"
                        style={{ color: themeColors.textPrimary }}
                      >
                        {attendance.markOut}
                        <ChevronRight
                          className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          size={14}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="grid grid-cols-3 gap-2">
                    <div
                      className="p-2 rounded-lg text-center transform hover:scale-105 transition-all duration-300"
                      style={{
                        backgroundColor: themeColors.cardHover,
                        border: `1px solid ${themeColors.borderDivider}`,
                      }}
                    >
                      <div
                        className="text-xs"
                        style={{ color: themeColors.textSecondary }}
                      >
                        Breaks
                      </div>
                      <div
                        className="font-medium text-sm"
                        style={{ color: themeColors.textPrimary }}
                      >
                        {attendance.breaks}
                      </div>
                    </div>

                    <div
                      className="p-2 rounded-lg text-center transform hover:scale-105 transition-all duration-300"
                      style={{
                        backgroundColor: themeColors.cardHover,
                        border: `1px solid ${themeColors.borderDivider}`,
                      }}
                    >
                      <div
                        className="text-xs"
                        style={{ color: themeColors.textSecondary }}
                      >
                        Overtime
                      </div>
                      <div
                        className="font-medium text-sm"
                        style={{ color: themeColors.success }}
                      >
                        {attendance.overtime}
                      </div>
                    </div>

                    <div
                      className="p-2 rounded-lg text-center transform hover:scale-105 transition-all duration-300"
                      style={{
                        backgroundColor: themeColors.cardHover,
                        border: `1px solid ${themeColors.borderDivider}`,
                      }}
                    >
                      <div
                        className="text-xs"
                        style={{ color: themeColors.textSecondary }}
                      >
                        Productivity
                      </div>
                      <div
                        className="font-medium text-sm"
                        style={{ color: themeColors.info }}
                      >
                        {attendance.productivity}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* Action Buttons for Today */}
            {selectedDate.toDateString() === new Date().toDateString() && (
              <div
                className="mt-4 pt-4 border-t"
                style={{ borderColor: themeColors.borderDivider }}
              >
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleClockIn}
                    disabled={isClockedIn}
                    className="p-2 rounded-lg flex items-center justify-center transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
                    style={{
                      backgroundColor: themeColors.successBg,
                      color: themeColors.success,
                    }}
                  >
                    <ClockIcon className="mr-2" size={16} />
                    Mark In
                  </button>
                  <button
                    onClick={handleClockOut}
                    disabled={!isClockedIn}
                    className="p-2 rounded-lg flex items-center justify-center transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
                    style={{
                      backgroundColor: themeColors.dangerBg,
                      color: themeColors.danger,
                    }}
                  >
                    <LogOutIcon className="mr-2" size={16} />
                    Mark Out
                  </button>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div
              className="mt-4 pt-4 border-t"
              style={{ borderColor: themeColors.borderDivider }}
            >
              <div
                className="text-xs mb-2"
                style={{ color: themeColors.textSecondary }}
              >
                Month Summary
              </div>
              <div className="flex items-center justify-between">
                <div className="text-center transform hover:scale-110 transition-transform">
                  <div
                    className="text-lg font-bold"
                    style={{ color: themeColors.success }}
                  >
                    18
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: themeColors.textSecondary }}
                  >
                    Present
                  </div>
                </div>
                <div className="text-center transform hover:scale-110 transition-transform">
                  <div
                    className="text-lg font-bold"
                    style={{ color: themeColors.warning }}
                  >
                    1
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: themeColors.textSecondary }}
                  >
                    Late
                  </div>
                </div>
                <div className="text-center transform hover:scale-110 transition-transform">
                  <div
                    className="text-lg font-bold"
                    style={{ color: themeColors.danger }}
                  >
                    1
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: themeColors.textSecondary }}
                  >
                    Absent
                  </div>
                </div>
                <div className="text-center transform hover:scale-110 transition-transform">
                  <div
                    className="text-lg font-bold"
                    style={{ color: themeColors.info }}
                  >
                    3
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: themeColors.textSecondary }}
                  >
                    WFH
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Quick Actions Section
  const QuickActionsSection = () => (
    <div
      className="rounded-lg border p-5 transform hover:scale-[1.002] transition-all duration-300"
      style={{
        backgroundColor: themeColors.cardBackground,
        borderColor: themeColors.borderDivider,
      }}
    >
      <h3
        className="text-lg font-semibold mb-4"
        style={{ color: themeColors.textPrimary }}
      >
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setActiveSection("attendance")}
          className="p-3 rounded-lg flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-lg group"
          style={{
            backgroundColor: themeColors.cardHover,
            border: `1px solid ${themeColors.borderDivider}`,
          }}
        >
          <div
            className="p-2 rounded-lg mb-2 transform group-hover:rotate-12 transition-transform"
            style={{ backgroundColor: themeColors.primaryLight }}
          >
            <Clock size={20} style={{ color: themeColors.primary }} />
          </div>
          <span
            className="text-sm font-medium"
            style={{ color: themeColors.textPrimary }}
          >
            Attendance
          </span>
        </button>
        <button
          onClick={() => setShowWorklogModal(true)}
          className="p-3 rounded-lg flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-lg group"
          style={{
            backgroundColor: themeColors.cardHover,
            border: `1px solid ${themeColors.borderDivider}`,
          }}
        >
          <div
            className="p-2 rounded-lg mb-2 transform group-hover:rotate-12 transition-transform"
            style={{ backgroundColor: themeColors.infoBg }}
          >
            <FileText size={20} style={{ color: themeColors.info }} />
          </div>
          <span
            className="text-sm font-medium"
            style={{ color: themeColors.textPrimary }}
          >
            Worklog
          </span>
        </button>
        <button
          onClick={() => setShowLeaveModal(true)}
          className="p-3 rounded-lg flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-lg group"
          style={{
            backgroundColor: themeColors.cardHover,
            border: `1px solid ${themeColors.borderDivider}`,
          }}
        >
          <div
            className="p-2 rounded-lg mb-2 transform group-hover:rotate-12 transition-transform"
            style={{ backgroundColor: themeColors.warningBg }}
          >
            <Calendar size={20} style={{ color: themeColors.warning }} />
          </div>
          <span
            className="text-sm font-medium"
            style={{ color: themeColors.textPrimary }}
          >
            Leave
          </span>
        </button>
        <button
          onClick={() => setActiveSection("payslips")}
          className="p-3 rounded-lg flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-lg group"
          style={{
            backgroundColor: themeColors.cardHover,
            border: `1px solid ${themeColors.borderDivider}`,
          }}
        >
          <div
            className="p-2 rounded-lg mb-2 transform group-hover:rotate-12 transition-transform"
            style={{ backgroundColor: themeColors.successBg }}
          >
            <Receipt size={20} style={{ color: themeColors.success }} />
          </div>
          <span
            className="text-sm font-medium"
            style={{ color: themeColors.textPrimary }}
          >
            Payslip
          </span>
        </button>
      </div>
    </div>
  );

  // Dashboard Section
  const renderDashboard = () => (
    <div className="space-y-6">
      <DashboardHeader />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AttendanceSummary />
        <TaskOverview />
        <LeaveBalanceSummary />
        <WorklogSection />
      </div>

      {/* Full width Task Completion Graph */}
      <AnalyticsGraphs />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TodaysTasksSection />
        </div>
        <div className="space-y-6">
          <CalendarSection />
          <QuickActionsSection />
        </div>
      </div>
    </div>
  );

  // Attendance Section
  const renderAttendance = () => (
    <div className="space-y-6">
      <div
        className="rounded-lg p-6 border transform hover:scale-[1.002] transition-all duration-300"
        style={{
          backgroundColor: themeColors.cardBackground,
          borderColor: themeColors.borderDivider,
        }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: themeColors.textPrimary }}
            >
              Attendance
            </h1>
            <p style={{ color: themeColors.textSecondary }}>
              Mark your daily attendance and track history
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-center">
            <div
              className="text-sm"
              style={{ color: themeColors.textSecondary }}
            >
              Today's Date
            </div>
            <div
              className="text-lg font-bold"
              style={{ color: themeColors.textPrimary }}
            >
              {currentTime.toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          className="lg:col-span-2 rounded-lg p-6 border transform hover:scale-[1.002] transition-all duration-300"
          style={{
            backgroundColor: themeColors.cardBackground,
            borderColor: themeColors.borderDivider,
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: themeColors.textPrimary }}
          >
            Mark Attendance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleClockIn}
              disabled={isClockedIn || (clockInTime && clockInTime !== '--:--')}
              className="p-5 rounded-lg flex flex-col items-center justify-center transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group"
              style={{
                backgroundColor: isClockedIn
                  ? themeColors.cardHover
                  : themeColors.successBg,
                border: `1px solid ${isClockedIn ? themeColors.borderDivider : themeColors.success
                  }`,
              }}
            >
              <CheckCircle
                className="mb-3 transform group-hover:scale-110 transition-transform"
                size={32}
                style={{
                  color: isClockedIn
                    ? themeColors.textMuted
                    : themeColors.success,
                }}
              />
              <span
                className="text-lg font-semibold mb-1"
                style={{
                  color: isClockedIn
                    ? themeColors.textMuted
                    : themeColors.textPrimary,
                }}
              >
                Mark In
              </span>
              <span
                className="text-sm"
                style={{ color: themeColors.textSecondary }}
              >
                Start your work day
              </span>
            </button>

            <button
              onClick={handleClockOut}
              disabled={!isClockedIn}
              className="p-5 rounded-lg flex flex-col items-center justify-center transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group"
              style={{
                backgroundColor: !isClockedIn
                  ? themeColors.cardHover
                  : themeColors.dangerBg,
                border: `1px solid ${!isClockedIn ? themeColors.borderDivider : themeColors.danger
                  }`,
              }}
            >
              <LogOut
                className="mb-3 transform group-hover:scale-110 transition-transform"
                size={32}
                style={{
                  color: !isClockedIn
                    ? themeColors.textMuted
                    : themeColors.danger,
                }}
              />
              <span
                className="text-lg font-semibold mb-1"
                style={{
                  color: !isClockedIn
                    ? themeColors.textMuted
                    : themeColors.textPrimary,
                }}
              >
                Mark Out
              </span>
              <span
                className="text-sm"
                style={{ color: themeColors.textSecondary }}
              >
                End your work day
              </span>
            </button>
          </div>
        </div>

        {/* Today's Summary */}
        <TodaysSummary />
      </div>
    </div>
  );

  // Worklogs Section
  const renderWorklogs = () => (
    <div className="space-y-6">
      <div
        className="rounded-lg p-6 border transform hover:scale-[1.002] transition-all duration-300"
        style={{
          backgroundColor: themeColors.cardBackground,
          borderColor: themeColors.borderDivider,
        }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: themeColors.textPrimary }}
            >
              Worklogs
            </h1>
            <p style={{ color: themeColors.textSecondary }}>
              Submit daily worklogs and track your tasks
            </p>
          </div>
          <button
            onClick={() => setShowWorklogModal(true)}
            className="mt-4 md:mt-0 px-4 py-2 rounded font-semibold flex items-center text-sm hover:scale-105 transition-transform"
            style={{ backgroundColor: themeColors.primary, color: "#FFFFFF" }}
          >
            <Plus className="mr-2" size={16} />
            New Worklog
          </button>
        </div>
      </div>

      {/* Worklogs Table */}
      <div
        className="rounded-lg border transform hover:scale-[1.002] transition-all duration-300"
        style={{
          backgroundColor: themeColors.cardBackground,
          borderColor: themeColors.borderDivider,
        }}
      >
        <div
          className="p-5 border-b"
          style={{ borderColor: themeColors.borderDivider }}
        >
          <h3
            className="text-lg font-semibold"
            style={{ color: themeColors.textPrimary }}
          >
            Recent Worklogs
          </h3>
        </div>
        <div className="p-5">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className="border-b"
                  style={{ borderColor: themeColors.borderDivider }}
                >
                  <th
                    className="text-left py-2 font-medium text-sm"
                    style={{ color: themeColors.textSecondary }}
                  >
                    Task
                  </th>
                  <th
                    className="text-left py-2 font-medium text-sm"
                    style={{ color: themeColors.textSecondary }}
                  >
                    Project
                  </th>
                  <th
                    className="text-left py-2 font-medium text-sm"
                    style={{ color: themeColors.textSecondary }}
                  >
                    Time
                  </th>
                  <th
                    className="text-left py-2 font-medium text-sm"
                    style={{ color: themeColors.textSecondary }}
                  >
                    Date
                  </th>
                  <th
                    className="text-left py-2 font-medium text-sm"
                    style={{ color: themeColors.textSecondary }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {worklogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b hover:bg-opacity-50 transition-all duration-300 group"
                    style={{
                      borderColor: themeColors.borderDivider,
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      themeColors.cardHover)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <td className="py-3">
                      <div className="flex items-center">
                        <div className="min-w-0">
                          <div
                            className="font-medium text-sm"
                            style={{ color: themeColors.textPrimary }}
                          >
                            {log.task}
                          </div>
                          <div
                            className="text-xs truncate"
                            style={{ color: themeColors.textSecondary }}
                          >
                            {log.description}
                          </div>
                        </div>
                        <ChevronRight
                          size={12}
                          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: themeColors.textMuted }}
                        />
                      </div>
                    </td>
                    <td className="py-3">
                      <span
                        className="px-2 py-1 rounded-full text-xs transform hover:scale-105 transition-transform"
                        style={{
                          backgroundColor: themeColors.infoBg,
                          color: themeColors.info,
                        }}
                      >
                        {log.project}
                      </span>
                    </td>
                    <td
                      className="py-3 font-medium text-sm"
                      style={{ color: themeColors.textPrimary }}
                    >
                      {log.time}
                    </td>
                    <td
                      className="py-3 text-sm"
                      style={{ color: themeColors.textSecondary }}
                    >
                      {log.date}
                    </td>
                    <td className="py-3">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium transform hover:scale-105 transition-transform"
                        style={{
                          backgroundColor: themeColors.successBg,
                          color: themeColors.success,
                        }}
                      >
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  // Leave Management Section
  const renderLeaveManagement = () => (
    <div className="space-y-6">
      <div
        className="rounded-lg p-6 border transform hover:scale-[1.002] transition-all duration-300"
        style={{
          backgroundColor: themeColors.cardBackground,
          borderColor: themeColors.borderDivider,
        }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: themeColors.textPrimary }}
            >
              Leave Management
            </h1>
            <p style={{ color: themeColors.textSecondary }}>
              Apply for leave and track your requests
            </p>
          </div>
          <button
            onClick={() => setShowLeaveModal(true)}
            className="mt-4 md:mt-0 px-4 py-2 rounded font-semibold flex items-center text-sm hover:scale-105 transition-transform"
            style={{ backgroundColor: themeColors.primary, color: "#FFFFFF" }}
          >
            <Plus className="mr-2" size={16} />
            Apply for Leave
          </button>
        </div>
      </div>

      {/* Leave Balance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            type: "Casual Leave",
            balance: leaveBalance.casual,
            color: themeColors.success,
            icon: Coffee,
          },
          {
            type: "Sick Leave",
            balance: leaveBalance.sick,
            color: themeColors.info,
            icon: Heart,
          },
          {
            type: "Earned Leave",
            balance: leaveBalance.earned,
            color: themeColors.primary,
            icon: Plane,
          },
        ].map((item, index) => (
          <div
            key={index}
            className="rounded-lg p-5 border transform hover:scale-[1.02] transition-all duration-300 group"
            style={{
              backgroundColor: themeColors.cardBackground,
              borderColor: themeColors.borderDivider,
            }}
          >
            <div className="flex items-center mb-3">
              <div
                className="p-2 rounded-lg mr-3 transform group-hover:rotate-12 transition-transform"
                style={{ backgroundColor: themeColors.cardHover }}
              >
                <item.icon size={20} style={{ color: item.color }} />
              </div>
              <h3
                className="text-lg font-semibold"
                style={{ color: themeColors.textPrimary }}
              >
                {item.type}
              </h3>
            </div>
            <div className="text-center">
              <div
                className="text-2xl font-bold mb-1"
                style={{ color: item.color }}
              >
                {item.balance}
              </div>
              <div
                className="text-sm"
                style={{ color: themeColors.textSecondary }}
              >
                Days Available
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Leave History */}
      <div
        className="rounded-lg border transform hover:scale-[1.002] transition-all duration-300"
        style={{
          backgroundColor: themeColors.cardBackground,
          borderColor: themeColors.borderDivider,
        }}
      >
        <div
          className="p-5 border-b"
          style={{ borderColor: themeColors.borderDivider }}
        >
          <h3
            className="text-lg font-semibold"
            style={{ color: themeColors.textPrimary }}
          >
            Leave History
          </h3>
        </div>
        <div className="p-5">
          <div className="space-y-3">
            {leaves.map((leave) => (
              <div
                key={leave.id}
                className="p-4 rounded-lg flex items-center justify-between hover:scale-[1.01] transition-transform group"
                style={{ backgroundColor: themeColors.cardHover }}
              >
                <div className="min-w-0 flex-1">
                  <div
                    className="font-medium text-sm"
                    style={{ color: themeColors.textPrimary }}
                  >
                    {leave.type}
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: themeColors.textSecondary }}
                  >
                    {leave.from} to {leave.to} • {leave.days} days
                  </div>
                  <div
                    className="text-xs mt-1"
                    style={{ color: themeColors.textMuted }}
                  >
                    {leave.reason}
                  </div>
                </div>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium ml-2 flex-shrink-0 transform group-hover:scale-110 transition-transform"
                  style={{
                    backgroundColor:
                      leave.status === "approved"
                        ? themeColors.successBg
                        : leave.status === "pending"
                          ? themeColors.warningBg
                          : themeColors.dangerBg,
                    color:
                      leave.status === "approved"
                        ? themeColors.success
                        : leave.status === "pending"
                          ? themeColors.warning
                          : themeColors.danger,
                  }}
                >
                  {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Render Modals
  const renderModals = () => (
    <>
      {/* Leave Application Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in-0">
          <div
            className="rounded-lg border w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-5 duration-300"
            style={{
              backgroundColor: themeColors.cardBackground,
              borderColor: themeColors.borderDivider,
            }}
          >
            <div className="p-5">
              <div className="flex justify-between items-center mb-5">
                <h3
                  className="text-xl font-bold"
                  style={{ color: themeColors.textPrimary }}
                >
                  Apply for Leave
                </h3>
                <button
                  onClick={() => setShowLeaveModal(false)}
                  className="p-2 rounded hover:scale-110 transition-transform"
                  style={{ color: themeColors.textMuted }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleApplyLeave} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: themeColors.textSecondary }}
                    >
                      Leave Type *
                    </label>
                    <select
                      value={newLeave.type}
                      onChange={(e) =>
                        setNewLeave({ ...newLeave, type: e.target.value })
                      }
                      className="w-full p-2 rounded border text-sm hover:scale-105 transition-transform"
                      style={{
                        backgroundColor: themeColors.cardBackground,
                        borderColor: themeColors.borderDivider,
                        color: themeColors.textPrimary,
                      }}
                      required
                    >
                      <option value="">Select Leave Type</option>
                      {leaveTypes.map((type) => (
                        <option key={type.id || type.code} value={type.code || type.name}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: themeColors.textSecondary }}
                    >
                      Contact During Leave
                    </label>
                    <input
                      type="tel"
                      className="w-full p-2 rounded border text-sm hover:scale-105 transition-transform"
                      style={{
                        backgroundColor: themeColors.cardBackground,
                        borderColor: themeColors.borderDivider,
                        color: themeColors.textPrimary,
                      }}
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: themeColors.textSecondary }}
                    >
                      From Date *
                    </label>
                    <input
                      type="date"
                      value={newLeave.from}
                      onChange={(e) =>
                        setNewLeave({ ...newLeave, from: e.target.value })
                      }
                      className="w-full p-2 rounded border text-sm hover:scale-105 transition-transform"
                      style={{
                        backgroundColor: themeColors.cardBackground,
                        borderColor: themeColors.borderDivider,
                        color: themeColors.textPrimary,
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: themeColors.textSecondary }}
                    >
                      To Date *
                    </label>
                    <input
                      type="date"
                      value={newLeave.to}
                      onChange={(e) =>
                        setNewLeave({ ...newLeave, to: e.target.value })
                      }
                      className="w-full p-2 rounded border text-sm hover:scale-105 transition-transform"
                      style={{
                        backgroundColor: themeColors.cardBackground,
                        borderColor: themeColors.borderDivider,
                        color: themeColors.textPrimary,
                      }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: themeColors.textSecondary }}
                  >
                    Reason for Leave *
                  </label>
                  <textarea
                    value={newLeave.reason}
                    onChange={(e) =>
                      setNewLeave({ ...newLeave, reason: e.target.value })
                    }
                    className="w-full p-2 rounded border text-sm hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: themeColors.cardBackground,
                      borderColor: themeColors.borderDivider,
                      color: themeColors.textPrimary,
                    }}
                    rows="3"
                    placeholder="Please provide detailed reason for leave..."
                    required
                  />
                </div>

                <div
                  className="flex justify-end space-x-3 pt-4 border-t"
                  style={{ borderColor: themeColors.borderDivider }}
                >
                  <button
                    type="button"
                    onClick={() => setShowLeaveModal(false)}
                    className="px-4 py-1.5 text-sm hover:scale-105 transition-transform"
                    style={{ color: themeColors.textSecondary }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded text-sm font-medium hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: themeColors.primary,
                      color: "#FFFFFF",
                    }}
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Worklog Modal */}
      {showWorklogModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in-0">
          <div
            className="rounded-lg border w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-5 duration-300"
            style={{
              backgroundColor: themeColors.cardBackground,
              borderColor: themeColors.borderDivider,
            }}
          >
            <div className="p-5">
              <div className="flex justify-between items-center mb-5">
                <h3
                  className="text-xl font-bold"
                  style={{ color: themeColors.textPrimary }}
                >
                  Submit New Worklog
                </h3>
                <button
                  onClick={() => setShowWorklogModal(false)}
                  className="p-2 rounded hover:scale-110 transition-transform"
                  style={{ color: themeColors.textMuted }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmitWorklog} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: themeColors.textSecondary }}
                    >
                      Task/Project Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newWorklog.task}
                      onChange={(e) =>
                        setNewWorklog({ ...newWorklog, task: e.target.value })
                      }
                      className="w-full p-2 rounded border text-sm hover:scale-105 transition-transform"
                      style={{
                        backgroundColor: themeColors.cardBackground,
                        borderColor: themeColors.borderDivider,
                        color: themeColors.textPrimary,
                      }}
                      placeholder="Enter task name"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: themeColors.textSecondary }}
                    >
                      Project *
                    </label>
                    <select
                      value={newWorklog.project}
                      onChange={(e) =>
                        setNewWorklog({
                          ...newWorklog,
                          project: e.target.value,
                        })
                      }
                      className="w-full p-2 rounded border text-sm hover:scale-105 transition-transform"
                      style={{
                        backgroundColor: themeColors.cardBackground,
                        borderColor: themeColors.borderDivider,
                        color: themeColors.textPrimary,
                      }}
                    >
                      <option value="Alpha">Project Alpha</option>
                      <option value="Beta">Project Beta</option>
                      <option value="Gamma">Project Gamma</option>
                      <option value="Internal">Internal</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: themeColors.textSecondary }}
                  >
                    Work Description *
                  </label>
                  <textarea
                    required
                    value={newWorklog.description}
                    onChange={(e) =>
                      setNewWorklog({
                        ...newWorklog,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded border text-sm hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: themeColors.cardBackground,
                      borderColor: themeColors.borderDivider,
                      color: themeColors.textPrimary,
                    }}
                    rows="4"
                    placeholder="Describe your work in detail..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: themeColors.textSecondary }}
                    >
                      Time Spent *
                    </label>
                    <input
                      type="text"
                      required
                      value={newWorklog.time}
                      onChange={(e) =>
                        setNewWorklog({ ...newWorklog, time: e.target.value })
                      }
                      className="w-full p-2 rounded border text-sm hover:scale-105 transition-transform"
                      style={{
                        backgroundColor: themeColors.cardBackground,
                        borderColor: themeColors.borderDivider,
                        color: themeColors.textPrimary,
                      }}
                      placeholder="e.g., 2h 30m"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: themeColors.textSecondary }}
                    >
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newWorklog.date}
                      onChange={(e) =>
                        setNewWorklog({ ...newWorklog, date: e.target.value })
                      }
                      className="w-full p-2 rounded border text-sm hover:scale-105 transition-transform"
                      style={{
                        backgroundColor: themeColors.cardBackground,
                        borderColor: themeColors.borderDivider,
                        color: themeColors.textPrimary,
                      }}
                    />
                  </div>
                </div>

                <div
                  className="flex justify-end space-x-3 pt-4 border-t"
                  style={{ borderColor: themeColors.borderDivider }}
                >
                  <button
                    type="button"
                    onClick={() => setShowWorklogModal(false)}
                    className="px-4 py-1.5 text-sm hover:scale-105 transition-transform"
                    style={{ color: themeColors.textSecondary }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded text-sm font-medium hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: themeColors.primary,
                      color: "#FFFFFF",
                    }}
                  >
                    Submit Worklog
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in-0">
          <div
            className="rounded-lg border w-full max-w-md max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-5 duration-300"
            style={{
              backgroundColor: themeColors.cardBackground,
              borderColor: themeColors.borderDivider,
            }}
          >
            <div className="p-5">
              <div className="flex justify-between items-center mb-5">
                <h3
                  className="text-xl font-bold"
                  style={{ color: themeColors.textPrimary }}
                >
                  Add New Task
                </h3>
                <button
                  onClick={() => setShowNewTaskModal(false)}
                  className="p-2 rounded hover:scale-110 transition-transform"
                  style={{ color: themeColors.textMuted }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddTask} className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: themeColors.textSecondary }}
                  >
                    Task Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    className="w-full p-2 rounded border text-sm hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: themeColors.cardBackground,
                      borderColor: themeColors.borderDivider,
                      color: themeColors.textPrimary,
                    }}
                    placeholder="Enter task title"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: themeColors.textSecondary }}
                  >
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    className="w-full p-2 rounded border text-sm hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: themeColors.cardBackground,
                      borderColor: themeColors.borderDivider,
                      color: themeColors.textPrimary,
                    }}
                    rows="3"
                    placeholder="Task description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: themeColors.textSecondary }}
                    >
                      Estimated Time
                    </label>
                    <input
                      type="text"
                      value={newTask.time}
                      onChange={(e) =>
                        setNewTask({ ...newTask, time: e.target.value })
                      }
                      className="w-full p-2 rounded border text-sm hover:scale-105 transition-transform"
                      style={{
                        backgroundColor: themeColors.cardBackground,
                        borderColor: themeColors.borderDivider,
                        color: themeColors.textPrimary,
                      }}
                      placeholder="e.g., 2h"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: themeColors.textSecondary }}
                    >
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask({ ...newTask, priority: e.target.value })
                      }
                      className="w-full p-2 rounded border text-sm hover:scale-105 transition-transform"
                      style={{
                        backgroundColor: themeColors.cardBackground,
                        borderColor: themeColors.borderDivider,
                        color: themeColors.textPrimary,
                      }}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: themeColors.textSecondary }}
                  >
                    Project
                  </label>
                  <select
                    value={newTask.project}
                    onChange={(e) =>
                      setNewTask({ ...newTask, project: e.target.value })
                    }
                    className="w-full p-2 rounded border text-sm hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: themeColors.cardBackground,
                      borderColor: themeColors.borderDivider,
                      color: themeColors.textPrimary,
                    }}
                  >
                    <option value="Alpha">Project Alpha</option>
                    <option value="Beta">Project Beta</option>
                    <option value="Gamma">Project Gamma</option>
                    <option value="Internal">Internal</option>
                  </select>
                </div>

                <div
                  className="flex justify-end space-x-3 pt-4 border-t"
                  style={{ borderColor: themeColors.borderDivider }}
                >
                  <button
                    type="button"
                    onClick={() => setShowNewTaskModal(false)}
                    className="px-4 py-1.5 text-sm hover:scale-105 transition-transform"
                    style={{ color: themeColors.textSecondary }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded text-sm font-medium hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: themeColors.primary,
                      color: "#FFFFFF",
                    }}
                  >
                    Add Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div
      className="min-h-screen transition-colors duration-300 font-sans"
      style={{
        backgroundColor: themeColors.appBackground,
        color: themeColors.textPrimary,
      }
      }
    >
      {/* Main Content */}
      < div className="flex-1 min-w-0" >
        <main className="p-4 md:p-6">{renderActiveSection()}</main>
      </div >
      {/* Render Modals */}
      {renderModals()}
    </div >
  );


};

export default EmployeeDashboard;


// src/services/managerService.js
import api from './api';

export const managerService = {
    // --- Dashboard Stats ---
    getTeamStats: async () => {
        try {
            // Fetch all necessary data in parallel using allSettled to prevent total failure
            const results = await Promise.allSettled([
                api.get('/admin/employees'),
                api.get('/manager/attendance/today'),
                api.get('/leave/all'),
                api.get('/job-applications')
            ]);

            // Helper to get data or empty array
            const getData = (result) => result.status === 'fulfilled' ? result.value.data : [];
            const getAttendanceData = (result) => {
                if (result.status !== 'fulfilled') return [];
                // Handle various potential return shapes
                const data = result.value.data;
                return Array.isArray(data) ? data : (data.teamAttendance || []);
            };

            const getApplicationsData = (result) => {
                if (result.status !== 'fulfilled') return [];
                const data = result.value.data;
                // Backend returns { applications: [], total: 0 }
                return Array.isArray(data) ? data : (data.applications || []);
            };

            const employees = getData(results[0]);
            const attendance = getAttendanceData(results[1]);
            const leaves = getData(results[2]);
            const applications = getApplicationsData(results[3]);

            // Log errors if any (for debugging)
            results.forEach((res, idx) => {
                if (res.status === 'rejected') {
                    console.error(`Dashboard API ${idx} failed:`, res.reason);
                }
            });

            // Calculate stats
            const totalEmployees = employees.length;

            // Attendance status logic might vary based on backend return strings
            const todaysAttendance = attendance.filter(a => {
                const s = (a.status || '').toUpperCase();
                return s === 'PRESENT' || s === 'LATE' || s === 'PRESENT_NO_LOGOUT';
            }).length;

            const departments = new Set(employees.map(e => e.employee?.department?.name || e.employee?.department).filter(Boolean)).size;
            const activeJobs = new Set(applications.map(a => a.job?.title || a.position).filter(Boolean)).size;
            const pendingLeaves = leaves.filter(l => l.status === 'pending').length;
            const payrollDue = 1;

            // Department Performance
            const deptMap = {};
            employees.forEach(e => {
                const dept = e.employee?.department?.name || e.employee?.department || 'General';
                if (!deptMap[dept]) deptMap[dept] = { count: 0, present: 0 };
                deptMap[dept].count++;
            });

            // Map attendance to departments
            // Backend returns flat structure: { department: '...', status: '...' }
            attendance.forEach(a => {
                const dept = a.department || 'General';
                const s = (a.status || '').toUpperCase();
                if (deptMap[dept] && (s === 'PRESENT' || s === 'LATE' || s === 'PRESENT_NO_LOGOUT')) {
                    deptMap[dept].present++;
                }
            });

            const departmentPerf = Object.keys(deptMap).map((name, index) => {
                const data = deptMap[name];
                const attendanceRate = data.count > 0 ? Math.round((data.present / data.count) * 100) : 0;
                const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];
                return {
                    name,
                    attendance: attendanceRate,
                    productivity: 85 + Math.floor(Math.random() * 10),
                    color: colors[index % colors.length]
                };
            }).slice(0, 6);

            // Leave Distribution
            const leaveTypes = {};
            leaves.forEach(l => {
                const type = l.leaveType || 'Other';
                leaveTypes[type] = (leaveTypes[type] || 0) + 1;
            });

            const leaveDist = Object.keys(leaveTypes).map((type, index) => {
                const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];
                return {
                    type,
                    count: leaveTypes[type],
                    color: colors[index % colors.length]
                };
            });
            if (leaveDist.length === 0) {
                leaveDist.push({ type: 'No Data', count: 1, color: '#e2e8f0' });
            }

            // Today's Attendance List (Formatted)
            const todayAtt = attendance.map((record, index) => ({
                id: record.id || index,
                // Backend returns flat fields: fullName, employeeCode, markIn
                name: record.fullName || record.employee?.fullName || 'Unknown',
                status: record.status ? (record.status.charAt(0).toUpperCase() + record.status.slice(1).toLowerCase().replace('_', ' ')) : 'Absent',
                time: record.markIn ? new Date(record.markIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                    (record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'),
                avatar: (record.fullName || record.employee?.fullName || 'U').split(' ').map(n => n[0]).join('').substring(0, 2),
                employeeId: record.employeeCode || (record.employee?.employeeCode) || `EMP${index}`
            })).slice(0, 5);

            return {
                data: {
                    stats: {
                        totalEmployees,
                        todaysAttendance,
                        departments,
                        activeJobs,
                        pendingLeaves,
                        payrollDue
                    },
                    departmentPerf,
                    // Mock weekly trend
                    weeklyAtt: [
                        { day: 'Mon', present: Math.round(totalEmployees * 0.9), absent: Math.round(totalEmployees * 0.1) },
                        { day: 'Tue', present: Math.round(totalEmployees * 0.92), absent: Math.round(totalEmployees * 0.08) },
                        { day: 'Wed', present: Math.round(totalEmployees * 0.88), absent: Math.round(totalEmployees * 0.12) },
                        { day: 'Thu', present: Math.round(totalEmployees * 0.95), absent: Math.round(totalEmployees * 0.05) },
                        { day: 'Fri', present: Math.round(totalEmployees * 0.85), absent: Math.round(totalEmployees * 0.15) },
                        { day: 'Sat', present: 0, absent: 0 },
                        { day: 'Sun', present: 0, absent: 0 },
                    ],
                    leaveDist,
                    todayAtt
                }
            };
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            throw error;
        }
    },

    getTeamAttendance: async (date = null) => {
        const url = date ? `/manager/attendance?date=${date}` : `/manager/attendance`;
        const response = await api.get(url);
        return response.data;
    },

    getTeamMonthlyAttendance: async (month, year) => {
        const response = await api.get(`/manager/attendance/monthly?month=${month}&year=${year}`);
        return response.data;
    },

    markEmployeeAttendance: async (payload) => {
        const response = await api.post(`/manager/attendance/mark`, payload);
        return response.data;
    },

    getTeamAttendanceAnalytics: async () => {
        const response = await api.get(`/manager/attendance/analytics`);
        return response.data;
    },

    getEmployeeAttendance: async (employeeId) => {
        const response = await api.get(`/attendance/${employeeId}`);
        return response.data;
    },

    // --- Employee Management ---
    getEmployees: async () => {
        // Using the admin route which is now shared
        const response = await api.get(`/admin/employees`);
        return response.data;
    },

    getEmployeeById: async (id) => {
        const response = await api.get(`/admin/employees/${id}`);
        return response.data;
    },

    // --- Leave Management ---
    getPendingLeaves: async () => {
        const response = await api.get(`/leave/pending`);
        return response.data;
    },

    getAllLeaves: async () => {
        const response = await api.get(`/leave/all`);
        return response.data;
    },

    getLeaveBalanceByEmployeeId: async (employeeId) => {
        const response = await api.get(`/leavebalance/${employeeId}`);
        return response.data;
    },

    approveLeave: async (id, remarks) => {
        const response = await api.post(`/leave/${id}/approve`, { remarks });
        return response.data;
    },

    rejectLeave: async (id, reason) => {
        const response = await api.post(`/leave/${id}/reject`, { rejectionReason: reason });
        return response.data;
    },

    applyLeave: async (leaveData) => {
        const response = await api.post(`/leave/apply`, leaveData);
        return response.data;
    },

    // --- Recruitment ---
    getJobApplications: async () => {
        const response = await api.get(`/job-applications`);
        return response.data;
    },

    updateApplicationStatus: async (id, status) => {
        const response = await api.put(`/job-applications/${id}`, { status });
        return response.data;
    },

    // --- Department Management ---
    getDepartments: async () => {
        const response = await api.get(`/departments`);
        return response.data;
    },

    getDepartmentById: async (id) => {
        const response = await api.get(`/departments/${id}`);
        return response.data;
    },

    createDepartment: async (payload) => {
        const response = await api.post(`/departments`, payload);
        return response.data;
    },

    // --- Task Management ---
    createTask: async (taskData) => {
        const response = await api.post("/tasks", taskData);
        return response.data;
    },

    getTeamTasks: async () => {
        const response = await api.get("/tasks/team");
        return response.data;
    }
};

import api from "./api";

const employeeService = {
    // Dashboard
    getDashboardStats: async () => {
        const response = await api.get("/dashboard/employee");
        return response.data;
    },

    // Attendance
    getAttendance: async () => {
        const response = await api.get("/attendance/getAttendance");
        return response.data;
    },

    getAllAttendance: async () => {
        const response = await api.get("/attendance/all");
        return response.data;
    },

    markClockIn: async () => {
        const response = await api.put("/attendance/mark-in", {});
        return response.data;
    },

    markClockOut: async () => {
        const response = await api.put("/attendance/mark-out", {});
        return response.data;
    },

    // Tasks
    createTask: async (taskData) => {
        const response = await api.post("/tasks", taskData);
        return response.data;
    },

    getTasks: async () => {
        const response = await api.get("/tasks/my");
        return response.data;
    },

    updateTaskStatus: async (taskId, status) => {
        const response = await api.patch(`/tasks/${taskId}/status`, { status });
        return response.data;
    },

    // Leaves
    getLeaves: async () => {
        const response = await api.get("/leave/my");
        return response.data;
    },

    getLeaveBalance: async () => {
        const response = await api.get("/leavebalance/my");
        return response.data;
    },

    getLeaveTypes: async () => {
        const response = await api.get("/leavetypes");
        return response.data;
    },

    applyLeave: async (leaveData) => {
        const response = await api.post("/leave/apply", leaveData);
        return response.data;
    },

    // Worklogs
    getWorklogs: async () => {
        const response = await api.get("/worklogs/my");
        return response.data;
    },

    addWorklog: async (worklogData) => {
        const response = await api.post("/worklogs/add", worklogData);
        return response.data;
    },

    // Holidays
    getHolidays: async () => {
        const response = await api.get("/holidays");
        return response.data;
    },

    // Payslips
    getPayslips: async () => {
        const response = await api.get("/payslips/my");
        return response.data;
    },

    // Documents
    getDocuments: async () => {
        const response = await api.get("/documents/my");
        return response.data;
    }
};

export default employeeService;

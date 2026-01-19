import axios from "axios";

const API_URL = "/api";

// Helper to get token
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
};

const employeeService = {
    // Dashboard
    getDashboardStats: async () => {
        const response = await axios.get(`${API_URL}/dashboard/employee`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    // Attendance
    getAttendance: async () => {
        const response = await axios.get(`${API_URL}/attendance/getAttendance`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    getAllAttendance: async () => {
        const response = await axios.get(`${API_URL}/attendance/all`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    markClockIn: async () => {
        const response = await axios.put(
            `${API_URL}/attendance/mark-in`,
            {},
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    markClockOut: async () => {
        const response = await axios.put(
            `${API_URL}/attendance/mark-out`,
            {},
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    // Tasks
    createTask: async (taskData) => {
        const response = await axios.post(`${API_URL}/tasks`, taskData, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    getTasks: async () => {

        const response = await axios.get(`${API_URL}/tasks/my`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    updateTaskStatus: async (taskId, status) => {
        const response = await axios.patch(
            `${API_URL}/tasks/${taskId}/status`,
            { status },
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    // Leaves
    getLeaves: async () => {
        const response = await axios.get(`${API_URL}/leave/my`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    getLeaveBalance: async () => {
        const response = await axios.get(`${API_URL}/leavebalance/my`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    applyLeave: async (leaveData) => {
        const response = await axios.post(`${API_URL}/leave/apply`, leaveData, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    // Worklogs
    getWorklogs: async () => {
        const response = await axios.get(`${API_URL}/worklogs/my`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    addWorklog: async (worklogData) => {
        const response = await axios.post(`${API_URL}/worklogs/add`, worklogData, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    // Holidays
    getHolidays: async () => {
        const response = await axios.get(`${API_URL}/holidays`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    // Payslips
    getPayslips: async () => {
        const response = await axios.get(`${API_URL}/payslips/my`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    // Documents
    getDocuments: async () => {
        const response = await axios.get(`${API_URL}/documents/my`, {
            headers: getAuthHeader(),
        });
        return response.data;
    }
};

export default employeeService;

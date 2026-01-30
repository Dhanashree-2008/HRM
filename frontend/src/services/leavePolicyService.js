import axios from "axios";

const API_URL = "/api/leave-policy";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

const getLeavePolicy = async () => {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
};

const updateLeaveTypePolicy = async (id, data) => {
    const response = await axios.put(`${API_URL}/leave-types/${id}`, data, getAuthHeaders());
    return response.data;
};

const createLeaveType = async (data) => {
    const response = await axios.post(`${API_URL}/leave-types`, data, getAuthHeaders());
    return response.data;
};

const getHolidays = async (year) => {
    const response = await axios.get(`${API_URL}/holidays?year=${year}`, getAuthHeaders());
    return response.data;
};

const leavePolicyService = {
    getLeavePolicy,
    updateLeaveTypePolicy,
    createLeaveType,
    getHolidays,
};

export default leavePolicyService;

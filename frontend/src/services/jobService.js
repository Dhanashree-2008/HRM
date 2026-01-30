import axios from "axios";

const API_URL = "/api/jobs";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// Admin Services
const getJobs = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await axios.get(`${API_URL}?${params}`, getAuthHeaders());
    return response.data;
};

const getJobById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
};

const createJob = async (jobData) => {
    const response = await axios.post(API_URL, jobData, getAuthHeaders());
    return response.data;
};

const updateJob = async (id, jobData) => {
    const response = await axios.put(`${API_URL}/${id}`, jobData, getAuthHeaders());
    return response.data;
};

const deleteJob = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
};

// Public Services
const getPublicJobs = async () => {
    const response = await axios.get(`${API_URL}/public?isPublic=true`);
    return response.data;
};

const getPublicJobById = async (id) => {
    const response = await axios.get(`${API_URL}/public/${id}?isPublic=true`);
    return response.data;
};

const createJobApplication = async (formData) => {
    const response = await axios.post(`/api/job-applications`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

const getJobApplications = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await axios.get(`/api/job-applications?${params}`, getAuthHeaders());
    return response.data;
};

const getJobApplicationById = async (id) => {
    const response = await axios.get(`/api/job-applications/${id}`, getAuthHeaders());
    return response.data;
};

const updateJobApplicationStatus = async (id, statusData) => {
    const response = await axios.put(`/api/job-applications/${id}`, statusData, getAuthHeaders());
    return response.data;
};

const jobService = {
    getJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    getPublicJobs,
    getPublicJobById,
    createJobApplication,
    getJobApplications,
    getJobApplicationById,
    updateJobApplicationStatus,
};

export default jobService;

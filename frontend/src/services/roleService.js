import axios from "axios";

const API_URL = "/api/roles";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

const getAllRoles = async () => {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
};

const getRoleById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
};

const createRole = async (roleData) => {
    const response = await axios.post(API_URL, roleData, getAuthHeaders());
    return response.data;
};

const updateRole = async (id, roleData) => {
    const response = await axios.put(`${API_URL}/${id}`, roleData, getAuthHeaders());
    return response.data;
};

const deleteRole = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
};

const roleService = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
};

export default roleService;

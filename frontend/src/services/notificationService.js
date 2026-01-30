// src/services/notificationService.js
import axios from 'axios';

const API_URL = '/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const notificationService = {
    getAll: async () => {
        const response = await axios.get(`${API_URL}/notifications`, getAuthHeader());
        return response.data;
    },

    markRead: async (id) => {
        const response = await axios.patch(`${API_URL}/notifications/${id}/read`, {}, getAuthHeader());
        return response.data;
    },

    markAllRead: async () => {
        const response = await axios.patch(`${API_URL}/notifications/read-all`, {}, getAuthHeader());
        return response.data;
    },

    clearAll: async () => {
        const response = await axios.post(`${API_URL}/notifications/clear`, {}, getAuthHeader());
        return response.data;
    }
};

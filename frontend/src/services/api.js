import axios from "axios";

// Create an axios instance
const api = axios.create({
    baseURL: "/api", // Relies on Vite proxy
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add the auth token header to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle common errors (like 401)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // If 401 (Unauthorized), user might need to login again
        if (error.response && error.response.status === 401) {
            // Use window.location as a fallback to redirect, or dispatch a redux action
            // Be careful with window.location.reload() loops
            console.warn("Unauthorized access - token might be invalid");
            // Optional: localStorage.removeItem("token"); window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;

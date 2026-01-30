// src/controllers/dashboard.controller.js
import {
  getAdminDashboardService,
  getManagerDashboardService,
} from "../services/dashboard.service.js";

export const adminDashboardController = async (req, res) => {
  try {
    const data = await getAdminDashboardService();
    res.json(data);
  } catch (err) {
    console.error("Admin dashboard error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

export const managerDashboardController = async (req, res) => {
  try {
    const data = await getManagerDashboardService(req.user);
    res.json(data);
  } catch (err) {
    console.error("Manager dashboard error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

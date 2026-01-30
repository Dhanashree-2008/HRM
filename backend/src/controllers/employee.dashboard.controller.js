import { getEmployeeDashboardService } from "../services/employee.dashboard.service.js";

export const employeeDashboardController = async (req, res) => {
  try {
    if (req.user.role !== "EMPLOYEE") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!req.user.employeeId) {
      return res.status(400).json({ 
        message: "Employee profile not linked. Please contact administrator." 
      });
    }

    const data = await getEmployeeDashboardService(req.user.employeeId);
    res.json(data);
  } catch (err) {
    console.error("Employee dashboard error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

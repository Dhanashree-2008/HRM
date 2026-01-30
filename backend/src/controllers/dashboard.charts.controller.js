import {
  adminMonthlyAttendanceService,
  adminMonthlyLeaveService,
  departmentEmployeeCountService,
  managerMonthlyAttendanceService,
  managerMonthlyLeaveService,
  adminHiringTrendService,
  adminLeaveStatisticsService,
  adminOvertimeService,
  adminPerformanceMetricsService,
  adminTrainingService
} from "../services/dashboard.charts.service.js";

// ADMIN
export const adminChartsController = async (req, res) => {
  try {
    const attendance = await adminMonthlyAttendanceService();
    const leaves = await adminMonthlyLeaveService();
    const departments = await departmentEmployeeCountService();
    const hiring = await adminHiringTrendService();
    const leaveStats = await adminLeaveStatisticsService();
    const overtime = await adminOvertimeService();
    const performance = await adminPerformanceMetricsService();
    const training = await adminTrainingService();

    res.json({
      attendance,
      leaves,
      departments,
      hiring,
      leaveStats,
      overtime,
      performance,
      training
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// MANAGER
export const managerChartsController = async (req, res) => {
  try {
    const attendance = await managerMonthlyAttendanceService(req.user.employeeId);
    const leaves = await managerMonthlyLeaveService(req.user.employeeId);

    res.json({ attendance, leaves });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

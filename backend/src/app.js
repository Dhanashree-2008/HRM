import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import managerRoutes from "./routes/manager.routes.js";
import leaveRoutes from "./routes/leave.routes.js";
import worklogRoutes from "./routes/worklog.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import taskRoutes from "./routes/task.routes.js";
import leaveTypeRoutes from "./routes/leaveType.routes.js";
import leaveBalanceRoutes from "./routes/leaveBalance.routes.js";
import dashboardChartsRoutes from "./routes/dashboard.charts.routes.js";
import employeeDashboardRoutes from "./routes/employee.dashboard.routes.js";
import reportRoutes from "./routes/report.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import holidayRoutes from "./routes/holiday.routes.js";
import leavePolicyRoutes from "./routes/leavePolicy.routes.js";
import jobRoutes from "./routes/job.routes.js";
import jobApplicationRoutes from "./routes/jobApplication.routes.js";
import auditLogRoutes from "./routes/auditLog.routes.js";
import chatbotRoutes from "./routes/chatbot.routes.js";
import termsAcceptanceRoutes from "./routes/termsAcceptance.routes.js";
import cvRoutes from "./routes/cv.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import settingRoutes from "./routes/setting.routes.js";
import documentRoutes from "./routes/document.routes.js";
import payslipRoutes from "./routes/payslip.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import roleRoutes from "./routes/role.routes.js";
import resetPasswordRoutes from "./routes/resetPassword.routes.js";


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Serve static files from public directory

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/worklogs", worklogRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/leavetypes", leaveTypeRoutes);
app.use("/api/leavebalance", leaveBalanceRoutes);
app.use("/api/dashboard/charts", dashboardChartsRoutes);
app.use("/api/dashboard", employeeDashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/holidays", holidayRoutes);
app.use("/api/leave-policy", leavePolicyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/job-applications", jobApplicationRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/terms", termsAcceptanceRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/payslips", payslipRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/reset-password", resetPasswordRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "LiteHR backend running" });
});

export default app;

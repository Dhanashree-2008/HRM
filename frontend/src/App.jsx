import { ThemeProvider } from "./contexts/ThemeContext";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

/* Public */
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./components/NotFound";

/* Layouts */
import AdminLayout from "./layouts/AdminLayout";
import ManagerLayout from "./layouts/ManagerLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";

/* Dashboards */
import AdminHome from "./pages/Admin/AdminHome";
import ManagerHome from "./pages/Manager/ManagerHome";
import EmployeeHome from "./pages/Employee/EmployeeHome";

/* Employees */
import EmployeeList from "./pages/Admin/employee/EmployeeList";
import AddEmployee from "./pages/Admin/employee/AddEmployee";
import EditEmployee from "./pages/Admin/employee/EditEmployee";
import EmployeeProfile from "./pages/Admin/employee/EmployeeProfile";


/* Departments */
import DepartmentList from "./pages/Admin/department/DepartmentList";
import AddDepartment from "./pages/Admin/department/AddDepartment";
import EditDepartment from "./pages/Admin/department/EditDepartment";
import DepartmentDetails from "./pages/Admin/department/DepartmentDetails";

/* Attendance */
import DailyAttendance from "./pages/Admin/attendance/AttendanceManagement";
import MonthlyAttendance from "./pages/Admin/attendance/MonthlyAttendance";
import AttendanceReports from "./pages/Admin/attendance/AttendanceReports";

/* Leaves */
import LeaveRequests from "./pages/Admin/leaves/LeaveRequests";
import LeavePolicy from "./pages/Admin/leaves/LeavePolicy";
import ManagerLeaves from "./pages/Manager/ManagerLeaves";
import ManagerAttendance from "./pages/Manager/ManagerAttendance";

/* Roles */
import RoleList from "./pages/Admin/roles/RoleList";
import AddRole from "./pages/Admin/roles/AddRole";
import EditRole from "./pages/Admin/roles/EditRole";

/* Recruitment */
import JobList from "./pages/Admin/recruitment/JobList";
import AddJob from "./pages/Admin/recruitment/AddJob";
import ApplicationsList from "./pages/Admin/recruitment/ApplicationsList";
import ApplicationDetails from "./pages/Admin/recruitment/ApplicationDetails";
import CvSummarizer from "./pages/Admin/recruitment/CVSummarizer";

/* Vault */
import VaultList from "./pages/Admin/vault/VaultList";
import UploadDocument from "./pages/Admin/vault/UploadDocument";

/* Analytics */
import AdminAnalytics from "./pages/Admin/analytics/AdminAnalytics";

/* Notifications */
import Notifications from "./pages/Admin/notifications/Notifications";

/* Settings */
import CompanySettings from "./pages/Admin/settings/CompanySettings";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await axios.get("/api/auth/getUser", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch {
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  /* Role-based Route Guards */
  const AdminRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/login" />;
    if (user && user.role !== "ADMIN") {
      // Redirect based on role
      if (user.role === "MANAGER") return <Navigate to="/manager/dashboard" />;
      if (user.role === "EMPLOYEE") return <Navigate to="/employee/dashboard" />;
    }
    return children;
  };

  const ManagerRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/login" />;
    if (user && user.role !== "MANAGER" && user.role !== "ADMIN") {
      if (user.role === "EMPLOYEE") return <Navigate to="/employee/dashboard" />;
      if (user.role === "ADMIN") return <Navigate to="/admin/dashboard" />;
      return <Navigate to="/login" />;
    }
    return children;
  };

  const EmployeeRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/login" />;
    if (user && user.role !== "EMPLOYEE" && user.role !== "ADMIN" && user.role !== "MANAGER") {
      if (user.role === "ADMIN") return <Navigate to="/admin/dashboard" />;
      if (user.role === "MANAGER") return <Navigate to="/manager/dashboard" />;
      return <Navigate to="/login" />;
    }
    return children;
  };

  // Helper to get redirect path based on role
  const getRoleRedirect = (role) => {
    if (role === "ADMIN") return "/admin/dashboard";
    if (role === "MANAGER") return "/manager/dashboard";
    if (role === "EMPLOYEE") return "/employee/dashboard";
    return "/login";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading LiteHR...
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={localStorage.getItem("token") && user ? <Navigate to={getRoleRedirect(user.role)} /> : <Login setUser={setUser} />}
        />
        <Route
          path="/register"
          element={localStorage.getItem("token") && user ? <Navigate to={getRoleRedirect(user.role)} /> : <Register setUser={setUser} />}
        />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ================= ADMIN (SINGLE SOURCE OF TRUTH) ================= */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<AdminHome />} />

          {/* Employees */}
          <Route path="employees" element={<EmployeeList />} />
          <Route path="employees/add" element={<AddEmployee />} />
          <Route path="employees/edit/:id" element={<EditEmployee />} />
          <Route path="employees/:id" element={<EmployeeProfile />} />



          {/* Departments */}
          <Route path="departments" element={<DepartmentList />} />
          <Route path="departments/add" element={<AddDepartment />} />
          <Route path="departments/edit/:id" element={<EditDepartment />} />
          <Route path="departments/:id" element={<DepartmentDetails />} />

          {/* Roles */}
          <Route path="roles" element={<RoleList />} />
          <Route path="roles/add" element={<AddRole />} />
          <Route path="roles/edit/:id" element={<EditRole />} />

          {/* Attendance */}
          <Route path="attendance/daily" element={<DailyAttendance />} />
          <Route path="attendance/monthly" element={<MonthlyAttendance />} />
          <Route path="attendance/reports" element={<AttendanceReports />} />

          {/* Leaves */}
          <Route path="leaves/requests" element={<LeaveRequests />} />
          <Route path="leaves/policy" element={<LeavePolicy />} />

          {/* Recruitment */}
          <Route path="recruitment/jobs" element={<JobList />} />
          <Route path="recruitment/add-job" element={<AddJob />} />
          <Route path="recruitment/applications" element={<ApplicationsList />} />
          <Route path="recruitment/applications/:id" element={<ApplicationDetails />} />
          <Route path="recruitment/cv-summarizer" element={<CvSummarizer />} />

          {/* Vault */}
          <Route path="vault" element={<VaultList />} />
          <Route path="vault/upload" element={<UploadDocument />} />

          {/* Analytics */}
          <Route path="analytics" element={<AdminAnalytics />} />

          {/* Notifications */}
          <Route path="notifications" element={<Notifications />} />

          {/* Settings */}
          <Route path="settings" element={<CompanySettings />} />
        </Route>

        {/* ================= MANAGER ROUTES ================= */}
        <Route
          path="/manager"
          element={
            <ManagerRoute>
              <ManagerLayout />
            </ManagerRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<ManagerHome />} />
          <Route path="attendance" element={<ManagerAttendance />} />
          <Route path="leaves" element={<ManagerLeaves />} />
          <Route path="worklogs" element={<div className="p-6">Worklogs Review - Coming Soon</div>} />
          <Route path="settings" element={<div className="p-6">Settings - Coming Soon</div>} />
        </Route>

        {/* ================= EMPLOYEE ROUTES ================= */}
        <Route
          path="/employee"
          element={
            <EmployeeRoute>
              <EmployeeLayout />
            </EmployeeRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<EmployeeHome />} />
          <Route path="attendance" element={<EmployeeHome />} />
          <Route path="leaves" element={<EmployeeHome />} />
          <Route path="worklogs" element={<EmployeeHome />} />
          <Route path="profile" element={<EmployeeHome />} />
          <Route path="payslips" element={<EmployeeHome />} />
          <Route path="documents" element={<EmployeeHome />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;

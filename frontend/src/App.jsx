import { ThemeProvider } from "./contexts/ThemeContext";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";

/* Public */
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./components/NotFound";
import Homepage from "./pages/Homepage";
import CareersPage from "./pages/CareersPage";

/* Layouts */
import AdminLayout from "./layouts/AdminLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";
import MainLayout from './pages/manager/MainLayout'; // Manager Main Layout

/* Dashboards */
import AdminHome from "./pages/Admin/AdminHome";
import EmployeeHome from "./pages/Employee/EmployeeHome";
import Dashboard from './pages/manager/Dashboard'; // Manager Dashboard

/* Manager Pages */
import EmployeeManagement from './pages/manager/EmployeeManagement';
import AttendanceTracking from './pages/manager/AttendanceTracking';
import LeaveApproval from './pages/manager/LeaveApproval';
import Roles from './pages/manager/Roles';
import Recruitment from './pages/manager/Recruitment';
import SecureVault from './pages/manager/SecureVault';
import Settings from './pages/manager/Settings';
import EmployeeHierarchy from './pages/manager/EmployeeHierarchy';

// Manager Add/Edit Imports with Aliases to avoid conflict with Admin
import ManagerDepartmentList from './pages/manager/DepartmentList';
import ManagerAddDepartment from './pages/manager/AddDepartment';


import ManagerAddRole from './pages/manager/AddRole';
import ManagerLeavePolicy from './pages/manager/LeavePolicy';
import ManagerUploadDocument from './pages/manager/UploadDocument';
import TaskManagement from './pages/manager/TaskManagement';

/* Employees (Admin) */
import EmployeeList from "./pages/Admin/employee/EmployeeList";
import AdminAddEmployee from "./pages/Admin/employee/AddEmployee";
import EditEmployee from "./pages/Admin/employee/EditEmployee";
import EmployeeProfile from "./pages/Admin/employee/EmployeeProfile";

/* Departments (Admin) */
import DepartmentList from "./pages/Admin/department/DepartmentList";
import AdminAddDepartment from "./pages/Admin/department/AddDepartment";
import EditDepartment from "./pages/Admin/department/EditDepartment";
import DepartmentDetails from "./pages/Admin/department/DepartmentDetails";

/* Attendance (Admin) */
import DailyAttendance from "./pages/Admin/attendance/AttendanceManagement";
import MonthlyAttendance from "./pages/Admin/attendance/MonthlyAttendance";
import AttendanceReports from "./pages/Admin/attendance/AttendanceReports";

/* Leaves (Admin) */
import LeaveRequests from "./pages/Admin/leaves/LeaveRequests";
import AdminLeavePolicy from "./pages/Admin/leaves/LeavePolicy";

/* Roles (Admin) */
import RoleList from "./pages/Admin/roles/RoleList";
import AdminAddRole from "./pages/Admin/roles/AddRole";
import EditRole from "./pages/Admin/roles/EditRole";

/* Recruitment (Admin) */
import JobList from "./pages/Admin/recruitment/JobList";
import AddJob from "./pages/Admin/recruitment/AddJob";
import ApplicationsList from "./pages/Admin/recruitment/ApplicationsList";
import ApplicationDetails from "./pages/Admin/recruitment/ApplicationDetails";
import CvSummarizer from "./pages/Admin/recruitment/CvSummarizer";
import JobDetails from "./pages/Admin/recruitment/JobDetails";


/* Vault (Admin) */
import VaultList from "./pages/Admin/vault/VaultList";
import AdminUploadDocument from "./pages/Admin/vault/UploadDocument";

/* Analytics (Admin) */
import AdminAnalytics from "./pages/Admin/analytics/AdminAnalytics";

/* Payroll (Admin) */
import AdminPayslip from "./pages/Admin/payslip/AdminPayslip";

/* Notifications (Admin) */
import Notifications from "./pages/Admin/notifications/Notifications";

/* Settings (Admin) */
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

  // Helper to get redirect path based on role
  const getRoleRedirect = (role) => {
    if (role === "ADMIN") return "/admin/dashboard";
    if (role === "MANAGER") return "/manager/dashboard";
    if (role === "EMPLOYEE") return "/employee/dashboard";
    return "/login";
  };

  /* Role-based Route Guards */
  const AdminRoute = ({ user, children }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return <Navigate to="/login" replace />;
    }

    if (!user) {
      return null; // or loader
    }

    if (user.role !== "ADMIN") {
      return <Navigate to={getRoleRedirect(user.role)} replace />;
    }

    return children;
  };


  const ManagerRoute = ({ user, children }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return <Navigate to="/login" replace />;
    }

    if (!user) {
      return null;
    }

    if (user.role !== "MANAGER" && user.role !== "ADMIN") {
      return <Navigate to={getRoleRedirect(user.role)} replace />;
    }

    return children;
  };


  const EmployeeRoute = ({ user, children }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return <Navigate to="/login" replace />;
    }

    if (!user) {
      return null;
    }

    if (!["EMPLOYEE", "MANAGER", "ADMIN"].includes(user.role)) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
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
      <Toaster position="top-right" />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Homepage />} />
        <Route path="/careers" element={<CareersPage />} />
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
            <AdminRoute user={user}>
              <AdminLayout logout={handleLogout} />
            </AdminRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<AdminHome />} />

          {/* Employees */}
          <Route path="employees" element={<EmployeeList />} />
          <Route path="employees/add" element={<AdminAddEmployee />} />
          <Route path="employees/edit/:id" element={<EditEmployee />} />
          <Route path="employees/:id" element={<EmployeeProfile />} />

          {/* Departments */}
          <Route path="departments" element={<DepartmentList />} />
          <Route path="departments/add" element={<AdminAddDepartment />} />
          <Route path="departments/edit/:id" element={<EditDepartment />} />
          <Route path="departments/:id" element={<DepartmentDetails />} />

          {/* Roles */}
          <Route path="roles" element={<RoleList />} />
          <Route path="roles/add" element={<AdminAddRole />} />
          <Route path="roles/edit/:id" element={<EditRole />} />

          {/* Attendance */}
          <Route path="attendance/daily" element={<DailyAttendance />} />
          <Route path="attendance/monthly" element={<MonthlyAttendance />} />
          <Route path="attendance/reports" element={<AttendanceReports />} />

          {/* Leaves */}
          <Route path="leaves/requests" element={<LeaveRequests />} />
          <Route path="leaves/policy" element={<AdminLeavePolicy />} />

          {/* Recruitment */}
          <Route path="recruitment/jobs" element={<JobList />} />
          <Route path="recruitment/add-job" element={<AddJob />} />
          <Route path="recruitment/edit-job/:id" element={<AddJob />} />
          <Route path="recruitment/jobs/:id" element={<JobDetails />} />
          <Route path="recruitment/applications" element={<ApplicationsList />} />
          <Route path="recruitment/applications/:id" element={<ApplicationDetails />} />
          <Route path="recruitment/cv-summarizer" element={<CvSummarizer />} />

          {/* Vault */}
          <Route path="vault" element={<VaultList />} />
          <Route path="vault/upload" element={<AdminUploadDocument />} />

          {/* Analytics */}
          <Route path="analytics" element={<AdminAnalytics />} />


          {/* Notifications */}
          <Route path="notifications" element={<Notifications />} />

          {/* Payroll */}
          <Route path="payroll/payslips" element={<AdminPayslip />} />

          {/* Settings */}
          <Route path="settings" element={<CompanySettings />} />
        </Route>

        {/* ================= MANAGER ROUTES ================= */}
        <Route
          path="/manager"
          element={
            <ManagerRoute user={user}>
              <MainLayout logout={handleLogout} />
            </ManagerRoute>
          }
        >
          <Route index element={<Navigate to="/manager/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Employee Management */}
          <Route path="employees" element={<EmployeeManagement />} />
          <Route path="employees/hierarchy" element={<EmployeeHierarchy />} />



          {/* Departments */}
          <Route path="departments" element={<ManagerDepartmentList />} />
          <Route path="departments/add" element={<ManagerAddDepartment />} />

          {/* Task Management */}
          <Route path="tasks" element={<TaskManagement />} />

          {/* Roles & Permissions */}
          <Route path="roles" element={<Roles />} />
          <Route path="roles/add" element={<ManagerAddRole />} />

          {/* Attendance Tracking (direct link) */}
          <Route path="attendance" element={<AttendanceTracking />} />

          {/* Leave Management */}
          <Route path="leave-approval" element={<LeaveApproval />} />
          <Route path="leave-policy" element={<ManagerLeavePolicy />} />

          {/* Recruitment */}
          <Route path="recruitment" element={<Recruitment />} />

          {/* Secure Vault */}
          <Route path="documents" element={<SecureVault />} />
          <Route path="documents/upload" element={<ManagerUploadDocument />} />

          {/* Settings (direct link) */}
          <Route path="settings" element={<Settings />} />

          <Route path="*" element={<Navigate to="/manager/dashboard" replace />} />
        </Route>

        {/* ================= EMPLOYEE ROUTES ================= */}
        <Route
          path="/employee"
          element={
            <EmployeeRoute user={user}>
              <EmployeeLayout logout={handleLogout} />
            </EmployeeRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<EmployeeHome />} />
          <Route path="attendance" element={<EmployeeHome />} />
          <Route path="tasks" element={<EmployeeHome />} />
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

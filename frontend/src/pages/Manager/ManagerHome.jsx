import React, { useState, useEffect } from "react";
import { 
  FiUsers, FiCalendar, FiClipboard, FiCheckCircle, 
  FiAlertCircle, FiTrendingUp, FiClock
} from "react-icons/fi";
import axios from "axios";
import { useTheme, useThemeClasses } from "../../contexts/ThemeContext";

const ManagerHome = () => {
  const darkMode = useTheme() || false;
  const theme = useThemeClasses();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/dashboard/manager", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${theme.text.primary}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 rounded-lg ${theme.bg.error} ${theme.text.error}`}>
        <p>{error}</p>
      </div>
    );
  }

  const stats = [
    {
      icon: <FiUsers className="w-6 h-6" />,
      label: "Team Size",
      value: dashboardData?.teamSize || 0,
      color: darkMode ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-700",
    },
    {
      icon: <FiCheckCircle className="w-6 h-6" />,
      label: "Present Today",
      value: dashboardData?.presentToday || 0,
      color: darkMode ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-700",
    },
    {
      icon: <FiCalendar className="w-6 h-6" />,
      label: "On Leave Today",
      value: dashboardData?.onLeaveToday || 0,
      color: darkMode ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-700",
    },
    {
      icon: <FiAlertCircle className="w-6 h-6" />,
      label: "Pending Leaves",
      value: dashboardData?.pendingLeaves || 0,
      color: darkMode ? "bg-rose-500/20 text-rose-400" : "bg-rose-100 text-rose-700",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${theme.text.primary} mb-2`}>
          Manager Dashboard
        </h1>
        <p className={theme.text.secondary}>
          {dashboardData?.department && `Department: ${dashboardData.department}`}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`${theme.bg.card} ${theme.border} rounded-xl p-6 border shadow-sm`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <h3 className={`text-3xl font-bold ${theme.text.primary} mb-1`}>
              {stat.value}
            </h3>
            <p className={theme.text.secondary}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Worklogs */}
      <div className={`${theme.bg.card} ${theme.border} rounded-xl p-6 border shadow-sm`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-semibold ${theme.text.primary}`}>
            Recent Team Worklogs
          </h2>
          <FiClipboard className={`w-5 h-5 ${theme.text.secondary}`} />
        </div>
        
        {dashboardData?.recentWorklogs && dashboardData.recentWorklogs.length > 0 ? (
          <div className="space-y-4">
            {dashboardData.recentWorklogs.map((worklog) => (
              <div
                key={worklog.id}
                className={`${theme.bg.secondary} ${theme.border} p-4 rounded-lg border`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${theme.text.primary}`}>
                      {worklog.employee?.fullName || "Unknown"}
                    </p>
                    <p className={`text-sm ${theme.text.secondary} mt-1`}>
                      {worklog.description || "No description"}
                    </p>
                    <p className={`text-xs ${theme.text.muted} mt-1`}>
                      {new Date(worklog.date).toLocaleDateString()} • {worklog.hoursWorked} hours
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs ${
                    darkMode ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-700"
                  }`}>
                    {worklog.employee?.department || "N/A"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-8 ${theme.text.secondary}`}>
            <FiClipboard className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No recent worklogs</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerHome;



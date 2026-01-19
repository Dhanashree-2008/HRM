import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiBell, FiCheck, FiTrash2, FiSettings, FiCalendar, FiUser, FiBriefcase, FiAlertCircle, FiTrendingUp } from "react-icons/fi";
import { useTheme, useThemeClasses } from "../../../contexts/ThemeContext";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const [filter, setFilter] = useState("all");
  const darkMode = useTheme() || false; // Default to false if undefined
  const theme = useThemeClasses();

  const mapType = (t, msg) => {
    if (t === "LEAVE") return "info";
    if (t === "TASK") return "info";
    if (t === "SYSTEM") {
      if (msg && msg.toLowerCase().includes("fail")) return "error";
      return "warning";
    }
    return "info";
  };

  const iconFor = (t) => {
    if (t === "LEAVE") return <FiCalendar className="w-5 h-5" />;
    if (t === "TASK") return <FiBriefcase className="w-5 h-5" />;
    return <FiAlertCircle className="w-5 h-5" />;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const mapped = res.data.map((n) => ({
          id: n.id,
          title: n.title || "Notification",
          message: n.message || "",
          type: mapType(n.type, n.message),
          originalType: n.type,
          createdAt: n.createdAt,
          timestamp: (n.createdAt || "").replace("T", " ").split(".")[0],
          read: !!n.isRead,
          icon: iconFor(n.type),
        }));
        setNotifications(mapped);
      } catch (err) {
        console.error("Load notifications failed:", err);
      }
    };
    load();
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Mark read failed:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch("http://localhost:5000/api/notifications/read-all", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Mark all read failed:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Delete notification failed:", err);
    }
  };

  const clearAll = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/notifications/clear", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications([]);
    } catch (err) {
      console.error("Clear notifications failed:", err);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === "all") return true;
    if (filter === "unread") return !notif.read;
    if (filter === "read") return notif.read;
    if (filter === "error") return notif.type === "error";
    if (filter === "success") return notif.type === "success";
    if (filter === "warning") return notif.type === "warning";
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const todayCount = notifications.filter(n => {
    const d = new Date(n.createdAt);
    const today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  }).length;
  const alertCount = notifications.filter(n => n.originalType === "SYSTEM").length;

  const getTypeColor = (type) => {
    switch (type) {
      case "success": return darkMode ? "from-emerald-400 to-green-500" : "from-emerald-500 to-emerald-600";
      case "error": return darkMode ? "from-rose-400 to-red-500" : "from-rose-500 to-rose-600";
      case "warning": return darkMode ? "from-amber-400 to-orange-500" : "from-amber-500 to-amber-600";
      case "info":
      default: return darkMode ? "from-cyan-400 to-blue-500" : "from-cyan-500 to-blue-600";
    }
  };

  const getTypeBg = (type) => {
    switch (type) {
      case "success": return darkMode ? "bg-emerald-500/10" : "bg-emerald-50";
      case "error": return darkMode ? "bg-rose-500/10" : "bg-rose-50";
      case "warning": return darkMode ? "bg-amber-500/10" : "bg-amber-50";
      case "info":
      default: return darkMode ? "bg-cyan-500/10" : "bg-cyan-50";
    }
  };

  // Helper functions for theme
  const getBgColor = () => darkMode ? "bg-gray-800" : "bg-white";
  const getBorderColor = () => darkMode ? "border-gray-700" : "border-gray-200";
  const getTextColor = () => darkMode ? "text-white" : "text-gray-800";
  const getSecondaryTextColor = () => darkMode ? "text-gray-400" : "text-gray-600";
  const getCardBg = () => darkMode ? "bg-gray-700/50" : "bg-gray-100";
  const getHeaderGradient = () => darkMode ? "from-slate-900 via-purple-900 to-blue-900" : "from-slate-100 via-purple-100 to-blue-100";
  const getHeaderTextColor = () => darkMode ? "text-slate-300" : "text-slate-600";

  return (
    <div className="w-full">
      {/* Header */}
      <div className={`relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-br ${getHeaderGradient()} p-8`}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>

        <div className="relative z-10">
          <h1 className={`text-4xl font-bold ${getTextColor()} mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-300`}>
            Notifications
          </h1>
          <p className={getHeaderTextColor()}>Stay updated with system alerts and important announcements.</p>

          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <FiBell className="w-6 h-6" />, label: "Total", value: notifications.length.toString(), change: "", trend: "neutral", color: darkMode ? "from-cyan-400 to-blue-500" : "from-cyan-500 to-blue-600" },
              { icon: <div className="relative"><FiBell className="w-6 h-6" /><div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full"></div></div>, label: "Unread", value: unreadCount.toString(), change: "", trend: "neutral", color: darkMode ? "from-amber-400 to-orange-500" : "from-amber-500 to-amber-600" },
              { icon: <FiCalendar className="w-6 h-6" />, label: "Today", value: todayCount.toString(), change: "", trend: "neutral", color: darkMode ? "from-emerald-400 to-green-500" : "from-emerald-500 to-emerald-600" },
              { icon: <FiAlertCircle className="w-6 h-6" />, label: "Alerts", value: alertCount.toString(), change: "", trend: "neutral", color: darkMode ? "from-rose-400 to-red-500" : "from-rose-500 to-rose-600" },
            ].map((stat, index) => (
              <div key={index} className="relative group">
                <div className={`absolute -inset-1 bg-gradient-to-r ${darkMode ? 'from-cyan-500 to-purple-500' : 'from-cyan-400 to-purple-400'} rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-1000`}></div>
                <div className={`relative ${darkMode ? 'bg-slate-900/50' : 'bg-white/80'} backdrop-blur-sm border ${getBorderColor()} rounded-xl p-4`}>
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                      {stat.icon}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {stat.trend === "up" ? <FiTrendingUp className="w-4 h-4 text-emerald-400" /> :
                          stat.trend === "down" ? <div className="w-4 h-4 text-rose-400 rotate-90">↓</div> :
                            <div className={`w-4 h-0.5 ${darkMode ? 'bg-slate-400' : 'bg-slate-300'}`}></div>}
                        <span className={`text-sm font-medium ${stat.trend === "up" ? "text-emerald-400" :
                            stat.trend === "down" ? "text-rose-400" :
                              darkMode ? "text-slate-400" : "text-slate-500"
                          }`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h3 className={`text-2xl font-bold ${getTextColor()} mt-4`}>{stat.value}</h3>
                  <p className={getSecondaryTextColor()}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-3">
            <button
              onClick={markAllAsRead}
              className="relative group flex items-center gap-2 px-4 py-2.5"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg blur opacity-0 group-hover:opacity-30"></div>
              <div className={`relative flex items-center gap-2 ${darkMode ? 'bg-slate-800/50' : 'bg-white/80'} backdrop-blur-sm border ${getBorderColor()} px-4 py-2.5 rounded-lg hover:border-emerald-500/30 ${getTextColor()}`}>
                <FiCheck className="w-4 h-4" />
                Mark All as Read
              </div>
            </button>
            <button className="relative group flex items-center gap-2 px-4 py-2.5">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-0 group-hover:opacity-30"></div>
              <div className={`relative flex items-center gap-2 ${darkMode ? 'bg-slate-800/50' : 'bg-white/80'} backdrop-blur-sm border ${getBorderColor()} px-4 py-2.5 rounded-lg hover:border-cyan-500/30 ${getTextColor()}`}>
                <FiSettings className="w-4 h-4" />
                Notification Settings
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`bg-gradient-to-br ${darkMode ? 'from-slate-900 to-slate-800' : 'from-slate-50 to-slate-100'} rounded-2xl p-6 border ${getBorderColor()} mb-6`}>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "All", value: "all", color: darkMode ? "from-cyan-400 to-blue-500" : "from-cyan-500 to-blue-600" },
            { label: "Unread", value: "unread", color: darkMode ? "from-amber-400 to-orange-500" : "from-amber-500 to-amber-600", count: unreadCount },
            { label: "Read", value: "read", color: darkMode ? "from-emerald-400 to-green-500" : "from-emerald-500 to-emerald-600" },
            { label: "Errors", value: "error", color: darkMode ? "from-rose-400 to-red-500" : "from-rose-500 to-rose-600" },
            { label: "Success", value: "success", color: darkMode ? "from-emerald-400 to-green-500" : "from-emerald-500 to-emerald-600" },
            { label: "Warnings", value: "warning", color: darkMode ? "from-amber-400 to-orange-500" : "from-amber-500 to-amber-600" },
          ].map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={`relative group px-4 py-2 rounded-lg font-medium ${filter === btn.value
                  ? `bg-gradient-to-br ${btn.color} text-white`
                  : `${getCardBg()} ${getSecondaryTextColor()} hover:text-purple-600 border ${getBorderColor()} hover:border-purple-500/30`
                }`}
            >
              <div className="flex items-center gap-2">
                {btn.label}
                {btn.count > 0 && (
                  <span className="px-1.5 py-0.5 text-xs bg-rose-500 text-white rounded-full">
                    {btn.count}
                  </span>
                )}
              </div>
            </button>
          ))}
          <button
            onClick={clearAll}
            className={`ml-auto px-4 py-2 border ${darkMode ? 'border-rose-500/30' : 'border-rose-200'} ${darkMode ? 'text-rose-400' : 'text-rose-600'} rounded-lg hover:bg-rose-500/10 font-medium`}
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className={`bg-gradient-to-br ${darkMode ? 'from-slate-900 to-slate-800' : 'from-slate-50 to-slate-100'} rounded-2xl border ${getBorderColor()} overflow-hidden`}>
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-gray-700/10">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-white/5 transition-colors ${!notification.read ? getTypeBg(notification.type) : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getTypeColor(notification.type)} flex items-center justify-center text-white`}>
                    {notification.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-semibold ${getTextColor()}`}>{notification.title}</h4>
                        {!notification.read && (
                          <span className="inline-block w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${getSecondaryTextColor()}`}>
                          {notification.timestamp.split(' ')[0]} • {notification.timestamp.split(' ')[1]}
                        </span>
                      </div>
                    </div>

                    <p className={`${getSecondaryTextColor()} mb-3`}>{notification.message}</p>

                    <div className="flex gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className={`px-3 py-1 text-sm ${darkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'} ${darkMode ? 'text-emerald-400' : 'text-emerald-600'} rounded-lg hover:${darkMode ? 'bg-emerald-500/30' : 'bg-emerald-200'} border ${darkMode ? 'border-emerald-500/30' : 'border-emerald-200'}`}
                        >
                          Mark as Read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className={`px-3 py-1 text-sm ${darkMode ? 'bg-rose-500/20' : 'bg-rose-100'} ${darkMode ? 'text-rose-400' : 'text-rose-600'} rounded-lg hover:${darkMode ? 'bg-rose-500/30' : 'bg-rose-200'} border ${darkMode ? 'border-rose-500/30' : 'border-rose-200'}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${getCardBg()} flex items-center justify-center border ${getBorderColor()}`}>
                <FiBell className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className={`text-lg font-medium ${getTextColor()} mb-2`}>No notifications found</h3>
              <p className={`${getSecondaryTextColor()} mb-4`}>
                {filter === "unread"
                  ? "You have no unread notifications"
                  : "No notifications match your filter criteria"
                }
              </p>
              {filter !== "all" && (
                <button
                  onClick={() => setFilter("all")}
                  className="text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  View all notifications
                </button>
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredNotifications.length > 0 && (
          <div className={`px-6 py-4 border-t ${getBorderColor()} flex items-center justify-between`}>
            <div className={`text-sm ${getSecondaryTextColor()}`}>
              Showing <span className={`font-medium ${getTextColor()}`}>1-{filteredNotifications.length}</span> of{" "}
              <span className={`font-medium ${getTextColor()}`}>{notifications.length}</span> notifications
            </div>
            <div className="flex gap-2">
              <button className={`px-3 py-2 border ${getBorderColor()} rounded-lg hover:bg-white/5 ${getSecondaryTextColor()} disabled:opacity-50`}>
                Previous
              </button>
              <button className={`px-3 py-2 ${darkMode ? 'bg-cyan-500/20' : 'bg-cyan-100'} ${darkMode ? 'text-cyan-400' : 'text-cyan-600'} border ${darkMode ? 'border-cyan-500/30' : 'border-cyan-200'} rounded-lg hover:${darkMode ? 'bg-cyan-500/30' : 'bg-cyan-200'}`}>
                1
              </button>
              <button className={`px-3 py-2 border ${getBorderColor()} rounded-lg hover:bg-white/5 ${getSecondaryTextColor()}`}>
                2
              </button>
              <button className={`px-3 py-2 border ${getBorderColor()} rounded-lg hover:bg-white/5 ${getSecondaryTextColor()}`}>
                3
              </button>
              <button className={`px-3 py-2 border ${getBorderColor()} rounded-lg hover:bg-white/5 ${getSecondaryTextColor()}`}>
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notification Settings Preview */}
      <div className={`bg-gradient-to-br ${darkMode ? 'from-slate-900 to-slate-800' : 'from-slate-50 to-slate-100'} rounded-2xl p-6 border ${getBorderColor()} mt-6`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-bold ${getTextColor()}`}>Notification Settings</h3>
          <button className={`${darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'} font-medium`}>
            Edit Settings
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { type: "Email", enabled: true, count: 42, color: darkMode ? "from-cyan-400 to-blue-500" : "from-cyan-500 to-blue-600" },
            { type: "Push", enabled: true, count: 28, color: darkMode ? "from-emerald-400 to-green-500" : "from-emerald-500 to-emerald-600" },
            { type: "SMS", enabled: false, count: 0, color: darkMode ? "from-rose-400 to-red-500" : "from-rose-500 to-rose-600" },
            { type: "In-App", enabled: true, count: notifications.length, color: darkMode ? "from-purple-400 to-pink-500" : "from-purple-500 to-pink-600" },
          ].map((setting) => (
            <div key={setting.type} className="relative group">
              <div className={`absolute -inset-1 bg-gradient-to-r ${darkMode ? 'from-cyan-500 to-purple-500' : 'from-cyan-400 to-purple-400'} rounded-lg blur opacity-20 group-hover:opacity-30`}></div>
              <div className={`relative ${darkMode ? 'bg-slate-800/50' : 'bg-white/80'} backdrop-blur-sm border ${getBorderColor()} rounded-lg p-4 hover:border-cyan-500/30 transition-colors`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-medium ${getTextColor()}`}>{setting.type}</span>
                  <div className={`w-3 h-3 rounded-full ${setting.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                </div>
                <div className={`text-2xl font-bold ${getTextColor()} mb-1`}>{setting.count}</div>
                <p className={`text-sm ${getSecondaryTextColor()}`}>notifications sent</p>
                <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${setting.color} rounded-full`}
                    style={{ width: `${Math.min((setting.count / 50) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;

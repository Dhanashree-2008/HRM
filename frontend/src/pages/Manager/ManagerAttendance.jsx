import React, { useEffect, useState } from "react";
import axios from "axios";

const ManagerAttendance = () => {
  const [teamLogs, setTeamLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeamLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/worklogs/team", { headers: { Authorization: `Bearer ${token}` } });
      setTeamLogs(res.data || []);
    } catch (err) {
      console.error("Manager attendance error", err);
      alert(err.response?.data?.message || "Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamLogs();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Team Attendance (via Worklogs)</h2>
      <p className="text-sm text-slate-500 mb-4">Showing recent worklogs from your team as a proxy for attendance.</p>

      {loading ? (
        <div>Loading...</div>
      ) : teamLogs.length === 0 ? (
        <div className="text-slate-500">No recent worklogs from team.</div>
      ) : (
        <ul className="space-y-3">
          {teamLogs.map((t) => (
            <li key={t.id} className="p-3 border rounded">
              <div className="text-sm text-slate-500">{t.date} • {t.employee?.fullName ?? 'Unknown'}</div>
              <div className="mt-1">{t.description}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManagerAttendance;

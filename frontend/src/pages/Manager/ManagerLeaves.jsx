import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManagerLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('/api/leave/pending', { headers: { Authorization: `Bearer ${token}` } });
      setLeaves(res.data || []);
    } catch (err) {
      console.error('Failed to load pending', err.message);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const updateStatus = async (id, action) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`/api/leave/${id}/${action}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      alert('Updated');
      fetchPending();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Pending Leave Requests</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-3">
          {leaves.length === 0 && <div>No pending leaves</div>}
          {leaves.map((l) => (
            <div key={l.id} className="p-4 border rounded flex justify-between items-center">
              <div>
                <div className="font-medium">{l.employeeName} ({l.employeeCode || ''})</div>
                <div className="text-sm text-slate-400">{l.leaveType} • {l.fromDate} to {l.toDate}</div>
                <div className="text-sm mt-1">{l.reason}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateStatus(l.id, 'approve')} className="px-3 py-1 bg-emerald-600 text-white rounded">Approve</button>
                <button onClick={() => updateStatus(l.id, 'reject')} className="px-3 py-1 bg-rose-600 text-white rounded">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerLeaves;
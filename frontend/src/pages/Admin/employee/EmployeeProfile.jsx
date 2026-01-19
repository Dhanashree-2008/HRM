import React, { useState, useEffect } from "react"; // Add useEffect import
import { useParams } from "react-router-dom";
import { FiMail, FiPhone, FiCalendar, FiMapPin, FiBriefcase, FiUser, FiDownload, FiEdit2 } from "react-icons/fi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { useTheme, useThemeClasses } from "../../../contexts/ThemeContext";

const EmployeeProfile = () => {
  const { id: routeId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  // Helper to robustly decode JWT payload (base64url safe)
  const decodeJwtPayload = (token) => {
    try {
      const base64Url = token.split('.')[1] || '';
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
      return JSON.parse(atob(padded));
    } catch (e) {
      return null;
    }
  };
  
  const darkMode = useTheme() || false;
  const theme = useThemeClasses();

  const [employee, setEmployee] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null); // show friendly error messages in UI

  // Load current user / employee profile
  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem('token');
      // Prefer route parameter when present (admin viewing other employees)
      let employeeId = routeId || localStorage.getItem('employeeId'); // may be stored on login

      // Try to decode JWT to get employeeId if not stored
      if (!employeeId && token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          employeeId = payload.employeeId || (payload.user && payload.user.employeeId) || null;
          if (employeeId) localStorage.setItem('employeeId', employeeId);
        } catch (e) {
          console.warn('Failed to decode token for employeeId', e);
        }
      }

      if (!token) {
        console.error('No token found');
        setEmployee({});
        return;
      }

      if (!employeeId) {
        // Show placeholder when no employee context is available (e.g., Admin account without employee profile)
        setEmployee({
          employeeId: 'N/A',
          name: 'No Employee Profile',
          jobTitle: 'Please contact admin',
          department: 'N/A',
          email: 'N/A',
          phone: 'N/A',
          status: 'Active',
          joinDate: new Date().toISOString(),
          manager: null,
          location: 'N/A',
          shift: 'N/A',
          employmentType: 'N/A',
          dob: '',
          experience: 'N/A',
          reportsTo: 'N/A',
          avatar: 'https://ui-avatars.com/api/?name=No+Profile&background=Gray&color=fff&size=128',
          id: null,
          resumeUrl: null,
        });
        return;
      }

      try {
        console.log('Fetching employee profile', { routeId, tokenPresent: !!token, employeeId });

        const apiBase = import.meta.env.VITE_API_BASE_URL || '';

        // If a routeId is supplied (admin viewing an employee), call admin endpoint.
        // Otherwise fetch current user (works for EMPLOYEE, MANAGER, ADMIN) and map employee info.
        if (routeId) {
          const empRes = await fetch(`${apiBase}/api/admin/employees/${employeeId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

            if (!empRes.ok) {
            // Read body (try JSON then text) for better diagnostics
            let bodyText;
            try {
              const json = await empRes.json();
              bodyText = JSON.stringify(json);
            } catch (e) {
              bodyText = await empRes.text().catch(() => '<unreadable>');
            }
            console.error('Employee fetch failed:', empRes.status, bodyText);

            // If unauthorized/forbidden, surface a clear permission error for admin-only endpoint
            if (empRes.status === 401 || empRes.status === 403) {
              setErrorMsg('You do not have permission to view this employee. Please sign in with an ADMIN account to view other employees.');
              return;
            }

            // Other errors: surface message for debugging
            setErrorMsg(`Failed to fetch employee: ${empRes.status} ${bodyText}`);
            return;
          }

          const empData = await empRes.json();
          console.log('Employee data received:', empData);

          // Handle different response structures
          const emp = empData.employee || empData.data || empData;
          const userInfo = emp.user || {};

          setEmployee({
            employeeId: emp.employeeCode || `EMP${emp.id}`,
            name: emp.fullName || 'Unknown',
            jobTitle: emp.designation || 'N/A',
            department: emp.department || 'N/A',
            email: userInfo.email || 'N/A',
            phone: emp.phone || 'N/A',
            status: emp.status || 'Active',
            joinDate: emp.dateOfJoining || new Date().toISOString(),
            manager: emp.manager ? emp.manager.fullName : null,
            location: emp.location || 'N/A',
            shift: emp.shift || 'N/A',
            employmentType: emp.employmentType || 'N/A',
            dob: emp.dateOfBirth || '',
            experience: emp.experience || 'N/A',
            reportsTo: emp.manager ? emp.manager.fullName : 'N/A',
            avatar: emp.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.fullName || 'User')}&background=0F172A&color=fff&size=128`,
            id: emp.id,
            resumeUrl: emp.resumeUrl || null,
          });
        } else {
          // Fetch current user and map employee details (works for EMPLOYEE and users who have employee profiles)
          const meRes = await fetch(`${apiBase}/api/auth/getUser`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!meRes.ok) {
            console.error('Failed to fetch current user:', meRes.status);
            throw new Error('Failed to fetch current user');
          }

          const meData = await meRes.json();
          const empObj = meData.employee;

          if (!empObj) {
            // No employee attached to this account
            setEmployee({
              employeeId: 'N/A',
              name: 'No Employee Profile',
              jobTitle: 'Please contact admin',
              department: 'N/A',
              email: meData.email || 'N/A',
              phone: 'N/A',
              status: 'Active',
              joinDate: new Date().toISOString(),
              manager: null,
              location: 'N/A',
              shift: 'N/A',
              employmentType: 'N/A',
              dob: '',
              experience: 'N/A',
              reportsTo: 'N/A',
              avatar: meData.employee?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(meData.username || 'User')}&background=0F172A&color=fff&size=128`,
              id: null,
              resumeUrl: null,
            });
            return;
          }

          setEmployee({
            employeeId: empObj.employeeCode || `EMP${empObj.id}`,
            name: empObj.fullName || 'Unknown',
            jobTitle: empObj.designation || 'N/A',
            department: empObj.department || 'N/A',
            email: meData.email || 'N/A',
            phone: empObj.phone || 'N/A',
            status: empObj.status || 'Active',
            joinDate: empObj.dateOfJoining || new Date().toISOString(),
            manager: empObj.manager ? empObj.manager.fullName : null,
            location: empObj.location || 'N/A',
            shift: empObj.shift || 'N/A',
            employmentType: empObj.employmentType || 'N/A',
            dob: empObj.dateOfBirth || '',
            experience: empObj.experience || 'N/A',
            reportsTo: empObj.manager ? empObj.manager.fullName : 'N/A',
            avatar: empObj.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(empObj.fullName || 'User')}&background=0F172A&color=fff&size=128`,
            id: empObj.id,
            resumeUrl: empObj.resumeUrl || null,
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        setEmployee({
          employeeId: 'ERROR',
          name: 'Error Loading Profile',
          jobTitle: err.message,
          department: 'N/A',
          email: 'N/A',
          phone: 'N/A',
          status: 'Active',
          joinDate: new Date().toISOString(),
          manager: null,
          location: 'N/A',
          shift: 'N/A',
          employmentType: 'N/A',
          dob: '',
          experience: 'N/A',
          reportsTo: 'N/A',
          avatar: 'https://ui-avatars.com/api/?name=Error&background=DC2626&color=fff&size=128',
          id: null,
          resumeUrl: null,
        });
      }
    };

    loadProfile();
  }, [routeId]);

  const leaveBalances = {
    earned: { total: 20, used: 12, remaining: 8 },
    sick: { total: 10, used: 6, remaining: 4 },
    casual: { total: 15, used: 12, remaining: 3 },
  };

  const attendanceStats = {
    present: 22,
    absent: 2,
    late: 1,
    earlyExit: 0,
    overtime: 8,
  };

  const performance = {
    rating: 4.5,
    goals: 8,
    completed: 6,
    pending: 2,
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "attendance", label: "Attendance" },
    { id: "leaves", label: "Leaves" },
    { id: "performance", label: "Performance" },
    { id: "documents", label: "Documents" },
  ];

  // Upload handlers
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const handleProfileUpload = async () => {
    const input = document.getElementById('profile-upload');
    const file = input?.files?.[0];
    if (!file) return alert('Please choose an image first');

    const fd = new FormData();
    fd.append('profile', file);

    const token = localStorage.getItem('token');
    if (!token) return alert('You must be logged in to upload');

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/employees/${employee.id}/upload-profile`, {
        method: 'POST',
        body: fd,
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setEmployee((prev) => ({ ...prev, avatar: data.profileImage }));
        const preview = document.getElementById('profile-preview');
        if (preview) preview.src = data.profileImage;
        alert('Profile uploaded successfully!');
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  const handleResumeUpload = async () => {
    const input = document.getElementById('resume-upload');
    const file = input?.files?.[0];
    if (!file) return alert('Please choose a file first');

    const fd = new FormData();
    fd.append('resume', file);

    const token = localStorage.getItem('token');
    if (!token) return alert('You must be logged in to upload');

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/employees/${employee.id}/upload-resume`, {
        method: 'POST',
        body: fd,
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setEmployee((prev) => ({ ...prev, resumeUrl: data.resumeUrl }));
        const status = document.getElementById('resume-status');
        if (status) status.innerText = 'Resume uploaded — ' + data.resumeUrl;
        alert('Resume uploaded successfully!');
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  // Wire buttons after first render
  useEffect(() => {
    const pbtn = document.getElementById('profile-upload-btn');
    if (pbtn) pbtn.onclick = handleProfileUpload;
    const rbtn = document.getElementById('resume-upload-btn');
    if (rbtn) rbtn.onclick = handleResumeUpload;
  }, [employee]);

  if (!employee) {
    return (
      <div className={`min-h-screen ${theme.bg} ${theme.text} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} p-6`}>
      {/* Error banner */}
      {errorMsg && (
        <div className="mb-4 p-3 rounded bg-rose-100 text-rose-800 border border-rose-200">
          <strong className="mr-2">⚠️ Error:</strong> {errorMsg}
        </div>
      )}

      {/* Profile Header */}
      <div className={`${theme.cardBg} rounded-lg shadow-sm p-6 mb-6`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                id="profile-preview"
                src={employee.avatar}
                alt={employee.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700"
              >
                <FiEdit2 className="w-4 h-4" />
              </label>
              <input
                type="file"
                id="profile-upload"
                accept="image/*"
                className="hidden"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{employee.name}</h1>
              <p className={theme.subtext}>{employee.jobTitle}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="flex items-center text-sm">
                  <HiOutlineOfficeBuilding className="mr-1" />
                  {employee.department}
                </span>
                <span className="flex items-center text-sm">
                  <FiMapPin className="mr-1" />
                  {employee.location}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  employee.status === 'Active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {employee.status}
                </span>
              </div>
            </div>
          </div>
          <button
            id="profile-upload-btn"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Upload Profile
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className={`${theme.cardBg} p-4 rounded-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={theme.subtext}>Employee ID</p>
              <p className="text-xl font-semibold">{employee.employeeId}</p>
            </div>
            <FiUser className="text-blue-600 text-2xl" />
          </div>
        </div>
        <div className={`${theme.cardBg} p-4 rounded-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={theme.subtext}>Join Date</p>
              <p className="text-xl font-semibold">
                {new Date(employee.joinDate).toLocaleDateString()}
              </p>
            </div>
            <FiCalendar className="text-green-600 text-2xl" />
          </div>
        </div>
        <div className={`${theme.cardBg} p-4 rounded-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={theme.subtext}>Employment Type</p>
              <p className="text-xl font-semibold">{employee.employmentType}</p>
            </div>
            <FiBriefcase className="text-purple-600 text-2xl" />
          </div>
        </div>
        <div className={`${theme.cardBg} p-4 rounded-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={theme.subtext}>Reports To</p>
              <p className="text-xl font-semibold">{employee.reportsTo || 'N/A'}</p>
            </div>
            <HiOutlineOfficeBuilding className="text-orange-600 text-2xl" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`${theme.cardBg} rounded-lg shadow-sm`}>
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <FiMail className="text-gray-400" />
                    <div>
                      <p className={theme.subtext}>Email</p>
                      <p>{employee.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FiPhone className="text-gray-400" />
                    <div>
                      <p className={theme.subtext}>Phone</p>
                      <p>{employee.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Work Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className={theme.subtext}>Shift</p>
                    <p>{employee.shift}</p>
                  </div>
                  <div>
                    <p className={theme.subtext}>Experience</p>
                    <p>{employee.experience}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Documents</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Resume</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        id="resume-upload"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                      />
                      <label
                        htmlFor="resume-upload"
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        Choose File
                      </label>
                      <button
                        id="resume-upload-btn"
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                      >
                        Upload
                      </button>
                      {employee.resumeUrl && (
                        <a
                          href={employee.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline flex items-center"
                        >
                          <FiDownload className="mr-1" />
                          Download
                        </a>
                      )}
                    </div>
                  </div>
                  <p id="resume-status" className="text-sm text-gray-500">
                    {employee.resumeUrl ? `Resume available: ${employee.resumeUrl}` : 'No resume uploaded'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "attendance" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Attendance Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className={`${theme.cardBg} p-4 rounded-lg border`}>
                  <p className="text-2xl font-bold text-green-600">{attendanceStats.present}</p>
                  <p className={theme.subtext}>Present</p>
                </div>
                <div className={`${theme.cardBg} p-4 rounded-lg border`}>
                  <p className="text-2xl font-bold text-red-600">{attendanceStats.absent}</p>
                  <p className={theme.subtext}>Absent</p>
                </div>
                <div className={`${theme.cardBg} p-4 rounded-lg border`}>
                  <p className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</p>
                  <p className={theme.subtext}>Late</p>
                </div>
                <div className={`${theme.cardBg} p-4 rounded-lg border`}>
                  <p className="text-2xl font-bold text-orange-600">{attendanceStats.earlyExit}</p>
                  <p className={theme.subtext}>Early Exit</p>
                </div>
                <div className={`${theme.cardBg} p-4 rounded-lg border`}>
                  <p className="text-2xl font-bold text-blue-600">{attendanceStats.overtime}</p>
                  <p className={theme.subtext}>Overtime</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "leaves" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Leave Balance</h3>
              <div className="space-y-4">
                {Object.entries(leaveBalances).map(([type, balance]) => (
                  <div key={type} className={`${theme.cardBg} p-4 rounded-lg border`}>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold capitalize">{type} Leave</h4>
                      <span className="text-sm">
                        {balance.remaining} / {balance.total} remaining
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(balance.remaining / balance.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "performance" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className={`${theme.cardBg} p-4 rounded-lg border`}>
                  <p className="text-2xl font-bold text-yellow-500">{performance.rating}</p>
                  <p className={theme.subtext}>Rating</p>
                </div>
                <div className={`${theme.cardBg} p-4 rounded-lg border`}>
                  <p className="text-2xl font-bold">{performance.goals}</p>
                  <p className={theme.subtext}>Total Goals</p>
                </div>
                <div className={`${theme.cardBg} p-4 rounded-lg border`}>
                  <p className="text-2xl font-bold text-green-600">{performance.completed}</p>
                  <p className={theme.subtext}>Completed</p>
                </div>
                <div className={`${theme.cardBg} p-4 rounded-lg border`}>
                  <p className="text-2xl font-bold text-orange-600">{performance.pending}</p>
                  <p className={theme.subtext}>Pending</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Documents & Certificates</h3>
              <p className={theme.subtext}>Document management coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
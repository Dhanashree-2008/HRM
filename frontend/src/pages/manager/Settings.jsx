// src/pages/manager/Settings.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Save,
  Mail,
  Phone,
  Building,
  Calendar
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useOutletContext();

  const themeColors = isDarkMode ? {
    primary: '#8b5cf6',
    accent: '#3b82f6',
    background: '#0f172a',
    card: '#1e293b',
    text: '#f9fafb',
    muted: '#9ca3af',
    border: '#374151',
    hover: 'rgba(59,130,246,0.1)',
  } : {
    primary: '#2563eb',
    accent: '#2563eb',
    background: '#f8fafc',
    card: '#ffffff',
    text: '#1e293b',
    muted: '#64748b',
    border: '#e2e8f0',
    hover: '#f1f5f9',
  };

  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    joiningDate: '',
    bio: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/auth/getUser', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data) {
          const { email, employee } = res.data;
          setProfileData(prev => ({
            ...prev,
            email: email || '',
            name: employee?.fullName || '',
            phone: employee?.phone || '',
            department: employee?.department || '',
            position: employee?.designation || '',
            joiningDate: employee?.dateOfJoining || '',
          }));
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        department: profileData.department,
        position: profileData.position,
        joiningDate: profileData.joiningDate,
      };

      await axios.put('/api/auth/profile', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Settings saved successfully!');
    } catch (err) {
      console.error("Failed to save settings", err);
      alert(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${themeColors.accent}, ${themeColors.primary})`
                  }}
                >
                  {profileData.name ? profileData.name.substring(0, 2).toUpperCase() : 'MU'}
                </div>
                <button
                  className="absolute bottom-0 right-0 p-2 rounded-full border"
                  style={{
                    backgroundColor: themeColors.card,
                    borderColor: themeColors.border
                  }}
                >
                  <User size={16} style={{ color: themeColors.muted }} />
                </button>
              </div>

              <div>
                <h3 className="text-xl font-bold" style={{ color: themeColors.text }}>
                  {profileData.name}
                </h3>
                <p style={{ color: themeColors.muted }}>
                  {profileData.position || 'Employee'}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm" style={{ color: themeColors.muted }}>
                  <span className="flex items-center gap-1">
                    <Building size={12} />
                    {profileData.department || 'No Dept'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    Joined {profileData.joiningDate || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'name', label: 'Full Name', icon: User, type: 'text' },
                { name: 'email', label: 'Email Address', icon: Mail, type: 'email' },
                { name: 'phone', label: 'Phone Number', icon: Phone, type: 'tel' },
                { name: 'department', label: 'Department', icon: Building, type: 'text' },
                { name: 'position', label: 'Position', icon: Building, type: 'text' },
                { name: 'joiningDate', label: 'Joining Date', icon: Calendar, type: 'date' },
              ].map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text }}>
                    <field.icon size={14} className="inline mr-1" />
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={profileData[field.name]}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: themeColors.card,
                      color: themeColors.text,
                      border: `1px solid ${themeColors.border}`
                    }}
                  />
                </div>
              ))}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text }}>
                  Bio / Description
                </label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleProfileChange}
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: themeColors.card,
                    color: themeColors.text,
                    border: `1px solid ${themeColors.border}`
                  }}
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6" style={{ backgroundColor: themeColors.background }}>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/manager/dashboard')}
            className="p-2 rounded-lg"
            style={{ backgroundColor: themeColors.hover }}
          >
            <ArrowLeft size={20} style={{ color: themeColors.muted }} />
          </button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: themeColors.text }}>Settings</h1>
            <p style={{ color: themeColors.muted }}>Manage your account and system preferences</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div
              className="rounded-xl shadow-sm p-6"
              style={{
                backgroundColor: themeColors.card,
                border: `1px solid ${themeColors.border}`
              }}
            >
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: activeTab === tab.id ? themeColors.hover : 'transparent',
                    color: activeTab === tab.id ? themeColors.accent : themeColors.text
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}

              <div className="mt-8 pt-6 border-t" style={{ borderColor: themeColors.border }}>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 text-white"
                  style={{
                    backgroundColor: saving ? themeColors.border : themeColors.primary
                  }}
                >
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>

                <button
                  onClick={() => navigate('/manager/dashboard')}
                  className="w-full mt-3 py-3 rounded-lg"
                  style={{
                    border: `1px solid ${themeColors.border}`,
                    color: themeColors.text
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div
              className="rounded-xl shadow-sm p-6"
              style={{
                backgroundColor: themeColors.card,
                border: `1px solid ${themeColors.border}`
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: themeColors.hover }}
                >
                  {tabs.find(t => t.id === activeTab)?.icon}
                </div>
                <div>
                  <h2 className="text-lg font-semibold" style={{ color: themeColors.text }}>
                    {tabs.find(t => t.id === activeTab)?.label || 'Settings'}
                  </h2>
                  <p className="text-sm" style={{ color: themeColors.muted }}>
                    Configure your {activeTab} settings
                  </p>
                </div>
              </div>

              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

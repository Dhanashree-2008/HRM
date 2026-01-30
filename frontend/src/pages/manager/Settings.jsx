// src/pages/manager/Settings.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {profileData.name ? profileData.name.substring(0, 2).toUpperCase() : 'MU'}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-sm border border-slate-200">
                  <User size={16} className="text-slate-600" />
                </button>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">{profileData.name}</h3>
                <p className="text-slate-600">{profileData.position || 'Employee'}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
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
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <User size={14} className="inline mr-1" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Mail size={14} className="inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Phone size={14} className="inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Building size={14} className="inline mr-1" />
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={profileData.department}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Position
                </label>
                <input
                  type="text"
                  name="position"
                  value={profileData.position}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={14} className="inline mr-1" />
                  Joining Date
                </label>
                <input
                  type="date"
                  name="joiningDate"
                  value={profileData.joiningDate}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Bio / Description
                </label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleProfileChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/manager/dashboard')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
            <p className="text-slate-600">Manage your account and system preferences</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Settings Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 lg:mb-0">
              <nav className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                        : 'text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    <div className={activeTab === tab.id ? 'text-blue-600' : 'text-slate-500'}>
                      {tab.icon}
                    </div>
                    {tab.label}
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${saving
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate('/manager/dashboard')}
                  className="w-full mt-3 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-blue-100">
                  {tabs.find(t => t.id === activeTab)?.icon}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">
                    {tabs.find(t => t.id === activeTab)?.label || 'Settings'}
                  </h2>
                  <p className="text-sm text-slate-600">
                    Configure your {activeTab.toLowerCase()} settings
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
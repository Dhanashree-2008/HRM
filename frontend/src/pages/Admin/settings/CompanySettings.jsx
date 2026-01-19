import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiSave,
  FiUpload,
  FiCheck
} from "react-icons/fi";
import { useTheme, useThemeClasses } from "../../../contexts/ThemeContext";
import { uploadImage } from "../../../services/cloudinary.service";

const CompanySettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const darkMode = useTheme() || false; // Default to false if undefined
  const theme = useThemeClasses();

  const [settings, setSettings] = useState({
    general: {
      companyName: "LiteHR Solutions",
      companyEmail: "info@litehr.com",
      phone: "+1 (555) 123-4567",
      address: "123 Tech Street, Silicon Valley, CA 94000",
      website: "www.litehr.com",
      foundedYear: "2023",
      logo: null,
    },
    workingHours: {
      startTime: "09:00",
      endTime: "18:00",
      breakDuration: "60",
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      overtimeRate: "1.5x",
      gracePeriod: "15",
    },
  });



  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/settings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data) {
        setSettings(prev => ({
          ...prev,
          general: res.data.general || prev.general,
          workingHours: res.data.workingHours || prev.workingHours,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch settings", err);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put("/api/settings", settings, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsEditing(false);
      alert("Settings saved successfully!");
    } catch (err) {
      console.error("Failed to save settings", err);
      alert("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset settings to original if needed
  };

  const handleChange = (category, field, value) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [field]: value
      }
    });
  };



  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }
      // Basic type validation
      if (!file.type.startsWith('image/')) {
        alert("File must be an image");
        return;
      }

      try {
        setLoading(true);
        const imageUrl = await uploadImage(file);

        setSettings(prev => ({
          ...prev,
          general: {
            ...prev.general,
            logo: imageUrl
          }
        }));
      } catch (error) {
        console.error("Logo upload failed:", error);
        alert("Failed to upload logo: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Helper functions for theme
  const getBgColor = () => darkMode ? "bg-gray-800" : "bg-white";
  const getBorderColor = () => darkMode ? "border-gray-700" : "border-gray-200";
  const getTextColor = () => darkMode ? "text-white" : "text-gray-800";
  const getSecondaryTextColor = () => darkMode ? "text-gray-400" : "text-gray-600";
  const getInputBg = () => darkMode ? "bg-gray-900" : "bg-gray-50";
  const getCardBg = () => darkMode ? "bg-gray-700/50" : "bg-gray-100";

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${getTextColor()} mb-2`}>
            Company Settings
          </h1>
          <p className={getSecondaryTextColor()}>
            Manage company information, working hours, holidays, and security settings.
          </p>
        </div>

        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className={`px-4 py-2.5 ${getInputBg()} border ${getBorderColor()} ${getSecondaryTextColor()} rounded-lg hover:border-rose-500 hover:text-rose-300 font-medium transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                <FiSave className="w-4 h-4" />
                Save All Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Edit Settings
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className={`flex flex-wrap gap-2 ${getBgColor()} p-1 rounded-lg w-fit border ${getBorderColor()}`}>
          {["general", "hours"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-md text-sm font-medium capitalize transition-all ${activeTab === tab
                ? "bg-purple-600 text-white"
                : `${getSecondaryTextColor()} hover:text-purple-600 hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`
                }`}
            >
              {tab === "general" ? "Company Info" : "Working Hours"}
            </button>
          ))}
        </div>
      </div>

      {/* General Settings */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <div className={`${getBgColor()} rounded-xl p-6 border ${getBorderColor()} shadow-sm`}>
            <h3 className={`text-xl font-semibold ${getTextColor()} mb-6`}>Company Information</h3>

            {/* Logo Upload */}
            <div className="mb-8">
              <label className={`block text-sm font-medium ${getTextColor()} mb-4`}>
                Company Logo
              </label>
              <div className="flex items-center gap-6">
                <div className={`w-32 h-32 rounded-lg border-2 border-dashed ${getBorderColor()} flex items-center justify-center overflow-hidden ${getInputBg()}`}>
                  {settings.general.logo ? (
                    <img
                      src={settings.general.logo}
                      alt="Company Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <FiUpload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <span className={`text-sm ${getSecondaryTextColor()}`}>Upload Logo</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label className={`inline-flex items-center gap-2 px-4 py-3 rounded-lg cursor-pointer ${isEditing
                    ? `${getInputBg()} border ${getBorderColor()} ${getSecondaryTextColor()} hover:border-purple-500 hover:text-purple-600`
                    : `${getInputBg()}/50 border ${getBorderColor()} text-gray-500 cursor-not-allowed`
                    } transition-colors`}>
                    <FiUpload className="w-5 h-5" />
                    {isEditing ? "Change Logo" : "View Logo"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      disabled={!isEditing}
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    Recommended: 500x500px, PNG or JPG, max 2MB
                  </p>
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(settings.general)
                .filter(([key]) => key !== 'logo')
                .map(([key, value]) => (
                  <div key={key}>
                    <label className={`block text-sm font-medium ${getSecondaryTextColor()} mb-2 capitalize`}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleChange("general", key, e.target.value)}
                        className={`w-full px-4 py-3 ${getInputBg()} border ${getBorderColor()} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${getTextColor()} placeholder-gray-400 transition-all`}
                      />
                    ) : (
                      <div className={`px-4 py-3 ${getInputBg()} rounded-lg border ${getBorderColor()}`}>
                        <span className={getTextColor()}>{value}</span>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Working Hours */}
      {activeTab === "hours" && (
        <div className="space-y-6">
          <div className={`${getBgColor()} rounded-xl p-6 border ${getBorderColor()} shadow-sm`}>
            <h3 className={`text-xl font-semibold ${getTextColor()} mb-6`}>Working Hours Configuration</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(settings.workingHours)
                .filter(([key]) => !Array.isArray(settings.workingHours[key]))
                .map(([key, value]) => (
                  <div key={key}>
                    <label className={`block text-sm font-medium ${getSecondaryTextColor()} mb-2 capitalize`}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    {isEditing ? (
                      key.includes('Time') ? (
                        <input
                          type="time"
                          value={value}
                          onChange={(e) => handleChange("workingHours", key, e.target.value)}
                          className={`w-full px-4 py-3 ${getInputBg()} border ${getBorderColor()} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${getTextColor()} transition-all`}
                        />
                      ) : (
                        <input
                          type={key.includes('Rate') ? "text" : "number"}
                          value={value}
                          onChange={(e) => handleChange("workingHours", key, e.target.value)}
                          className={`w-full px-4 py-3 ${getInputBg()} border ${getBorderColor()} rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${getTextColor()} transition-all`}
                        />
                      )
                    ) : (
                      <div className={`px-4 py-3 ${getInputBg()} rounded-lg border ${getBorderColor()}`}>
                        <span className={getTextColor()}>
                          {key.includes('Time') ? value :
                            key.includes('Duration') ? `${value} minutes` :
                              key.includes('Period') ? `${value} minutes` :
                                value}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Working Days */}
            <div className="mt-6">
              <label className={`block text-sm font-medium ${getSecondaryTextColor()} mb-2`}>
                Working Days
              </label>
              <div className="flex flex-wrap gap-3">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => {
                  const isSelected = settings.workingHours.workingDays.includes(day);
                  return (
                    <label key={day} className="flex items-center gap-2 cursor-pointer">
                      {isEditing ? (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleChange("workingHours", "workingDays", [...settings.workingHours.workingDays, day]);
                            } else {
                              handleChange("workingHours", "workingDays", settings.workingHours.workingDays.filter(d => d !== day));
                            }
                          }}
                          className={`rounded ${getBorderColor()} ${getInputBg()} text-purple-500 focus:ring-purple-500/20`}
                          disabled={!isEditing}
                        />
                      ) : (
                        <div className={`w-5 h-5 border rounded flex items-center justify-center ${isSelected ? 'bg-purple-600 border-purple-500/50' : `${getInputBg()} ${getBorderColor()}`
                          }`}>
                          {isSelected && <FiCheck className="w-3 h-3 text-white" />}
                        </div>
                      )}
                      <span className={`font-medium ${isSelected ? getTextColor() : getSecondaryTextColor()
                        }`}>
                        {day}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Schedule Summary */}
          <div className={`${darkMode ? 'bg-purple-900/30' : 'bg-purple-50'} border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'} rounded-xl p-6`}>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-purple-300' : 'text-purple-700'} mb-4`}>Schedule Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`${darkMode ? 'bg-gray-900/50' : 'bg-white/80'} backdrop-blur-sm p-4 rounded-xl border ${getBorderColor()}`}>
                <p className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>Weekly Working Hours</p>
                <p className={`text-2xl font-bold ${getTextColor()}`}>40 hours</p>
              </div>
              <div className={`${darkMode ? 'bg-gray-900/50' : 'bg-white/80'} backdrop-blur-sm p-4 rounded-xl border ${getBorderColor()}`}>
                <p className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>Daily Working Hours</p>
                <p className={`text-2xl font-bold ${getTextColor()}`}>8 hours</p>
              </div>
              <div className={`${darkMode ? 'bg-gray-900/50' : 'bg-white/80'} backdrop-blur-sm p-4 rounded-xl border ${getBorderColor()}`}>
                <p className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>Working Days per Week</p>
                <p className={`text-2xl font-bold ${getTextColor()}`}>5 days</p>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Save/Cancel Buttons */}
      {
        isEditing && (
          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className={`px-6 py-3 ${getInputBg()} border ${getBorderColor()} ${getSecondaryTextColor()} rounded-lg hover:border-rose-500 hover:text-rose-300 font-medium transition-colors`}
            >
              Discard Changes
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              <FiSave className="w-5 h-5" />
              Save All Settings
            </button>
          </div>
        )
      }
    </div >
  );
};

export default CompanySettings;
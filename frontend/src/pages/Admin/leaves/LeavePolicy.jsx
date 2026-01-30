import React, { useState, useEffect } from "react";
import { FiSave, FiEdit2, FiCheck, FiX, FiCalendar, FiInfo, FiClock, FiActivity, FiUsers } from "react-icons/fi";
import { useTheme, getThemeClasses } from "../../../contexts/ThemeContext";
import { toast } from "react-hot-toast";
import leavePolicyService from "../../../services/leavePolicyService";

const LeavePolicy = () => {
  const darkMode = useTheme();
  const theme = getThemeClasses(darkMode);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Theme Helpers
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const cardBorder = darkMode ? 'border-gray-700' : 'border-gray-200';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const inputBg = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const inputBorder = darkMode ? 'border-gray-700' : 'border-gray-300';
  const hoverBg = darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100';

  // Default structure
  const [formData, setFormData] = useState({
    earnedLeave: {
      id: null,
      code: 'EL',
      name: 'Earned Leave',
      totalDays: 20,
      accrualRate: "1.67 days/month",
      maxAccumulation: 60,
      noticePeriod: "7 days",
      documentation: "Not required",
    },
    sickLeave: {
      id: null,
      code: 'SL',
      name: 'Sick Leave',
      totalDays: 12,
      maxPerIncident: 3,
      documentation: "Medical certificate required",
      noticePeriod: "Immediate",
    },
    casualLeave: {
      id: null,
      code: 'CL',
      name: 'Casual Leave',
      totalDays: 15,
      maxConsecutive: 3,
      noticePeriod: "1 day",
      documentation: "Not required for 1 day",
    },
    maternityLeave: {
      id: null,
      code: 'ML',
      name: 'Maternity Leave',
      totalDays: 180,
      paidDays: 84,
      eligibility: "1 year of service",
      documentation: "Medical certificate required",
    },
    paternityLeave: {
      id: null,
      code: 'PL',
      name: 'Paternity Leave',
      totalDays: 7,
      paidDays: 7,
      eligibility: "6 months of service",
      documentation: "Birth certificate required",
    },
    bereavementLeave: {
      id: null,
      code: 'BL',
      name: 'Bereavement Leave',
      totalDays: 5,
      paidDays: 3,
      relationships: ["Spouse", "Parents", "Children", "Siblings"],
      documentation: "Death certificate required",
    },
  });

  const [workingHours, setWorkingHours] = useState({
    startTime: "09:00",
    endTime: "18:00",
    breakTime: "60",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    overtimeRate: "1.5x",
  });

  useEffect(() => {
    fetchPolicy();
  }, []);

  const fetchPolicy = async () => {
    try {
      setLoading(true);
      const data = await leavePolicyService.getLeavePolicy();

      if (data && data.length > 0) {
        setFormData(prev => {
          const newData = { ...prev };
          data.forEach(policy => {
            // Map backend policy to frontend key based on code
            const key = Object.keys(newData).find(k => newData[k].code === policy.code);
            if (key) {
              newData[key] = {
                ...newData[key],
                id: policy.id,
                totalDays: policy.yearlyLimit,
                accrualRate: policy.accrualRate ? `${policy.accrualRate} days/month` : newData[key].accrualRate,
                maxAccumulation: policy.maxAccumulation,
                noticePeriod: policy.minNoticeDays ? `${policy.minNoticeDays} days` : newData[key].noticePeriod,
                documentation: policy.requireDocumentation ? "Required" : "Not required"
              };
            }
          });
          return newData;
        });
      }
    } catch (error) {
      console.error("Error fetching policy:", error);
      toast.error("Failed to load leave policy");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const promises = Object.values(formData).map(async (policy) => {
        const payload = {
          name: policy.name,
          code: policy.code,
          yearlyLimit: policy.totalDays,
          accrualRate: parseFloat(policy.accrualRate) || 0,
          minNoticeDays: parseInt(policy.noticePeriod) || 0,
          maxAccumulation: policy.maxAccumulation,
          checkAvailability: true,
        };

        if (policy.id) {
          return leavePolicyService.updateLeaveTypePolicy(policy.id, payload);
        } else {
          return leavePolicyService.createLeaveType(payload);
        }
      });

      await Promise.all(promises);
      toast.success("Leave policy updated successfully");
      setIsEditing(false);
      fetchPolicy();
    } catch (error) {
      console.error("Error saving policy:", error);
      toast.error("Failed to save leave policy");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchPolicy();
  };

  const handleChange = (leaveType, field, value) => {
    setFormData({
      ...formData,
      [leaveType]: {
        ...formData[leaveType],
        [field]: value
      }
    });
  };

  const handleWorkingHoursChange = (field, value) => {
    setWorkingHours({
      ...workingHours,
      [field]: value
    });
  };

  // --- Helper Components ---

  const PolicyField = ({ label, value, onChange, type = "text", isList = false }) => {
    if (isList) {
      return (
        <div className="flex flex-col gap-2">
          <label className={`text-xs uppercase tracking-wider font-semibold ${textSecondary}`}>
            {label}
          </label>
          {isEditing ? (
            <textarea
              value={Array.isArray(value) ? value.join(', ') : value}
              onChange={(e) => onChange(e.target.value.split(', '))}
              className={`w-full px-4 py-3 ${inputBg} border ${inputBorder} ${textPrimary} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all`}
              rows="2"
            />
          ) : (
            <div className={`text-base font-medium ${textPrimary} py-1`}>
              {Array.isArray(value) ? value.join(', ') : value}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        <label className={`text-xs uppercase tracking-wider font-semibold ${textSecondary}`}>
          {label}
        </label>
        {isEditing ? (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-3 ${inputBg} border ${inputBorder} ${textPrimary} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all`}
          />
        ) : (
          <div className={`text-base font-medium ${textPrimary} py-1`}>
            {value}
          </div>
        )}
      </div>
    );
  };

  const LeaveCard = ({ title, description, icon: Icon, data, typeKey, colorClass }) => {
    return (
      <div className={`${cardBg} rounded-xl border ${cardBorder} overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200`}>
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-800'}`} />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${textPrimary}`}>{title}</h3>
              <p className={`text-sm ${textSecondary}`}>{description}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-opacity-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            {Object.entries(data)
              .filter(([key]) => !['id', 'code', 'name'].includes(key))
              .map(([key, value]) => (
                <PolicyField
                  key={key}
                  label={key.replace(/([A-Z])/g, ' $1').trim()}
                  value={value}
                  onChange={(val) => handleChange(typeKey, key, val)}
                  isList={key === 'relationships'}
                />
              ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className={`text-3xl font-bold ${textPrimary} tracking-tight`}>
            Leave Policy
          </h1>
          <p className={`mt-2 ${textSecondary} text-lg`}>
            Manage leave allocations, rules, and working hours.
          </p>
        </div>

        <div className="flex gap-3 self-end md:self-auto">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className={`flex items-center gap-2 px-5 py-2.5 ${inputBg} border ${inputBorder} ${textPrimary} rounded-lg ${hoverBg} font-medium transition-colors`}
              >
                <FiX className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-sm transition-all hover:shadow md:w-auto"
              >
                <FiSave className="w-4 h-4" />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-sm transition-all hover:shadow"
            >
              <FiEdit2 className="w-4 h-4" />
              Edit Policy
            </button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="space-y-10">
        
        {/* Working Hours Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <FiClock className={`w-5 h-5 ${textSecondary}`} />
            <h2 className={`text-xl font-semibold ${textPrimary}`}>Working Hours & Schedule</h2>
          </div>
          
          <div className={`${cardBg} rounded-xl border ${cardBorder} p-8 shadow-sm`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <PolicyField 
                label="Start Time" 
                value={workingHours.startTime} 
                onChange={(val) => handleWorkingHoursChange("startTime", val)} 
                type="time" 
              />
              <PolicyField 
                label="End Time" 
                value={workingHours.endTime} 
                onChange={(val) => handleWorkingHoursChange("endTime", val)} 
                type="time" 
              />
              <PolicyField 
                label="Break Duration (mins)" 
                value={workingHours.breakTime} 
                onChange={(val) => handleWorkingHoursChange("breakTime", val)} 
                type="number" 
              />
              <PolicyField 
                label="Overtime Rate" 
                value={workingHours.overtimeRate} 
                onChange={(val) => handleWorkingHoursChange("overtimeRate", val)} 
              />
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
              <label className={`block text-xs uppercase tracking-wider font-semibold ${textSecondary} mb-4`}>
                Working Days
              </label>
              <div className="flex flex-wrap gap-4">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => {
                  const isSelected = workingHours.workingDays.includes(day);
                  return (
                    <label key={day} className={`
                      relative flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all
                      ${isSelected 
                        ? 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-700' 
                        : `${inputBg} ${inputBorder} opacity-60 hover:opacity-100`
                      }
                    `}>
                      {isEditing && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleWorkingHoursChange("workingDays", [...workingHours.workingDays, day]);
                            } else {
                              handleWorkingHoursChange("workingDays", workingHours.workingDays.filter(d => d !== day));
                            }
                          }}
                          className="sr-only" 
                        />
                      )}
                      
                      <div className={`
                        w-5 h-5 rounded-full flex items-center justify-center border transition-colors
                        ${isSelected ? 'bg-purple-600 border-purple-600' : 'border-gray-400 bg-transparent'}
                      `}>
                        {isSelected && <FiCheck className="w-3 h-3 text-white" />}
                      </div>
                      
                      <span className={`font-medium ${isSelected ? 'text-purple-700 dark:text-purple-300' : textSecondary}`}>
                        {day}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Standard Leaves Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <FiActivity className={`w-5 h-5 ${textSecondary}`} />
            <h2 className={`text-xl font-semibold ${textPrimary}`}>Standard Leave Types</h2>
          </div>
          
          <div className="space-y-6">
            <LeaveCard 
              title="Earned Leave / Privilege Leave" 
              description="Annual paid leave accrued monthly based on service duration."
              icon={FiCalendar}
              data={formData.earnedLeave}
              typeKey="earnedLeave"
              colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            />
            
            <LeaveCard 
              title="Sick Leave" 
              description="Medical leave for health-related issues. Documentation required for extended periods."
              icon={FiActivity}
              data={formData.sickLeave}
              typeKey="sickLeave"
              colorClass="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            />

            <LeaveCard 
              title="Casual Leave" 
              description="Short-term personal leave for unforeseen circumstances."
              icon={FiClock}
              data={formData.casualLeave}
              typeKey="casualLeave"
              colorClass="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
            />
          </div>
        </section>

        {/* Special Leaves Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <FiUsers className={`w-5 h-5 ${textSecondary}`} />
            <h2 className={`text-xl font-semibold ${textPrimary}`}>Special Leave Types</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LeaveCard 
              title="Maternity Leave" 
              description="Leave for expectant mothers."
              icon={FiUsers}
              data={formData.maternityLeave}
              typeKey="maternityLeave"
              colorClass="bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400"
            />

            <LeaveCard 
              title="Paternity Leave" 
              description="Leave for new fathers."
              icon={FiUsers}
              data={formData.paternityLeave}
              typeKey="paternityLeave"
              colorClass="bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400"
            />

            <LeaveCard 
              title="Bereavement Leave" 
              description="Leave for grieving the loss of a family member."
              icon={FiUsers}
              data={formData.bereavementLeave}
              typeKey="bereavementLeave"
              colorClass="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
            />
          </div>
        </section>

        {/* Guidelines Footer */}
        <div className={`${cardBg} rounded-xl p-8 border ${cardBorder} flex items-start gap-4`}>
          <FiInfo className={`w-6 h-6 flex-shrink-0 ${darkMode ? 'text-purple-400' : 'text-purple-600'} mt-1`} />
          <div>
            <h3 className={`text-lg font-semibold ${textPrimary} mb-3`}>Policy Guidelines & Notes</h3>
            <ul className={`space-y-2 ${textSecondary} text-sm list-disc pl-4`}>
              <li>All leave requests must be submitted at least {formData.earnedLeave.noticePeriod} in advance (except for sick/emergency leave).</li>
              <li>Unused leave can be carried forward up to {formData.earnedLeave.maxAccumulation} days (for earned leave only).</li>
              <li>Medical certificate is mandatory for sick leave beyond {formData.sickLeave.maxPerIncident} consecutive days.</li>
              <li>Leave balance is updated on the 1st of every month.</li>
              <li>All policies are subject to management discretion and business requirements.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LeavePolicy;

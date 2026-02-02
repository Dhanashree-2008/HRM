// src/pages/manager/LeavePolicy.jsx
import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Edit2,
  Save,
  Plus,
  X,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Shield,
} from 'lucide-react';

const LeavePolicy = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useOutletContext();
  const [isEditing, setIsEditing] = useState(false);

  // Theme definition
  const themeColors = isDarkMode ? {
    primary: '#8b5cf6',      // Purple
    secondary: '#10b981',    // Green
    accent: '#3b82f6',       // Blue
    warning: '#f59e0b',      // Amber
    danger: '#ef4444',       // Red
    background: '#0f172a',   // Dark background
    card: '#1e293b',         // Dark card
    text: '#f9fafb',         // Light text
    muted: '#9ca3af',        // Muted text
    border: '#374151',       // Border color
    inputBg: '#1e293b',      // Input background
    hover: 'rgba(59, 130, 246, 0.1)', // Hover state
  } : {
    primary: '#2563eb',      // Blue
    secondary: '#10b981',    // Green
    accent: '#8b5cf6',       // Purple
    warning: '#f59e0b',      // Amber
    danger: '#ef4444',       // Red
    background: '#f8fafc',   // Light slate
    card: '#ffffff',         // White
    text: '#1e293b',         // Slate 800
    muted: '#64748b',        // Slate 500
    border: '#e2e8f0',       // Light border
    inputBg: '#ffffff',      // Input background
    hover: '#f1f5f9',        // Hover state
  };

  const [policies, setPolicies] = useState([
    {
      id: 1,
      type: 'Casual Leave',
      description: 'For personal or casual purposes',
      daysPerYear: 12,
      carryForward: 5,
      noticePeriod: '2 days',
      approvalRequired: true,
      documentation: 'Optional',
      rules: ['Can be taken in half days', 'Maximum 3 consecutive days', 'Not for vacation purposes']
    },
    {
      id: 2,
      type: 'Sick Leave',
      description: 'For medical reasons and health issues',
      daysPerYear: 15,
      carryForward: 10,
      noticePeriod: 'Immediate',
      approvalRequired: false,
      documentation: 'Medical certificate required for >3 days',
      rules: ['Medical certificate required after 3 days', 'Can be taken as half day', 'No prior notice for emergency']
    },
    {
      id: 3,
      type: 'Earned Leave',
      description: 'Accrued leave based on service period',
      daysPerYear: 18,
      carryForward: 30,
      noticePeriod: '7 days',
      approvalRequired: true,
      documentation: 'Not required',
      rules: ['Accrues at 1.5 days per month', 'Can be encashed', 'Maximum 30 days carry forward']
    },
    {
      id: 4,
      type: 'Maternity Leave',
      description: 'For expecting mothers',
      daysPerYear: 180,
      carryForward: 0,
      noticePeriod: '30 days',
      approvalRequired: true,
      documentation: 'Medical certificate required',
      rules: ['Available after 1 year of service', 'Can be extended with medical advice', 'Paid leave']
    },
    {
      id: 5,
      type: 'Paternity Leave',
      description: 'For expecting fathers',
      daysPerYear: 7,
      carryForward: 0,
      noticePeriod: '7 days',
      approvalRequired: true,
      documentation: 'Birth certificate required',
      rules: ['Within 3 months of child birth', 'Cannot be split', 'Paid leave']
    },
    {
      id: 6,
      type: 'Bereavement Leave',
      description: 'In case of family member death',
      daysPerYear: 5,
      carryForward: 0,
      noticePeriod: 'Immediate',
      approvalRequired: false,
      documentation: 'Death certificate if requested',
      rules: ['Immediate family only', 'Consecutive days', 'No prior approval needed']
    }
  ]);

  const [newPolicy, setNewPolicy] = useState({
    type: '',
    description: '',
    daysPerYear: '',
    carryForward: '',
    noticePeriod: '',
    approvalRequired: true,
    documentation: '',
    rules: ['']
  });

  const [newRule, setNewRule] = useState('');

  const handlePolicyChange = (id, field, value) => {
    if (!isEditing) return;
    setPolicies(policies.map(policy =>
      policy.id === id ? { ...policy, [field]: value } : policy
    ));
  };

  const handleAddRule = (policyId) => {
    if (newRule.trim()) {
      setPolicies(policies.map(policy =>
        policy.id === policyId
          ? { ...policy, rules: [...policy.rules, newRule.trim()] }
          : policy
      ));
      setNewRule('');
    }
  };

  const handleRemoveRule = (policyId, ruleIndex) => {
    setPolicies(policies.map(policy =>
      policy.id === policyId
        ? { ...policy, rules: policy.rules.filter((_, index) => index !== ruleIndex) }
        : policy
    ));
  };

  const handleAddPolicy = () => {
    if (newPolicy.type && newPolicy.daysPerYear) {
      const policy = {
        id: policies.length + 1,
        ...newPolicy,
        rules: newPolicy.rules.filter(rule => rule.trim() !== '')
      };
      setPolicies([...policies, policy]);
      setNewPolicy({
        type: '',
        description: '',
        daysPerYear: '',
        carryForward: '',
        noticePeriod: '',
        approvalRequired: true,
        documentation: '',
        rules: ['']
      });
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    alert('Leave policies updated successfully!');
  };

  return (
    <div style={{ backgroundColor: themeColors.background, minHeight: '100vh', color: themeColors.text }} className="p-6 transition-colors duration-300">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/manager/leave-approval')}
              style={{
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
                color: themeColors.muted
              }}
              className="p-2 border rounded-lg hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 style={{ color: themeColors.text }} className="text-2xl font-bold">Leave Policy</h1>
              <p style={{ color: themeColors.muted }}>Configure and manage leave policies</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{ borderColor: themeColors.border, color: themeColors.text }}
                  className="px-4 py-2 border rounded-lg hover:opacity-80"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Save size={18} />
                  <span>Save Changes</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Edit2 size={18} />
                <span>Edit Policies</span>
              </button>
            )}
          </div>
        </div>

        {/* Policy Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }} className="rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p style={{ color: themeColors.muted }} className="text-sm">Total Leave Types</p>
                <p style={{ color: themeColors.text }} className="text-2xl font-bold mt-2">{policies.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <Calendar size={20} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }} className="rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p style={{ color: themeColors.muted }} className="text-sm">Avg. Leave Days</p>
                <p style={{ color: themeColors.text }} className="text-2xl font-bold mt-2">
                  {Math.round(policies.reduce((sum, p) => sum + p.daysPerYear, 0) / policies.length)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <Clock size={20} className="text-green-600" />
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }} className="rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p style={{ color: themeColors.muted }} className="text-sm">Require Approval</p>
                <p style={{ color: themeColors.text }} className="text-2xl font-bold mt-2">
                  {policies.filter(p => p.approvalRequired).length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100">
                <Shield size={20} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }} className="rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p style={{ color: themeColors.muted }} className="text-sm">Last Updated</p>
                <p style={{ color: themeColors.text }} className="text-2xl font-bold mt-2">Today</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-100">
                <FileText size={20} className="text-amber-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {policies.map(policy => (
          <div key={policy.id} style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }} className="rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ color: themeColors.text }} className="text-lg font-semibold">{policy.type}</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {policy.daysPerYear} days/year
                </span>
              </div>

              <p style={{ color: themeColors.muted }} className="text-sm mb-6">{policy.description}</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: themeColors.muted }}>Carry Forward:</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={policy.carryForward}
                      onChange={(e) => handlePolicyChange(policy.id, 'carryForward', e.target.value)}
                      style={{ backgroundColor: themeColors.inputBg, borderColor: themeColors.border, color: themeColors.text }}
                      className="w-20 px-2 py-1 border rounded text-right"
                    />
                  ) : (
                    <span style={{ color: themeColors.text }} className="font-medium">{policy.carryForward} days</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: themeColors.muted }}>Notice Period:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={policy.noticePeriod}
                      onChange={(e) => handlePolicyChange(policy.id, 'noticePeriod', e.target.value)}
                      style={{ backgroundColor: themeColors.inputBg, borderColor: themeColors.border, color: themeColors.text }}
                      className="w-24 px-2 py-1 border rounded text-right"
                    />
                  ) : (
                    <span style={{ color: themeColors.text }} className="font-medium">{policy.noticePeriod}</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: themeColors.muted }}>Approval Required:</span>
                  {isEditing ? (
                    <select
                      value={policy.approvalRequired}
                      onChange={(e) => handlePolicyChange(policy.id, 'approvalRequired', e.target.value === 'true')}
                      style={{ backgroundColor: themeColors.inputBg, borderColor: themeColors.border, color: themeColors.text }}
                      className="px-2 py-1 border rounded"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  ) : (
                    <span className={`font-medium ${policy.approvalRequired ? 'text-green-600' : 'text-slate-600'}`}>
                      {policy.approvalRequired ? 'Yes' : 'No'}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: themeColors.muted }}>Documentation:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={policy.documentation}
                      onChange={(e) => handlePolicyChange(policy.id, 'documentation', e.target.value)}
                      style={{ backgroundColor: themeColors.inputBg, borderColor: themeColors.border, color: themeColors.text }}
                      className="w-32 px-2 py-1 border rounded text-right"
                    />
                  ) : (
                    <span style={{ color: themeColors.text }} className="font-medium">{policy.documentation}</span>
                  )}
                </div>
              </div>

              <div>
                <h4 style={{ color: themeColors.text }} className="font-medium mb-2">Rules:</h4>
                <ul className="space-y-1">
                  {policy.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-600" style={{ color: themeColors.muted }}>
                      <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="flex-1">{rule}</span>
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveRule(policy.id, index)}
                          className="p-1 hover:bg-red-50 rounded"
                        >
                          <X size={14} className="text-red-500" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>

                {isEditing && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={newRule}
                      onChange={(e) => setNewRule(e.target.value)}
                      placeholder="Add new rule..."
                      style={{ backgroundColor: themeColors.inputBg, borderColor: themeColors.border, color: themeColors.text }}
                      className="flex-1 px-3 py-1 border rounded text-sm"
                    />
                    <button
                      onClick={() => handleAddRule(policy.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div style={{ backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : '#f8fafc', borderColor: themeColors.border }} className="px-6 py-4 border-t">
                <button
                  onClick={() => setPolicies(policies.filter(p => p.id !== policy.id))}
                  className="w-full py-2 text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Remove Policy
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add New Policy Form */}
      {isEditing && (
        <div style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }} className="rounded-xl shadow-sm border p-6 mb-8">
          <h2 style={{ color: themeColors.text }} className="text-lg font-semibold mb-6">Add New Leave Policy</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <label style={{ color: themeColors.text }} className="block text-sm font-medium mb-2">Leave Type *</label>
              <input
                type="text"
                value={newPolicy.type}
                onChange={(e) => setNewPolicy({ ...newPolicy, type: e.target.value })}
                style={{ backgroundColor: themeColors.inputBg, borderColor: themeColors.border, color: themeColors.text }}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Study Leave"
              />
            </div>

            <div>
              <label style={{ color: themeColors.text }} className="block text-sm font-medium mb-2">Days Per Year *</label>
              <input
                type="number"
                value={newPolicy.daysPerYear}
                onChange={(e) => setNewPolicy({ ...newPolicy, daysPerYear: e.target.value })}
                style={{ backgroundColor: themeColors.inputBg, borderColor: themeColors.border, color: themeColors.text }}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="15"
              />
            </div>

            <div>
              <label style={{ color: themeColors.text }} className="block text-sm font-medium mb-2">Carry Forward Days</label>
              <input
                type="number"
                value={newPolicy.carryForward}
                onChange={(e) => setNewPolicy({ ...newPolicy, carryForward: e.target.value })}
                style={{ backgroundColor: themeColors.inputBg, borderColor: themeColors.border, color: themeColors.text }}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5"
              />
            </div>

            <div>
              <label style={{ color: themeColors.text }} className="block text-sm font-medium mb-2">Notice Period</label>
              <input
                type="text"
                value={newPolicy.noticePeriod}
                onChange={(e) => setNewPolicy({ ...newPolicy, noticePeriod: e.target.value })}
                style={{ backgroundColor: themeColors.inputBg, borderColor: themeColors.border, color: themeColors.text }}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 3 days"
              />
            </div>

            <div>
              <label style={{ color: themeColors.text }} className="block text-sm font-medium mb-2">Documentation Required</label>
              <input
                type="text"
                value={newPolicy.documentation}
                onChange={(e) => setNewPolicy({ ...newPolicy, documentation: e.target.value })}
                style={{ backgroundColor: themeColors.inputBg, borderColor: themeColors.border, color: themeColors.text }}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Certificate required"
              />
            </div>

            <div>
              <label style={{ color: themeColors.text }} className="block text-sm font-medium mb-2">Description</label>
              <input
                type="text"
                value={newPolicy.description}
                onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
                style={{ backgroundColor: themeColors.inputBg, borderColor: themeColors.border, color: themeColors.text }}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description"
              />
            </div>
          </div>

          <div className="mb-6">
            <label style={{ color: themeColors.text }} className="block text-sm font-medium mb-2">Rules</label>
            <div className="space-y-2">
              {newPolicy.rules.map((rule, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) => {
                      const newRules = [...newPolicy.rules];
                      newRules[index] = e.target.value;
                      setNewPolicy({ ...newPolicy, rules: newRules });
                    }}
                    style={{ backgroundColor: themeColors.inputBg, borderColor: themeColors.border, color: themeColors.text }}
                    className="flex-1 px-4 py-2 border rounded-lg"
                    placeholder="Enter a rule"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newRules = newPolicy.rules.filter((_, i) => i !== index);
                      setNewPolicy({ ...newPolicy, rules: newRules });
                    }}
                    className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setNewPolicy({ ...newPolicy, rules: [...newPolicy.rules, ''] })}
                style={{ borderColor: themeColors.border, color: themeColors.text }}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:opacity-80"
              >
                <Plus size={16} />
                <span>Add Rule</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="approvalRequired"
                checked={newPolicy.approvalRequired}
                onChange={(e) => setNewPolicy({ ...newPolicy, approvalRequired: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="approvalRequired" style={{ color: themeColors.text }} className="text-sm">
                Approval Required
              </label>
            </div>

            <button
              type="button"
              onClick={handleAddPolicy}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus size={18} />
              <span>Add Policy</span>
            </button>
          </div>
        </div>
      )}

      {/* Policy Guidelines */}
      <div style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }} className="rounded-xl shadow-sm border p-6">
        <h2 style={{ color: themeColors.text }} className="text-lg font-semibold mb-6">Policy Guidelines</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle size={20} className="text-blue-600" />
              <h3 className="font-medium text-blue-800">Important Notes</h3>
            </div>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>Leave policies are applicable from January 1st each year</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>Unused casual leave cannot be carried forward</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>Medical certificate required for sick leave beyond 3 days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>Minimum 1 year service required for maternity leave</span>
              </li>
            </ul>
          </div>

          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle size={20} className="text-green-600" />
              <h3 className="font-medium text-green-800">Best Practices</h3>
            </div>
            <ul className="space-y-2 text-sm text-green-700">
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>Plan leaves in advance and submit requests early</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>Ensure proper handover before taking extended leave</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>Check team calendar for overlapping leave requests</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>Keep documentation ready for required leave types</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeavePolicy;
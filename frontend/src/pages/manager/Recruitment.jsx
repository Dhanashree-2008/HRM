import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Mail, Phone, MapPin, Briefcase, Calendar, FileText, CheckCircle, XCircle, Eye, User, ChevronDown, ExternalLink } from 'lucide-react';
import { managerService } from '../../services/managerService';
import { toast } from 'react-hot-toast';
import { useOutletContext } from 'react-router-dom';

export default function Recruitment() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedJob, setSelectedJob] = useState('all');
  const [expandedApplication, setExpandedApplication] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isDarkMode = true } = useOutletContext() || {};

  // Theme colors synchronized with Dashboard.jsx
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
  };

  // Load applications from API
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await managerService.getJobApplications();
      // Backend returns { applications: [...] } or array, handle both
      const appsList = Array.isArray(data) ? data : (data.applications || []);

      const formatted = appsList.map(app => ({
        id: app.id,
        name: app.fullName || app.name, // Handle backend variations
        email: app.email,
        phone: app.phone,
        position: app.job?.title || app.position || 'General Application',
        status: (app.status || 'New').toLowerCase(),
        timestamp: app.createdAt,
        resume: app.resumeUrl,
        resumeName: app.resumeUrl ? (app.resumeUrl.split('/').pop() || 'Resume.pdf') : '', // Extract filename
        coverLetter: app.coverLetter,
        linkedin: app.linkedinProfile,
        github: app.portfolioUrl,
        // Keep original object for reference if needed
        original: app
      }));
      setApplications(formatted);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  // Derive unique job titles for filter
  const jobPostings = [...new Set(applications.map(app => app.position).filter(Boolean))];

  // Filter applications based on search and filters
  const filteredApplications = applications.filter(app => {
    const matchesSearch =
      (app.name && app.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.email && app.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.position && app.position.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = selectedStatus === 'all' || app.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesJob = selectedJob === 'all' ||
      (app.position && app.position.toLowerCase() === selectedJob.toLowerCase());

    return matchesSearch && matchesStatus && matchesJob;
  });

  // Status management
  const getStatusColor = (status) => {
    const s = status.toLowerCase();
    switch (s) {
      case 'reviewed':
      case 'review': return { bg: `${themeColors.accent}20`, text: themeColors.accent };
      case 'shortlisted': return { bg: `${themeColors.primary}20`, text: themeColors.primary };
      case 'hired': return { bg: `${themeColors.secondary}20`, text: themeColors.secondary };
      case 'rejected': return { bg: `${themeColors.danger}20`, text: themeColors.danger };
      case 'pending':
      case 'new': return { bg: `${themeColors.warning}20`, text: themeColors.warning };
      case 'interview': return { bg: `${themeColors.warning}20`, text: themeColors.warning }; // Using warning color for interview as well
      default: return { bg: `${themeColors.muted}20`, text: themeColors.muted };
    }
  };

  const getStatusText = (status) => {
    const s = status.toLowerCase();
    switch (s) {
      case 'reviewed':
      case 'review': return 'Under Review';
      case 'shortlisted': return 'Shortlisted';
      case 'hired': return 'Hired';
      case 'rejected': return 'Rejected';
      case 'pending':
      case 'new': return 'New Application';
      case 'interview': return 'Interview';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // Update application status
  const updateApplicationStatus = async (id, newStatus) => {
    try {
      let backendStatus = newStatus;
      if (newStatus === 'review') backendStatus = 'Reviewed';
      if (newStatus === 'shortlisted') backendStatus = 'Shortlisted';
      if (newStatus === 'hired') backendStatus = 'Hired';
      if (newStatus === 'rejected') backendStatus = 'Rejected';

      await managerService.updateApplicationStatus(id, backendStatus);
      toast.success("Status updated");

      setApplications(prev => prev.map(app =>
        app.id === id ? { ...app, status: backendStatus.toLowerCase() } : app
      ));
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update status");
    }
  };

  // Export applications
  const exportApplications = () => {
    const dataStr = JSON.stringify(applications, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `litehr_applications_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // View resume
  const viewResume = (application) => {
    if (application.resume) {
      const url = application.resume.startsWith('http')
        ? application.resume
        : `http://localhost:5000${application.resume}`;
      window.open(url, '_blank');
    } else {
      toast.error('No resume uploaded');
    }
  };

  // Toggle expand details
  const toggleExpand = (id) => {
    setExpandedApplication(expandedApplication === id ? null : id);
  };

  return (
    <div className="space-y-6 transition-colors duration-300" style={{ backgroundColor: themeColors.background, minHeight: '100vh', padding: '1.5rem' }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold transition-colors duration-300" style={{ color: themeColors.text }}>Recruitment Applications</h1>
          <p className="transition-colors duration-300" style={{ color: themeColors.muted }}>
            Manage applications from careers page • {applications.length} total applications
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportApplications}
            className="flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors duration-300 hover:opacity-80"
            style={{ borderColor: themeColors.border, color: themeColors.text, backgroundColor: themeColors.card }}
          >
            <Download size={18} />
            <span>Export JSON</span>
          </button>
          <button
            onClick={loadApplications}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-300 hover:opacity-90 text-white"
            style={{ backgroundColor: themeColors.primary }}
          >
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl shadow-sm p-6 transition-colors duration-300" style={{ backgroundColor: themeColors.card, border: `1px solid ${themeColors.border}` }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>Total Applications</p>
              <h3 className="text-2xl font-bold mt-1 transition-colors duration-300" style={{ color: themeColors.text }}>{applications.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: `${themeColors.primary}20` }}>
              <FileText style={{ color: themeColors.primary }} size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-xl shadow-sm p-6 transition-colors duration-300" style={{ backgroundColor: themeColors.card, border: `1px solid ${themeColors.border}` }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>Pending Review</p>
              <h3 className="text-2xl font-bold mt-1 transition-colors duration-300" style={{ color: themeColors.text }}>
                {applications.filter(a => ['new', 'pending'].includes(a.status)).length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: `${themeColors.warning}20` }}>
              <Eye style={{ color: themeColors.warning }} size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-xl shadow-sm p-6 transition-colors duration-300" style={{ backgroundColor: themeColors.card, border: `1px solid ${themeColors.border}` }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>Shortlisted</p>
              <h3 className="text-2xl font-bold mt-1 transition-colors duration-300" style={{ color: themeColors.text }}>
                {applications.filter(a => ['shortlisted', 'interview'].includes(a.status)).length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: `${themeColors.accent}20` }}>
              <User style={{ color: themeColors.accent }} size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-xl shadow-sm p-6 transition-colors duration-300" style={{ backgroundColor: themeColors.card, border: `1px solid ${themeColors.border}` }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>Hired</p>
              <h3 className="text-2xl font-bold mt-1 transition-colors duration-300" style={{ color: themeColors.text }}>
                {applications.filter(a => a.status === 'hired').length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: `${themeColors.secondary}20` }}>
              <CheckCircle style={{ color: themeColors.secondary }} size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl shadow-sm p-6 transition-colors duration-300" style={{ backgroundColor: themeColors.card, border: `1px solid ${themeColors.border}` }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300" style={{ color: themeColors.muted }} size={18} />
            <input
              type="search"
              placeholder="Search by name, email, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300"
              style={{
                backgroundColor: themeColors.inputBg,
                borderColor: themeColors.border,
                color: themeColors.text,
                '--tw-ring-color': themeColors.primary
              }}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300" style={{ color: themeColors.muted }} size={18} />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 appearance-none transition-colors duration-300"
                style={{
                  backgroundColor: themeColors.inputBg,
                  borderColor: themeColors.border,
                  color: themeColors.text,
                  '--tw-ring-color': themeColors.primary
                }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending/New</option>
                <option value="reviewed">Under Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300" style={{ color: themeColors.muted }} size={18} />
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="pl-10 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 appearance-none transition-colors duration-300"
                style={{
                  backgroundColor: themeColors.inputBg,
                  borderColor: themeColors.border,
                  color: themeColors.text,
                  '--tw-ring-color': themeColors.primary
                }}
              >
                <option value="all">All Positions</option>
                {jobPostings.map(job => (
                  <option key={job} value={job}>{job}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 transition-colors duration-300" style={{ color: themeColors.muted }}>Loading applications...</div>
          ) : filteredApplications.length > 0 ? (
            filteredApplications.map((application) => (
              <div key={application.id} className="border rounded-xl overflow-hidden transition-colors duration-300" style={{ borderColor: themeColors.border }}>
                {/* Application Header */}
                <div className="p-6 transition-colors duration-300" style={{ backgroundColor: themeColors.card }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: `${themeColors.primary}20` }}>
                          <User style={{ color: themeColors.primary }} size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg transition-colors duration-300" style={{ color: themeColors.text }}>{application.name || 'No Name'}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            {application.email && (
                              <span className="flex items-center gap-1 text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>
                                <Mail size={14} />
                                {application.email}
                              </span>
                            )}
                            {application.phone && (
                              <span className="flex items-center gap-1 text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>
                                <Phone size={14} />
                                {application.phone}
                              </span>
                            )}
                            {application.timestamp && (
                              <span className="flex items-center gap-1 text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>
                                <Calendar size={14} />
                                {formatDate(application.timestamp)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>Applied Position</div>
                          <div className="font-medium transition-colors duration-300" style={{ color: themeColors.text }}>{application.position || 'General Application'}</div>
                        </div>
                        <div>
                          <div className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>Status</div>
                          <div className="font-medium">
                            {(() => {
                              const statusStyle = getStatusColor(application.status || 'pending');
                              return (
                                <span className="px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300"
                                  style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}>
                                  {getStatusText(application.status || 'pending')}
                                </span>
                              );
                            })()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>Contact</div>
                          <div className="font-medium transition-colors duration-300" style={{ color: themeColors.text }}>{application.phone || 'No phone provided'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleExpand(application.id)}
                          className="px-3 py-1 text-sm rounded-lg transition-colors duration-300 hover:opacity-80"
                          style={{ color: themeColors.accent, backgroundColor: `${themeColors.accent}10` }}
                        >
                          {expandedApplication === application.id ? 'Hide Details' : 'View Details'}
                        </button>
                        <button
                          onClick={() => viewResume(application)}
                          className="px-3 py-1 text-sm rounded-lg transition-colors duration-300 hover:opacity-80"
                          style={{ color: themeColors.secondary, backgroundColor: `${themeColors.secondary}10` }}
                        >
                          Resume
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      onClick={() => updateApplicationStatus(application.id, 'review')}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors duration-300 hover:opacity-90`}
                      style={{
                        backgroundColor: (application.status || 'pending') === 'reviewed' ? themeColors.accent : `${themeColors.accent}20`,
                        color: (application.status || 'pending') === 'reviewed' ? 'white' : themeColors.accent
                      }}
                    >
                      Mark Review
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(application.id, 'shortlisted')}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors duration-300 hover:opacity-90`}
                      style={{
                        backgroundColor: (application.status || 'pending') === 'shortlisted' ? themeColors.primary : `${themeColors.primary}20`,
                        color: (application.status || 'pending') === 'shortlisted' ? 'white' : themeColors.primary
                      }}
                    >
                      Shortlist
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(application.id, 'hired')}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors duration-300 hover:opacity-90`}
                      style={{
                        backgroundColor: (application.status || 'pending') === 'hired' ? themeColors.secondary : `${themeColors.secondary}20`,
                        color: (application.status || 'pending') === 'hired' ? 'white' : themeColors.secondary
                      }}
                    >
                      Hire
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(application.id, 'rejected')}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors duration-300 hover:opacity-90`}
                      style={{
                        backgroundColor: (application.status || 'pending') === 'rejected' ? themeColors.danger : `${themeColors.danger}20`,
                        color: (application.status || 'pending') === 'rejected' ? 'white' : themeColors.danger
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedApplication === application.id && (
                  <div className="border-t p-6 transition-colors duration-300" style={{ borderColor: themeColors.border, backgroundColor: isDarkMode ? `${themeColors.background}` : '#f8fafc' }}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left Column - Personal Info */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2 transition-colors duration-300" style={{ color: themeColors.text }}>Contact Information</h4>
                          <div className="space-y-2">
                            <div>
                              <div className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>Email</div>
                              <div className="font-medium transition-colors duration-300" style={{ color: themeColors.text }}>{application.email}</div>
                            </div>
                            {application.phone && (
                              <div>
                                <div className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>Phone</div>
                                <div className="font-medium transition-colors duration-300" style={{ color: themeColors.text }}>{application.phone}</div>
                              </div>
                            )}
                            {application.linkedin && (
                              <div>
                                <div className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>LinkedIn</div>
                                <a
                                  href={application.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline flex items-center gap-1 transition-colors duration-300"
                                  style={{ color: themeColors.accent }}
                                >
                                  {application.linkedin}
                                  <ExternalLink size={12} />
                                </a>
                              </div>
                            )}
                            {application.github && (
                              <div>
                                <div className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>GitHub</div>
                                <a
                                  href={application.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline flex items-center gap-1 transition-colors duration-300"
                                  style={{ color: themeColors.accent }}
                                >
                                  {application.github}
                                  <ExternalLink size={12} />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2 transition-colors duration-300" style={{ color: themeColors.text }}>Application Details</h4>
                          <div className="space-y-2">
                            <div>
                              <div className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>Applied On</div>
                              <div className="font-medium transition-colors duration-300" style={{ color: themeColors.text }}>{formatDate(application.timestamp)}</div>
                            </div>
                            {application.appliedDate && (
                              <div>
                                <div className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>Submitted Date</div>
                                <div className="font-medium transition-colors duration-300" style={{ color: themeColors.text }}>{application.appliedDate}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Middle Column - Cover Letter */}
                      <div className="lg:col-span-2">
                        <div>
                          <h4 className="font-semibold mb-2 transition-colors duration-300" style={{ color: themeColors.text }}>Cover Letter</h4>
                          <div className="p-4 rounded-lg border max-h-60 overflow-y-auto transition-colors duration-300" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}>
                            <p className="whitespace-pre-wrap transition-colors duration-300" style={{ color: themeColors.text }}>
                              {application.coverLetter || 'No cover letter provided'}
                            </p>
                          </div>
                        </div>

                        {/* Resume Info */}
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2 transition-colors duration-300" style={{ color: themeColors.text }}>Resume Information</h4>
                          <div className="p-4 rounded-lg border transition-colors duration-300" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <FileText size={20} style={{ color: themeColors.accent }} />
                                <div>
                                  <div className="font-medium transition-colors duration-300" style={{ color: themeColors.text }}>
                                    {application.resumeName || 'Resume file'}
                                  </div>
                                  <div className="text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>
                                    {application.resume ? 'File uploaded successfully' : 'No resume uploaded'}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => viewResume(application)}
                                className="px-3 py-1 text-sm rounded-lg transition-colors duration-300 hover:opacity-80"
                                style={{ backgroundColor: `${themeColors.accent}20`, color: themeColors.accent }}
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300" style={{ backgroundColor: themeColors.card }}>
                <Search size={40} style={{ color: themeColors.muted }} />
              </div>
              <h3 className="text-xl font-semibold mb-2 transition-colors duration-300" style={{ color: themeColors.text }}>
                {applications.length === 0 ? 'No applications yet' : 'No matching applications'}
              </h3>
              <p className="transition-colors duration-300" style={{ color: themeColors.muted }}>
                {applications.length === 0
                  ? 'Applications submitted through the careers page will appear here.'
                  : 'Try adjusting your search criteria'}
              </p>
              {applications.length === 0 && (
                <div className="mt-4 text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>
                  <p>Submit applications from the homepage careers section to see them here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
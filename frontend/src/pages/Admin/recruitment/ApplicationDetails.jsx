import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  FiArrowLeft, FiUser, FiMail, FiPhone, FiBriefcase, 
  FiCalendar, FiMapPin, FiDownload, FiCheck, FiX, 
  FiMessageSquare, FiStar, FiFileText, FiRefreshCw, FiCopy,
  FiUpload, FiAlertCircle
} from "react-icons/fi";
import axios from "axios";

// Use environment variable for API URL (Vite)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const ApplicationDetails = () => {
  const { id } = useParams();
  const [status, setStatus] = useState("Reviewed");
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(4);
  const [cvSummary, setCvSummary] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");
  const [apiError, setApiError] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  // Debug: Log the API URL to verify it's loaded
  console.log("Using API Base URL:", API_BASE_URL);
  console.log("Application ID:", id);

  const application = {
    id: id,
    name: "Amit Verma",
    email: "amit.verma@example.com",
    phone: "+91 98765 43210",
    appliedFor: "Frontend Developer",
    appliedDate: "2024-11-20",
    experience: "3 years",
    currentCompany: "TechCorp Pvt Ltd",
    currentSalary: "₹12,00,000",
    expectedSalary: "₹15,00,000",
    noticePeriod: "30 days",
    location: "Mumbai",
    status: "Reviewed",
    matchScore: 85,
    skills: ["React", "JavaScript", "HTML/CSS", "Redux", "TypeScript", "Git"],
    education: [
      { degree: "B.Tech Computer Science", institution: "IIT Mumbai", year: "2020" },
      { degree: "12th Science", institution: "Kendriya Vidyalaya", year: "2016" },
    ],
    experienceDetails: [
      { company: "TechCorp Pvt Ltd", role: "Frontend Developer", duration: "2021 - Present" },
      { company: "WebSolutions", role: "Junior Developer", duration: "2020 - 2021" },
    ],
    cvUrl: "https://example.com/cv/amit-verma.pdf",
    cvSummary: ""
  };

  // Check API health on component mount
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/health`);
        setApiStatus(response.data);
        console.log("API Health Check:", response.data);
      } catch (error) {
        console.warn("API Health Check failed:", error.message);
        setApiStatus({ status: 'error', message: 'Cannot connect to backend API' });
      }
    };

    checkApiHealth();
  }, []);

  // Real API call to generate summary
  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    setApiError(null);
    setShowErrorDetails(false);
    
    try {
      console.log("Generating summary for:", {
        cvUrl: application.cvUrl,
        jobPosition: application.appliedFor,
        applicationId: id
      });

      const response = await axios.post(`${API_BASE_URL}/api/cv/summarize/url`, {
        cvUrl: application.cvUrl,
        jobPosition: application.appliedFor,
        applicationId: id
      }, {
        timeout: 45000 // 45 second timeout for Gemini API
      });
      
      if (response.data.success) {
        const summary = response.data.summary;
        setCvSummary(summary);
        
        // Show success with metadata
        const metadata = response.data.metadata || {};
        alert(`✅ CV summary generated successfully!\n\n📄 Model: ${metadata.model || 'Gemini'}\n📏 Length: ${metadata.textLength || 'Unknown'} characters\n⏰ Generated: ${new Date().toLocaleTimeString()}`);
        
        // Optional: Save to your database
        // await axios.post(`/api/applications/${id}/summary`, { summary });
        
      } else {
        throw new Error(response.data.error || 'Failed to generate summary');
      }
    } catch (error) {
      console.error("Error generating summary:", {
        message: error.message,
        response: error.response?.data,
        code: error.code
      });
      
      const errorMsg = error.response?.data?.error || error.message;
      setApiError(errorMsg);
      
      // Provide helpful error messages
      let userMessage = "Failed to generate summary. ";
      
      if (error.code === 'ECONNABORTED') {
        userMessage += "Request timed out. The API might be taking too long to respond.";
      } else if (error.code === 'ERR_NETWORK') {
        userMessage += "Cannot connect to the server. Make sure the backend is running.";
      } else if (error.response?.status === 400) {
        userMessage += "Invalid request. The CV URL might not be accessible.";
      } else if (error.response?.status === 500) {
        userMessage += "Server error. Check if your Gemini API key is configured.";
      } else if (errorMsg.includes('Gemini API')) {
        userMessage += errorMsg;
      }
      
      alert(userMessage);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Test Gemini API connection
  const handleTestGeminiAPI = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/test/gemini`);
      if (response.data.success) {
        alert(`✅ Gemini API is working!\n\nResponse: ${response.data.response}`);
      } else {
        alert(`❌ Gemini API test failed: ${response.data.error}`);
      }
    } catch (error) {
      alert(`❌ Cannot test Gemini API: ${error.message}`);
    }
  };

  // Handle file upload for CV
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setIsGeneratingSummary(true);
    setApiError(null);

    const formData = new FormData();
    formData.append('cv', file);
    formData.append('jobPosition', application.appliedFor);
    formData.append('applicationId', id);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/cv/summarize/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 45000
      });
      
      if (response.data.success) {
        const summary = response.data.summary;
        setCvSummary(summary);
        alert("✅ CV uploaded and summary generated successfully!");
      } else {
        throw new Error(response.data.error || 'Failed to generate summary');
      }
    } catch (error) {
      console.error("Error uploading CV:", error);
      setApiError(error.response?.data?.error || error.message);
      alert("Failed to upload CV. Please try again.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Generate summary from text
  const handleGenerateFromText = async () => {
    const text = prompt("Paste CV text content (minimum 100 characters):");
    if (!text || text.length < 100) {
      alert("Please provide valid CV text content (minimum 100 characters)");
      return;
    }

    setIsGeneratingSummary(true);
    setApiError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/cv/summarize/text`, {
        text: text,
        jobPosition: application.appliedFor,
        applicationId: id
      });
      
      if (response.data.success) {
        const summary = response.data.summary;
        setCvSummary(summary);
        alert("✅ Summary generated from text successfully!");
      } else {
        throw new Error(response.data.error || 'Failed to generate summary');
      }
    } catch (error) {
      console.error("Error generating from text:", error);
      setApiError(error.response?.data?.error || error.message);
      alert("Failed to generate summary. Please try again.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleCopySummary = () => {
    if (!cvSummary) {
      alert("No summary available to copy");
      return;
    }
    
    navigator.clipboard.writeText(cvSummary);
    alert("Summary copied to clipboard!");
  };

  const handleDownloadCV = () => {
    if (!application?.cvUrl) {
      alert("No CV available for download");
      return;
    }
    
    window.open(application.cvUrl, '_blank');
  };

  const handleStatusChange = async (newStatus) => {
    try {
      // In real app, update status via API
      // await axios.put(`/api/applications/${id}/status`, { status: newStatus });
      
      setStatus(newStatus);
      alert(`✅ Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    }
  };

  const handleAddNote = async () => {
    if (notes.trim()) {
      try {
        // In real app, save note via API
        // await axios.post(`/api/applications/${id}/notes`, { note: notes });
        
        setNotes("");
        alert("✅ Note added successfully!");
      } catch (error) {
        console.error("Failed to add note:", error);
        alert("Failed to add note");
      }
    }
  };

  const handleScheduleInterview = () => {
    const date = prompt("Enter interview date (YYYY-MM-DD):");
    const time = prompt("Enter interview time (HH:MM):");
    if (date && time) {
      alert(`✅ Interview scheduled for ${date} at ${time}`);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 p-8">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/admin/recruitment/applications"
                className="p-2 rounded-lg hover:bg-white/10 text-white"
              >
                <FiArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-300">
                  Application Details
                </h1>
                <p className="text-slate-300">
                  Review candidate application and make hiring decisions.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleDownloadCV}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 border border-white/20 text-white rounded-lg hover:bg-slate-700/50 font-medium">
                  <FiDownload className="w-4 h-4" />
                  Download CV
                </div>
              </button>
              
              <button 
                onClick={handleTestGeminiAPI}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 border border-white/20 text-white rounded-lg hover:bg-slate-700/50 font-medium">
                  <FiAlertCircle className="w-4 h-4" />
                  Test API
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* API Status Display */}
      {apiStatus && (
        <div className={`mb-4 p-3 rounded-lg border ${apiStatus.status === 'ok' ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400' : 'bg-amber-900/20 border-amber-500/30 text-amber-400'}`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${apiStatus.status === 'ok' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
            <span className="text-sm">
              {apiStatus.status === 'ok' ? '✅ Backend API is connected' : '⚠️ Backend API connection issue'}
            </span>
            {apiStatus.services?.geminiApi && (
              <span className="ml-2 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded">Gemini Ready</span>
            )}
          </div>
        </div>
      )}

      {/* API Error Display */}
      {apiError && (
        <div className="mb-4 p-4 bg-gradient-to-r from-rose-900/30 to-red-900/30 rounded-lg border border-rose-500/30">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <FiAlertCircle className="w-5 h-5 text-rose-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-rose-400 font-bold mb-1">API Error</h4>
                <p className="text-slate-300 text-sm">{apiError}</p>
                {showErrorDetails && (
                  <div className="mt-2 p-2 bg-slate-800/50 rounded text-xs font-mono text-slate-400">
                    URL: {API_BASE_URL}/api/cv/summarize/url
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowErrorDetails(!showErrorDetails)}
              className="text-slate-400 hover:text-slate-300 text-sm"
            >
              {showErrorDetails ? 'Hide' : 'Details'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Candidate Info & CV Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Candidate Profile Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-white/10">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                    {application.name.charAt(0)}
                  </div>
                  <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse"></div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{application.name}</h2>
                      <p className="text-slate-400">{application.appliedFor}</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-white/10">
                      <div className="text-center">
                        <p className="text-sm text-slate-400">Match Score</p>
                        <div className="flex items-center justify-center gap-2 mt-1">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center text-white text-xl font-bold">
                            {application.matchScore}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <FiMail className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-300">{application.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiPhone className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-300">{application.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiMapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-300">{application.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <button 
                  onClick={() => handleStatusChange("Interview")}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-md font-medium"
                >
                  <FiCalendar className="w-4 h-4" />
                  Schedule Interview
                </button>
                <button 
                  onClick={() => handleStatusChange("Hired")}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg hover:shadow-md font-medium"
                >
                  <FiCheck className="w-4 h-4" />
                  Hire
                </button>
                <button 
                  onClick={() => handleStatusChange("Rejected")}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-lg hover:shadow-md font-medium"
                >
                  <FiX className="w-4 h-4" />
                  Reject
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 border border-white/20 text-slate-300 rounded-lg hover:bg-slate-800/50 font-medium">
                  <FiMessageSquare className="w-4 h-4" />
                  Contact
                </button>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {application.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 rounded-lg text-sm font-medium border border-cyan-500/30">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* CV Summary Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">CV Summary (AI Generated)</h3>
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="file"
                      id="cv-upload"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="cv-upload"
                      className="flex items-center gap-2 px-3 py-2 border border-white/20 text-slate-300 rounded-lg hover:bg-slate-800/50 cursor-pointer"
                    >
                      <FiUpload className="w-4 h-4" />
                      Upload CV
                    </label>
                    
                    <button
                      onClick={handleGenerateFromText}
                      disabled={isGeneratingSummary}
                      className="flex items-center gap-2 px-3 py-2 border border-white/20 text-slate-300 rounded-lg hover:bg-slate-800/50 disabled:opacity-50"
                    >
                      <FiFileText className="w-4 h-4" />
                      From Text
                    </button>
                    
                    <button
                      onClick={handleGenerateSummary}
                      disabled={isGeneratingSummary || !application.cvUrl}
                      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiRefreshCw className={`w-4 h-4 ${isGeneratingSummary ? 'animate-spin' : ''}`} />
                      {isGeneratingSummary ? 'Generating...' : 'Generate'}
                    </button>
                    
                    {cvSummary && (
                      <button
                        onClick={handleCopySummary}
                        className="flex items-center gap-2 px-3 py-2 border border-white/20 text-slate-300 rounded-lg hover:bg-slate-800/50"
                      >
                        <FiCopy className="w-4 h-4" />
                        Copy
                      </button>
                    )}
                  </div>
                </div>
                
                {isGeneratingSummary && (
                  <div className="mb-4 p-4 bg-slate-800/50 rounded-lg border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-500"></div>
                      <div>
                        <p className="text-slate-300">Generating AI-powered CV summary...</p>
                        <p className="text-sm text-slate-500">This may take 15-30 seconds</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="border border-white/10 rounded-lg overflow-hidden">
                  {/* Tabs */}
                  <div className="flex border-b border-white/10">
                    <button
                      onClick={() => setActiveTab("summary")}
                      className={`flex-1 py-3 px-4 text-sm font-medium ${
                        activeTab === "summary"
                          ? "bg-slate-800/50 text-cyan-400 border-b-2 border-cyan-500"
                          : "text-slate-400 hover:text-slate-300"
                      }`}
                    >
                      <FiFileText className="inline-block w-4 h-4 mr-2" />
                      AI Summary
                    </button>
                    <button
                      onClick={() => setActiveTab("full")}
                      className={`flex-1 py-3 px-4 text-sm font-medium ${
                        activeTab === "full"
                          ? "bg-slate-800/50 text-cyan-400 border-b-2 border-cyan-500"
                          : "text-slate-400 hover:text-slate-300"
                      }`}
                    >
                      <FiBriefcase className="inline-block w-4 h-4 mr-2" />
                      Full Details
                    </button>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 bg-slate-900/50 max-h-96 overflow-y-auto">
                    {activeTab === "summary" ? (
                      <div className="prose prose-invert max-w-none">
                        {cvSummary ? (
                          <>
                            <div className="text-slate-300 whitespace-pre-line">
                              {cvSummary}
                            </div>
                            
                            <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20">
                              <h4 className="text-cyan-400 font-bold mb-2">📊 AI Analysis Summary:</h4>
                              <ul className="space-y-2 text-sm text-slate-300">
                                <li className="flex items-start gap-2">
                                  <div className="w-2 h-2 rounded-full bg-cyan-500 mt-1.5"></div>
                                  <span>Summary generated using <strong>Gemini AI ({process.env.GEMINI_MODEL || 'gemini-1.5-pro'})</strong></span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <div className="w-2 h-2 rounded-full bg-cyan-500 mt-1.5"></div>
                                  <span>Analysis customized for <strong>{application.appliedFor}</strong> position</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <div className="w-2 h-2 rounded-full bg-cyan-500 mt-1.5"></div>
                                  <span>Professional assessment based on uploaded CV content</span>
                                </li>
                              </ul>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-8">
                            <FiFileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <h4 className="text-lg font-bold text-white mb-2">No AI Summary Generated Yet</h4>
                            <p className="text-slate-400 mb-6">
                              Generate an AI-powered summary using your Gemini API key to get detailed candidate analysis.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                              <button
                                onClick={handleGenerateSummary}
                                disabled={!application.cvUrl}
                                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-md disabled:opacity-50"
                              >
                                Generate AI Summary
                              </button>
                              <label
                                htmlFor="cv-upload"
                                className="px-4 py-2 border border-white/20 text-slate-300 rounded-lg hover:bg-slate-800/50 cursor-pointer text-center"
                              >
                                Upload CV
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Experience & Education - Full View */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-lg font-bold text-white mb-3">Experience</h4>
                            <div className="space-y-3">
                              {application.experienceDetails.map((exp, index) => (
                                <div key={index} className="p-3 rounded-lg border border-white/10 bg-slate-800/50">
                                  <p className="font-medium text-white">{exp.role}</p>
                                  <p className="text-sm text-slate-400">{exp.company}</p>
                                  <p className="text-xs text-slate-500 mt-1">{exp.duration}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-white mb-3">Education</h4>
                            <div className="space-y-3">
                              {application.education.map((edu, index) => (
                                <div key={index} className="p-3 rounded-lg border border-white/10 bg-slate-800/50">
                                  <p className="font-medium text-white">{edu.degree}</p>
                                  <p className="text-sm text-slate-400">{edu.institution}</p>
                                  <p className="text-xs text-slate-500 mt-1">{edu.year}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Additional Info */}
                        <div>
                          <h4 className="text-lg font-bold text-white mb-3">Additional Information</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-lg border border-white/10 bg-slate-800/50">
                              <p className="text-sm text-slate-400">Total Experience</p>
                              <p className="font-medium text-white">{application.experience}</p>
                            </div>
                            <div className="p-3 rounded-lg border border-white/10 bg-slate-800/50">
                              <p className="text-sm text-slate-400">Notice Period</p>
                              <p className="font-medium text-white">{application.noticePeriod}</p>
                            </div>
                            <div className="p-3 rounded-lg border border-white/10 bg-slate-800/50">
                              <p className="text-sm text-slate-400">Current Company</p>
                              <p className="font-medium text-white">{application.currentCompany}</p>
                            </div>
                            <div className="p-3 rounded-lg border border-white/10 bg-slate-800/50">
                              <p className="text-sm text-slate-400">Location</p>
                              <p className="font-medium text-white">{application.location}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Notes & Comments</h3>
              <div className="space-y-4">
                <div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/20 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-slate-400 transition-all"
                    placeholder="Add your notes or comments about this candidate..."
                  />
                  <button
                    onClick={handleAddNote}
                    className="mt-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-md"
                  >
                    Add Note
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-800/50 rounded-lg border border-white/10">
                    <p className="text-sm text-white">Strong React skills, good communication.</p>
                    <p className="text-xs text-slate-500 mt-1">By Simran Kaur • 2 days ago</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg border border-white/10">
                    <p className="text-sm text-white">Scheduled for technical interview on Dec 10.</p>
                    <p className="text-xs text-slate-500 mt-1">By Rahul Sharma • 1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Status & Actions */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Application Status</h3>
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/50 rounded-lg border border-white/10">
                  <p className="text-sm text-slate-400 mb-1">Current Status</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                      status === "New" ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white" :
                      status === "Reviewed" ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" :
                      status === "Interview" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" :
                      status === "Hired" ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white" :
                      "bg-gradient-to-r from-rose-500 to-red-500 text-white"
                    }`}>
                      {status}
                    </span>
                    <span className="text-xs text-slate-500">Applied {application.appliedDate}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg border border-white/10">
                  <p className="text-sm text-slate-400 mb-2">Change Status</p>
                  <div className="grid grid-cols-2 gap-2">
                    {["New", "Reviewed", "Interview", "Hired", "Rejected"].map((statusOption) => (
                      <button
                        key={statusOption}
                        onClick={() => handleStatusChange(statusOption)}
                        className={`px-3 py-2 rounded text-sm font-medium ${
                          status === statusOption
                            ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                            : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        }`}
                      >
                        {statusOption}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg border border-white/10">
                  <p className="text-sm text-slate-400 mb-2">Rating</p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`text-2xl ${star <= rating ? "text-amber-500" : "text-slate-600"}`}
                      >
                        <FiStar />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-slate-300">{rating}/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Salary Details */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Salary Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-white/10">
                  <span className="text-slate-400">Current Salary</span>
                  <span className="font-medium text-white">{application.currentSalary}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-white/10">
                  <span className="text-slate-400">Expected Salary</span>
                  <span className="font-medium text-white">{application.expectedSalary}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-white/10">
                  <span className="text-slate-400">Difference</span>
                  <span className="font-medium text-emerald-400">+25%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-white/10">
                  <span className="text-slate-400">Notice Period</span>
                  <span className="font-medium text-white">{application.noticePeriod}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Application Timeline</h3>
              <div className="space-y-4">
                {[
                  { event: "Application Submitted", date: "2024-11-20", status: "completed" },
                  { event: "Resume Screened", date: "2024-11-21", status: "completed" },
                  { event: "Technical Interview", date: "2024-12-10", status: "scheduled" },
                  { event: "HR Interview", date: "Pending", status: "pending" },
                  { event: "Offer Letter", date: "Pending", status: "pending" },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.status === "completed" ? "bg-gradient-to-r from-emerald-500 to-green-500" :
                      item.status === "scheduled" ? "bg-gradient-to-r from-purple-500 to-pink-500" :
                      "bg-slate-700"
                    }`}>
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{item.event}</p>
                      <p className="text-xs text-slate-400">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleScheduleInterview}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow hover:shadow-md font-medium"
            >
              Schedule Interview
            </button>
            <Link
              to="/admin/recruitment/applications"
              className="w-full block px-4 py-3 border border-white/20 text-white text-center rounded-lg hover:bg-slate-800/50 font-medium"
            >
              Back to Applications
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
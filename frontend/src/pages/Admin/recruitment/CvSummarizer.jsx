import React, { useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { FiArrowLeft, FiUpload, FiFileText, FiUser, FiBriefcase, FiAward, FiDownload, FiCopy, FiUsers, FiCheck, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

const CvSummarizer = () => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert("Only PDF and DOC files are allowed");
        return;
      }

      setFile(selectedFile);
      setSummary(null);
    }
  };

  const handleProcess = () => {
    if (!file) {
      alert("Please upload a CV file first");
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setSummary({
        name: "Amit Verma",
        email: "amit.verma@example.com",
        phone: "+91 98765 43210",
        experience: "3 years",
        currentRole: "Frontend Developer",
        currentCompany: "TechCorp Pvt Ltd",
        education: "B.Tech Computer Science - IIT Mumbai (2020)",
        skills: ["React", "JavaScript", "HTML/CSS", "TypeScript", "Redux", "Git"],
        summary: "Frontend developer with 3+ years of experience building responsive web applications using React and modern JavaScript. Strong understanding of component-based architecture and state management. Experience working in agile teams and collaborating with UX designers.",
        matchScore: 85,
        strengths: ["Strong React skills", "Good problem-solving", "Clean code practices"],
        recommendations: ["Schedule technical interview", "Assess JavaScript fundamentals"]
      });
    }, 3000);
  };

  const handleCopySummary = () => {
    if (summary) {
      const textToCopy = `
Candidate: ${summary.name}
Email: ${summary.email}
Phone: ${summary.phone}
Experience: ${summary.experience}
Current Role: ${summary.currentRole} at ${summary.currentCompany}
Education: ${summary.education}

Summary:
${summary.summary}

Skills: ${summary.skills.join(", ")}

Strengths:
${summary.strengths.map(s => `• ${s}`).join("\n")}

Recommendations:
${summary.recommendations.map(r => `• ${r}`).join("\n")}

Match Score: ${summary.matchScore}%
      `.trim();

      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadSummary = () => {
    if (summary) {
      const element = document.createElement("a");
      const text = `
Candidate Summary Report
========================

Basic Information:
-----------------
Name: ${summary.name}
Email: ${summary.email}
Phone: ${summary.phone}
Experience: ${summary.experience}
Current Role: ${summary.currentRole}
Current Company: ${summary.currentCompany}
Education: ${summary.education}

Professional Summary:
--------------------
${summary.summary}

Technical Skills:
----------------
${summary.skills.map(s => `• ${s}`).join("\n")}

Key Strengths:
--------------
${summary.strengths.map(s => `• ${s}`).join("\n")}

Recommendations:
---------------
${summary.recommendations.map(r => `• ${r}`).join("\n")}

Overall Assessment:
------------------
Match Score: ${summary.matchScore}%
Status: Recommended for technical interview
Generated: ${new Date().toLocaleDateString()}
      `.trim();

      const blob = new Blob([text], { type: 'text/plain' });
      element.href = URL.createObjectURL(blob);
      element.download = `${summary.name.replace(/\s+/g, '_')}_Summary.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const clearAll = () => {
    setFile(null);
    setSummary(null);
  };

  return (
    <AdminLayout>
      {/*  Header */}
      <div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 p-8">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/admin/recruitment"
              className="p-2 rounded-lg hover:bg-white/10 text-white"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-300">
                AI CV Summarizer
              </h1>
              <p className="text-slate-300">Upload CVs to get instant AI-powered candidate summaries.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Upload & Processing */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Card with  Theme */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Upload CV</h3>
              
              {!file ? (
                <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <FiUpload className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-medium text-white mb-2">Upload CV Document</h4>
                  <p className="text-slate-300 mb-4">
                    Drag and drop your CV file here or click to browse
                  </p>
                  <label className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg shadow hover:shadow-md cursor-pointer">
                    <FiUpload className="w-5 h-5" />
                    Browse Files
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                  <p className="text-sm text-slate-400 mt-4">
                    Supported formats: PDF, DOC, DOCX (Max 5MB)
                  </p>
                </div>
              ) : (
                <div className="border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                        <FiFileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{file.name}</p>
                        <p className="text-sm text-slate-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={clearAll}
                      className="px-4 py-2 border border-white/20 text-slate-300 rounded-lg hover:bg-white/10"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <button
                    onClick={handleProcess}
                    disabled={isProcessing}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium ${
                      isProcessing
                        ? "bg-slate-800/50 text-slate-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow hover:shadow-md"
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing CV with AI...
                      </>
                    ) : (
                      <>
                        <FiFileText className="w-5 h-5" />
                        Generate AI Summary
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Results Card with  Theme */}
          {summary && (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">AI Summary</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopySummary}
                      className="flex items-center gap-2 px-3 py-2 border border-white/20 text-slate-300 rounded-lg hover:bg-white/10"
                    >
                      <FiCopy className="w-4 h-4" />
                      {copied ? "Copied!" : "Copy"}
                    </button>
                    <button
                      onClick={handleDownloadSummary}
                      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-md"
                    >
                      <FiDownload className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <FiUser className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-slate-400">Candidate</span>
                      </div>
                      <p className="font-medium text-white">{summary.name}</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <FiBriefcase className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-slate-400">Experience</span>
                      </div>
                      <p className="font-medium text-white">{summary.experience}</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <FiBriefcase className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-slate-400">Current Role</span>
                      </div>
                      <p className="font-medium text-white">{summary.currentRole}</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <FiAward className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-slate-400">Match Score</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full"
                            style={{ width: `${summary.matchScore}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-emerald-400">{summary.matchScore}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Text */}
                  <div>
                    <h4 className="font-medium text-white mb-2">Professional Summary</h4>
                    <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg">
                      <p className="text-slate-300">{summary.summary}</p>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="font-medium text-white mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {summary.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 rounded-lg text-sm border border-cyan-500/30">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Strengths & Recommendations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-white mb-2">Strengths</h4>
                      <div className="space-y-2">
                        {summary.strengths.map((strength, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded border border-emerald-500/20">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5"></div>
                            <span className="text-sm text-slate-300">{strength}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-2">Recommendations</h4>
                      <div className="space-y-2">
                        {summary.recommendations.map((recommendation, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded border border-amber-500/20">
                            <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5"></div>
                            <span className="text-sm text-slate-300">{recommendation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="p-4 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-white/10">
                    <h4 className="font-medium text-white mb-2">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-slate-400">Email</p>
                        <p className="font-medium text-white">{summary.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Phone</p>
                        <p className="font-medium text-white">{summary.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Current Company</p>
                        <p className="font-medium text-white">{summary.currentCompany}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Education</p>
                        <p className="font-medium text-white">{summary.education}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Instructions & History with  Theme */}
        <div className="space-y-6">
          {/* Instructions Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">How It Works</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-white">Upload CV</p>
                    <p className="text-sm text-slate-400">Upload PDF or DOC file</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-white">AI Processing</p>
                    <p className="text-sm text-slate-400">AI analyzes content</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-white">Get Summary</p>
                    <p className="text-sm text-slate-400">Receive detailed analysis</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-white">Take Action</p>
                    <p className="text-sm text-slate-400">Copy, download, or share</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Card */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-6">
            <h4 className="font-medium text-white mb-3">Benefits</h4>
            <ul className="text-sm text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <FiCheck className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span>Save 90% screening time</span>
              </li>
              <li className="flex items-start gap-2">
                <FiCheck className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span>Unbiased candidate evaluation</span>
              </li>
              <li className="flex items-start gap-2">
                <FiCheck className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span>Consistent scoring methodology</span>
              </li>
              <li className="flex items-start gap-2">
                <FiCheck className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span>Integration with ATS systems</span>
              </li>
            </ul>
          </div>

          {/* Recent Summaries */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Recent Summaries</h3>
                <button className="text-sm text-cyan-400 hover:text-cyan-300">View All</button>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: "Neha Singh", role: "HR Executive", score: 72, date: "Today" },
                  { name: "Rajesh Kumar", role: "Accountant", score: 90, date: "Yesterday" },
                  { name: "Sneha Patel", role: "DevOps Engineer", score: 65, date: "2 days ago" },
                ].map((item, index) => (
                  <div key={index} className="p-3 rounded-lg border border-white/10 hover:border-cyan-500/30 bg-slate-800/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-sm text-slate-400">{item.role}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          item.score >= 80 ? "text-emerald-400" :
                          item.score >= 60 ? "text-amber-400" :
                          "text-rose-400"
                        }`}>{item.score}%</div>
                        <p className="text-xs text-slate-500">{item.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6">
            <h4 className="font-medium text-white mb-3">Tips for Best Results</h4>
            <ul className="text-sm text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1"></div>
                <span>Use clear, readable CV formats</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1"></div>
                <span>Ensure text is selectable (not scanned images)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1"></div>
                <span>Include detailed work experience</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1"></div>
                <span>Verify contact information accuracy</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CvSummarizer;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Briefcase, DollarSign, 
  Heart, Globe, Award, Users as UsersIcon,
  ArrowRight, Upload, Mail, Phone, FileText,
  CheckCircle, Clock, Home, Linkedin, Github,
  ExternalLink
} from 'lucide-react';

export default function CareersPage() {
  const navigate = useNavigate();
  
  // Mock database for storing applications (in real app, use backend API)
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('litehr_applications');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    coverLetter: '',
    linkedin: '',
    github: '',
    resume: null,
    resumeName: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const careerPositions = [
    {
      id: 1,
      title: "Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      salary: "$90,000 - $120,000",
      description: "Build amazing user interfaces with React and modern web technologies for our HR platform.",
      requirements: [
        "3+ years experience with React",
        "Strong JavaScript/TypeScript skills",
        "Experience with Tailwind CSS",
        "Knowledge of REST APIs"
      ]
    },
    {
      id: 2,
      title: "HR Product Manager",
      department: "Product",
      location: "New York, NY",
      type: "Full-time",
      salary: "$110,000 - $140,000",
      description: "Lead product strategy and development for our HR management platform.",
      requirements: [
        "5+ years in product management",
        "Experience with HR/SAAS products",
        "Strong analytical skills",
        "Agile/Scrum experience"
      ]
    },
    {
      id: 3,
      title: "UX/UI Designer",
      department: "Design",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$85,000 - $110,000",
      description: "Design intuitive and beautiful interfaces for HR professionals.",
      requirements: [
        "Portfolio of design work",
        "Experience with Figma/Adobe XD",
        "User research experience",
        "Understanding of design systems"
      ]
    },
    {
      id: 4,
      title: "Backend Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      salary: "$100,000 - $130,000",
      description: "Build scalable backend systems and APIs for HR automation.",
      requirements: [
        "Node.js/Python experience",
        "Database design (SQL/NoSQL)",
        "API design and security",
        "Cloud platform experience (AWS/Azure)"
      ]
    },
    {
      id: 5,
      title: "Customer Success Manager",
      department: "Operations",
      location: "Chicago, IL",
      type: "Full-time",
      salary: "$75,000 - $95,000",
      description: "Ensure customer satisfaction and help clients maximize our HR platform.",
      requirements: [
        "3+ years in customer success",
        "HR/SAAS experience",
        "Excellent communication skills",
        "Problem-solving mindset"
      ]
    },
    {
      id: 6,
      title: "Sales Executive",
      department: "Sales",
      location: "Remote",
      type: "Full-time",
      salary: "$80,000 + Commission",
      description: "Drive sales and grow our customer base for LiteHR.",
      requirements: [
        "Proven sales track record",
        "B2B SAAS experience",
        "Strong negotiation skills",
        "Self-motivated and driven"
      ]
    },
  ];

  const benefits = [
    { icon: <DollarSign size={24} />, title: "Competitive Salary", description: "Above industry average compensation with regular reviews" },
    { icon: <Heart size={24} />, title: "Health & Wellness", description: "Comprehensive medical, dental, vision insurance for you and family" },
    { icon: <Globe size={24} />, title: "Remote Friendly", description: "Work from anywhere with flexible hours" },
    { icon: <Award size={24} />, title: "Career Growth", description: "Regular promotions, learning budget, and conference allowances" },
    { icon: <UsersIcon size={24} />, title: "Team Culture", description: "Collaborative, inclusive environment with regular team events" },
    { icon: <Briefcase size={24} />, title: "Flexible PTO", description: "Unlimited vacation days and paid time off" },
  ];

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setApplicationForm({
      ...applicationForm,
      position: job.title
    });
    document.getElementById('apply-form').scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        alert('Please upload PDF or DOC/DOCX files only');
        return;
      }
      setApplicationForm({
        ...applicationForm,
        resume: file,
        resumeName: file.name
      });
    }
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    
    if (!applicationForm.resume) {
      alert('Please upload your resume');
      return;
    }

    // Create application object
    const newApplication = {
      id: Date.now(),
      ...applicationForm,
      appliedDate: new Date().toISOString(),
      status: 'pending',
      jobDetails: selectedJob,
      timestamp: new Date().toISOString()
    };

    // Save to localStorage (in real app, send to backend API)
    const updatedApplications = [...applications, newApplication];
    setApplications(updatedApplications);
    localStorage.setItem('litehr_applications', JSON.stringify(updatedApplications));

    // Reset form and show success
    setApplicationForm({
      name: '',
      email: '',
      phone: '',
      position: '',
      coverLetter: '',
      linkedin: '',
      github: '',
      resume: null,
      resumeName: ''
    });
    setSelectedJob(null);
    setShowSuccess(true);
    
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] to-[#0F172A] text-white">
      {/* Navigation Bar */}
      <header className="fixed top-0 left-0 w-full h-16 bg-[#0F172A]/90 backdrop-blur-md z-50 px-6 md:px-20 border-b border-[#374151]">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="h-10 w-10 bg-gradient-to-r from-[#8B5CF6] to-[#10B981] rounded-lg flex items-center justify-center">
              <Briefcase size={20} />
            </div>
            <span className="text-2xl font-semibold tracking-wide">LiteHR Careers</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="text-sm hover:text-[#8B5CF6] transition flex items-center gap-2"
            >
              <Home size={16} />
              Back to Home
            </button>
            <button 
              onClick={() => navigate('/manager/dashboard')}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] px-4 py-2 rounded-lg text-sm transition shadow-lg"
            >
              Employee Login
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-6 md:px-20 bg-gradient-to-r from-[#0F172A] to-[#1E293B]">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[rgba(139,92,246,0.2)] px-4 py-2 rounded-full text-sm text-[#8B5CF6] mb-6">
              <Briefcase size={16} />
              We're Hiring!
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Build the Future of
              <span className="block bg-gradient-to-r from-[#8B5CF6] to-[#10B981] bg-clip-text text-transparent">
                HR Technology
              </span>
            </h1>
            <p className="text-xl text-[#9CA3AF] max-w-3xl mx-auto mb-10">
              Join our mission to revolutionize HR management. We're looking for passionate 
              individuals who want to make an impact on how companies manage their most valuable asset - people.
            </p>
            <button 
              onClick={() => document.getElementById('open-positions').scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transition"
            >
              View Open Positions
              <ArrowRight size={18} />
            </button>
          </div>
        </section>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-24 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slideIn">
            <CheckCircle size={20} />
            <div>
              <div className="font-semibold">Application Submitted!</div>
              <div className="text-sm">We'll review your application and get back to you soon.</div>
            </div>
          </div>
        )}

        {/* Open Positions */}
        <section id="open-positions" className="py-20 px-6 md:px-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Open Positions</h2>
              <p className="text-lg text-[#9CA3AF] max-w-2xl mx-auto">
                Find the perfect role that matches your skills and passion
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {careerPositions.map((job) => (
                <div key={job.id} className="bg-[#1E293B] rounded-xl p-6 border border-[#374151] hover:border-[#8B5CF6] transition-all hover:shadow-xl group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold group-hover:text-[#8B5CF6] transition">{job.title}</h3>
                      <p className="text-sm text-[#10B981] font-medium">{job.department}</p>
                    </div>
                    <span className="bg-[rgba(139,92,246,0.2)] text-[#8B5CF6] text-xs font-semibold px-3 py-1 rounded-full">
                      {job.type}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-[#D1D5DB]">
                      <MapPin size={16} className="text-[#9CA3AF]" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#D1D5DB]">
                      <DollarSign size={16} className="text-[#9CA3AF]" />
                      <span>{job.salary}</span>
                    </div>
                  </div>
                  
                  <p className="text-[#9CA3AF] text-sm mb-4 line-clamp-3">{job.description}</p>
                  
                  <div className="mb-6">
                    <div className="text-sm font-medium text-[#F9FAFB] mb-2">Key Requirements:</div>
                    <ul className="space-y-1">
                      {job.requirements.slice(0, 3).map((req, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                          <div className="w-1 h-1 bg-[#8B5CF6] rounded-full"></div>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button 
                    onClick={() => handleApplyClick(job)}
                    className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2 group-hover:gap-3"
                  >
                    Apply Now
                    <ArrowRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section id="apply-form" className="py-20 px-6 md:px-20 bg-[#0F172A]">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#1E293B] rounded-2xl p-8 border border-[#374151]">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-[rgba(139,92,246,0.2)] rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-[#8B5CF6]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    {selectedJob ? `Apply for: ${selectedJob.title}` : 'Apply for Position'}
                  </h3>
                  <p className="text-[#9CA3AF]">Fill out your application below</p>
                </div>
              </div>
              
              <form onSubmit={handleSubmitApplication} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={applicationForm.name}
                      onChange={(e) => setApplicationForm({...applicationForm, name: e.target.value})}
                      className="w-full bg-[#111827] border border-[#374151] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={applicationForm.email}
                      onChange={(e) => setApplicationForm({...applicationForm, email: e.target.value})}
                      className="w-full bg-[#111827] border border-[#374151] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={applicationForm.phone}
                      onChange={(e) => setApplicationForm({...applicationForm, phone: e.target.value})}
                      className="w-full bg-[#111827] border border-[#374151] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Position *</label>
                    <select
                      required
                      value={applicationForm.position}
                      onChange={(e) => {
                        const job = careerPositions.find(j => j.title === e.target.value);
                        setSelectedJob(job);
                        setApplicationForm({...applicationForm, position: e.target.value});
                      }}
                      className="w-full bg-[#111827] border border-[#374151] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                    >
                      <option value="">Select a position</option>
                      {careerPositions.map(job => (
                        <option key={job.id} value={job.title}>{job.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-2">LinkedIn Profile</label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]" size={18} />
                      <input
                        type="url"
                        value={applicationForm.linkedin}
                        onChange={(e) => setApplicationForm({...applicationForm, linkedin: e.target.value})}
                        className="w-full bg-[#111827] border border-[#374151] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-2">GitHub Profile</label>
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]" size={18} />
                      <input
                        type="url"
                        value={applicationForm.github}
                        onChange={(e) => setApplicationForm({...applicationForm, github: e.target.value})}
                        className="w-full bg-[#111827] border border-[#374151] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                        placeholder="https://github.com/yourusername"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Cover Letter *</label>
                  <textarea
                    required
                    value={applicationForm.coverLetter}
                    onChange={(e) => setApplicationForm({...applicationForm, coverLetter: e.target.value})}
                    rows="5"
                    className="w-full bg-[#111827] border border-[#374151] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                    placeholder="Tell us about yourself, your experience, and why you're interested in this position..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Resume/CV *</label>
                  <div className="space-y-4">
                    <label className="block cursor-pointer">
                      <div className="bg-[#111827] border-2 border-dashed border-[#374151] rounded-lg px-4 py-8 text-center hover:border-[#8B5CF6] transition">
                        <Upload className="mx-auto mb-3 text-[#9CA3AF]" size={28} />
                        <div className="text-[#D1D5DB] font-medium mb-1">Click to upload your resume</div>
                        <div className="text-sm text-[#9CA3AF]">PDF, DOC, DOCX up to 5MB</div>
                        <input 
                          type="file" 
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          required
                        />
                      </div>
                    </label>
                    
                    {applicationForm.resumeName && (
                      <div className="flex items-center justify-between bg-[#111827] rounded-lg px-4 py-3 border border-[#374151]">
                        <div className="flex items-center gap-3">
                          <FileText size={20} className="text-[#8B5CF6]" />
                          <div>
                            <div className="text-[#F9FAFB] font-medium">{applicationForm.resumeName}</div>
                            <div className="text-sm text-[#9CA3AF]">Ready to submit</div>
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setApplicationForm({...applicationForm, resume: null, resumeName: ''})}
                          className="text-sm text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#10B981] hover:from-[#7C3AED] hover:to-[#059669] text-white font-bold py-4 px-6 rounded-lg transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    Submit Application
                    <ArrowRight size={18} />
                  </button>
                  <p className="text-sm text-[#9CA3AF] text-center mt-3">
                    By submitting, you agree to our privacy policy. We'll contact you within 5-7 business days.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-6 md:px-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Join LiteHR</h2>
              <p className="text-lg text-[#9CA3AF] max-w-2xl mx-auto">
                We're building more than software - we're building a culture
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-[#1E293B] rounded-xl p-6 hover:bg-[#2D3748] transition group">
                  <div className="w-14 h-14 bg-gradient-to-br from-[rgba(139,92,246,0.2)] to-[rgba(16,185,129,0.2)] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                    <div className="text-[#8B5CF6]">
                      {benefit.icon}
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold mb-3 text-[#F9FAFB]">{benefit.title}</h4>
                  <p className="text-[#9CA3AF]">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 md:px-20 bg-gradient-to-r from-[#8B5CF6] to-[#10B981]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Build with Us?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Don't see the perfect role? We're always looking for talented individuals.
            </p>
            <button 
              onClick={() => document.getElementById('apply-form').scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-[#8B5CF6] hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              Submit General Application
              <ExternalLink size={18} />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#020617] py-8 border-t border-[#374151]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-r from-[#8B5CF6] to-[#10B981] rounded-lg flex items-center justify-center">
                <Briefcase size={20} />
              </div>
              <span className="text-xl font-semibold">LiteHR Careers</span>
            </div>
            
            <p className="text-sm text-[#9CA3AF] text-center">
              © 2025 LiteHR. All rights reserved. | Privacy Policy | Terms of Service
            </p>
            
            <button 
              onClick={() => navigate('/manager/dashboard')}
              className="text-sm text-[#9CA3AF] hover:text-white transition flex items-center gap-2"
            >
              <ArrowRight size={14} />
              Employee Portal
            </button>
          </div>
        </div>
      </footer>

      {/* Add CSS for animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
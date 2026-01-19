import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff,
  FiBriefcase,
  FiCheck,
  FiArrowRight,
  FiArrowLeft
} from "react-icons/fi";

const Register = ({ setUser }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    companyName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const nextStep = () => {
    if (!formData.username || !formData.email) {
      setError("Please fill in all required fields");
      return;
    }
    setStep(2);
    setError("");
  };

  const prevStep = () => {
    setStep(1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.password) {
      setError("Password is required");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const res = await axios.post("/api/users/register", formData);
      localStorage.setItem("token", res.data.token);
      setUser(res.data);
      navigate("/admin/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      
      {/* BACKGROUND DECORATION */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-slate-900/30 rounded-full filter blur-3xl"></div>
      </div>

      {/* TWO COLUMN LAYOUT */}
      <div className="flex min-h-screen">
        
        {/* LEFT PANEL - DESCRIPTION & BENEFITS */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative">
          <div className="max-w-md mx-auto relative">
            {/* BRANDING */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                  <FiBriefcase className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">LiteHR</h1>
              </div>
              <h2 className="text-4xl font-bold mb-6 leading-tight text-white">
                Join Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-300">HR Platform</span>
              </h2>
              <p className="text-slate-300 text-lg mb-8">
                Streamline your HR processes and manage your team efficiently with our comprehensive solution.
              </p>
            </div>

            {/* BENEFITS */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-cyan-400 text-lg">⚡</span>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1 text-white">Quick Setup</h4>
                  <p className="text-slate-300 text-sm">Get started in minutes with easy onboarding</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-400 text-lg">🔒</span>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1 text-white">Secure & Compliant</h4>
                  <p className="text-slate-300 text-sm">Enterprise-grade security & data protection</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-300 text-lg">📈</span>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1 text-white">Advanced Analytics</h4>
                  <p className="text-slate-300 text-sm">Insights to optimize your workforce</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - REGISTRATION FORM */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
          <div className="relative w-full max-w-md animate-slideUp">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-3xl blur-xl opacity-30"></div>
            
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-white/10">
              
              {/* Header section */}
              <div className="p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-blue-500/10"></div>
                
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                
                <div className="relative">
                  <h2 className="text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                    Create Account
                  </h2>
                  <p className="text-slate-300">Join thousands of HR professionals</p>
                </div>
              </div>

              <div className="p-8">
                {/* PROGRESS STEPS */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 'bg-slate-800/50 text-slate-600 border border-slate-700'}`}>
                      {step === 1 ? '1' : <FiCheck className="w-4 h-4" />}
                    </div>
                    <span className={`text-sm font-medium ${step === 1 ? 'text-cyan-400' : 'text-slate-400'}`}>
                      Basic Info
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-slate-700 mx-4"></div>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 'bg-slate-800/50 text-slate-600 border border-slate-700'}`}>
                      2
                    </div>
                    <span className={`text-sm font-medium ${step === 2 ? 'text-cyan-400' : 'text-slate-400'}`}>
                      Security
                    </span>
                  </div>
                </div>

                {/* ERROR DISPLAY */}
                {error && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-rose-900/20 to-red-900/20 rounded-xl border border-rose-500/30">
                    <p className="text-rose-300 text-sm">{error}</p>
                  </div>
                )}

                {/* REGISTRATION FORM */}
                <form onSubmit={handleSubmit}>
                  {step === 1 ? (
                    <div className="space-y-6">
                      {/* USERNAME */}
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Username *
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiUser className="h-5 w-5 text-slate-500" />
                          </div>
                          <input
                            type="text"
                            name="username"
                            required
                            autoComplete="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full pl-10 p-4 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition duration-200 text-white placeholder-slate-500 group-hover:border-slate-600"
                            placeholder="Enter username"
                          />
                        </div>
                      </div>

                      {/* EMAIL */}
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Work Email *
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMail className="h-5 w-5 text-slate-500" />
                          </div>
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 p-4 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition duration-200 text-white placeholder-slate-500 group-hover:border-slate-600"
                            placeholder="you@company.com"
                          />
                        </div>
                      </div>

                      {/* COMPANY NAME (OPTIONAL) */}
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Company Name (Optional)
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiBriefcase className="h-5 w-5 text-slate-500" />
                          </div>
                          <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            className="w-full pl-10 p-4 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition duration-200 text-white placeholder-slate-500 group-hover:border-slate-600"
                            placeholder="Your company name"
                          />
                        </div>
                      </div>

                      {/* NEXT BUTTON */}
                      <button
                        type="button"
                        onClick={nextStep}
                        className="relative group w-full p-4 rounded-xl font-semibold"
                      >
                        {/* Glow effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>

                        {/* Button content */}
                        <div className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 p-4">
                          <span>Continue to Security</span>
                          <FiArrowRight className="w-5 h-5" />
                        </div>

                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* PASSWORD */}
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Password *
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="h-5 w-5 text-slate-500" />
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-10 pr-12 p-4 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition duration-200 text-white placeholder-slate-500 group-hover:border-slate-600"
                            placeholder="Create a strong password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? (
                              <FiEyeOff className="h-5 w-5 text-slate-500 hover:text-slate-300" />
                            ) : (
                              <FiEye className="h-5 w-5 text-slate-500 hover:text-slate-300" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                          Use at least 8 characters with a mix of letters, numbers & symbols
                        </p>
                      </div>

                      {/* PASSWORD STRENGTH */}
                      <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-700/50">
                        <h4 className="text-sm font-semibold text-white mb-2">Password Strength</h4>
                        <div className="flex gap-1 mb-2">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                                formData.password.length > i * 2
                                  ? formData.password.length > 6
                                    ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                                    : formData.password.length > 4
                                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                                    : 'bg-gradient-to-r from-rose-500 to-red-500'
                                  : 'bg-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-slate-400">
                          {formData.password.length === 0
                            ? 'Enter a password'
                            : formData.password.length < 4
                            ? 'Too weak'
                            : formData.password.length < 6
                            ? 'Could be stronger'
                            : 'Strong password'}
                        </p>
                      </div>

                      {/* BUTTONS */}
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="relative group flex-1 p-4 rounded-xl font-medium"
                        >
                          <div className="absolute -inset-1 bg-gradient-to-r from-slate-700/30 to-slate-800/30 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
                          <div className="relative flex items-center justify-center gap-2 bg-slate-800/50 border border-slate-700 text-slate-300 rounded-xl hover:border-slate-600 hover:text-white transition-colors p-4">
                            <FiArrowLeft className="w-4 h-4" />
                            <span>Back</span>
                          </div>
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="relative group flex-1 p-4 rounded-xl font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {/* Glow effect */}
                          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                          
                          {/* Button content */}
                          <div className="relative bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 p-4">
                            {isLoading ? (
                              <div className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Creating Account...</span>
                              </div>
                            ) : (
                              "Create Account"
                            )}
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* LOGIN LINK */}
                  <div className="text-center mt-8 pt-6 border-t border-slate-700">
                    <p className="text-slate-400">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Energy line */}
            <div className="absolute -bottom-4 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent blur-sm"></div>
          </div>
        </div>
      </div>

      {/* ANIMATIONS */}
      <style>{`
        .animate-slideUp {
          animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Register;
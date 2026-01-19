import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { HiLockClosed, HiEye, HiEyeOff, HiCheckCircle } from "react-icons/hi";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const validatePassword = (pwd) => {
    setRequirements({
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    });
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    validatePassword(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validate password strength
    const allMet = Object.values(requirements).every(req => req);
    if (!allMet) {
      setError("Please meet all password requirements");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`/api/users/reset-password/${token}`, { password });
      setMessage("Password reset successful! Redirecting to login...");
      
      // Show success animation
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-slate-900/30 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md animate-slideUp">
        {/* Glow effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-3xl blur-xl opacity-30"></div>
        
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-white/10">
          
          <div className="p-8 text-center relative overflow-hidden">
            {/* Header glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-blue-500/10"></div>
            
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{animationDelay: '0.5s'}}></div>
            
            <div className="relative">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                <HiLockClosed className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-300">
                Reset Password
              </h2>
              <p className="text-slate-300">Create a new secure password</p>
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-gradient-to-r from-rose-900/20 to-red-900/20 rounded-xl border border-rose-500/30">
                <p className="text-rose-300 text-sm">{error}</p>
              </div>
            )}
            
            {message && (
              <div className="mb-6 p-4 bg-gradient-to-r from-emerald-900/20 to-green-900/20 rounded-xl border border-emerald-500/30">
                <div className="flex items-center gap-3">
                  <HiCheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <p className="text-emerald-300 text-sm">{message}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  New Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiLockClosed className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full pl-10 pr-12 p-4 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition duration-200 text-white placeholder-slate-500 group-hover:border-slate-600"
                    required
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <HiEyeOff className="h-5 w-5 text-slate-500 hover:text-slate-300" />
                    ) : (
                      <HiEye className="h-5 w-5 text-slate-500 hover:text-slate-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiLockClosed className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full pl-10 pr-12 p-4 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition duration-200 text-white placeholder-slate-500 group-hover:border-slate-600"
                    required
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirm ? (
                      <HiEyeOff className="h-5 w-5 text-slate-500 hover:text-slate-300" />
                    ) : (
                      <HiEye className="h-5 w-5 text-slate-500 hover:text-slate-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* PASSWORD REQUIREMENTS */}
              <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-700/50">
                <h4 className="text-sm font-semibold text-white mb-3">
                  Password Requirements
                </h4>
                <div className="space-y-2">
                  {[
                    { key: 'length', text: 'At least 8 characters' },
                    { key: 'uppercase', text: 'One uppercase letter' },
                    { key: 'lowercase', text: 'One lowercase letter' },
                    { key: 'number', text: 'One number' },
                    { key: 'special', text: 'One special character' },
                  ].map((req) => (
                    <div key={req.key} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        requirements[req.key]
                          ? 'bg-gradient-to-br from-emerald-500 to-green-500 border-emerald-500/50'
                          : 'border-slate-600 bg-slate-900/50'
                      }`}>
                        {requirements[req.key] && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </div>
                      <span className={`text-sm ${
                        requirements[req.key] ? 'text-emerald-400' : 'text-slate-400'
                      }`}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* STRENGTH METER */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-white">
                    Password Strength
                  </span>
                  <span className="text-sm text-slate-400">
                    {Object.values(requirements).filter(req => req).length}/5
                  </span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => {
                    const met = Object.values(requirements).filter(req => req).length >= i;
                    return (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full ${
                          met
                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                            : 'bg-slate-700'
                        } ${met ? 'animate-pulse' : ''}`}
                        style={{animationDelay: `${i * 100}ms`}}
                      />
                    );
                  })}
                </div>
              </div>

              {/* SUBMIT BUTTON  */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative group w-full p-4 rounded-xl font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
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
                      <span>Resetting Password...</span>
                    </div>
                  ) : (
                    'Reset Password'
                  )}
                </div>
              </button>

              {/* BACK TO LOGIN */}
              <div className="-center pt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium text-sm transition-colors group"
                >
                  <span className="group-hover:-translate-x-1 transition-transform">←</span>
                  <span>Back to Login</span>
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/*energy lines */}
        <div className="absolute -bottom-4 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent blur-sm"></div>
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

export default ResetPassword;
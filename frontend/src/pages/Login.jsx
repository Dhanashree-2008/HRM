import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff,
  FiUsers,
  FiCalendar,
  FiShield
} from "react-icons/fi";

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setIsLoading(true);

    try {
      const res = await axios.post("/api/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      // Persist employeeId for profile loading (if available)
      if (res.data.user?.employee?.id) {
        localStorage.setItem('employeeId', res.data.user.employee.id);
      }
      setUser(res.data.user);
      
      // Redirect based on role
      const role = res.data.user?.role;
      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (role === "MANAGER") {
        navigate("/manager/dashboard");
      } else if (role === "EMPLOYEE") {
        navigate("/employee/dashboard");
      } else {
        navigate("/admin/dashboard"); // fallback
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setInfo("");

    if (!formData.email) {
      setError("Please enter your email to reset your password.");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("/api/users/forgot-password", {
        email: formData.email,
      });
      setInfo(`Password reset link sent to ${formData.email}. Check your inbox.`);
    } catch (err) {
      setError(err.response?.data?.message || "Error sending reset link.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-slate-900/30 rounded-full filter blur-3xl"></div>
      </div>

      {/* TWO COLUMN LAYOUT */}
      <div className="flex min-h-screen">
        
        {/* LEFT PANEL - DESCRIPTION & FEATURES */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative">
          <div className="max-w-md mx-auto relative">
            {/* BRANDING */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">HR</span>
              </div>
              <h1 className="text-3xl font-bold text-white">LiteHR</h1>
            </div>
            
            {/* WELCOME MESSAGE */}
            <h2 className="text-4xl font-bold mb-6 leading-tight text-white">
              Welcome Back to <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-300">LiteHR</span>
            </h2>
            
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              Streamline your HR processes with our intuitive platform. Manage attendance, leaves, and employee data effortlessly.
            </p>

            {/* FEATURES LIST */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <FiCalendar className="text-emerald-400" />
                </div>
                <span className="text-slate-300">Real-time Attendance Tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <FiUsers className="text-cyan-400" />
                </div>
                <span className="text-slate-300">Employee Management System</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <FiShield className="text-purple-400" />
                </div>
                <span className="text-slate-300">Secure & Encrypted Data</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - LOGIN FORM */}
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
                  <h2 className="text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-300">
                    Sign In
                  </h2>
                  <p className="text-slate-300">Enter your credentials to access your dashboard</p>
                </div>
              </div>

              <div className="p-8">
                {/* ALERTS */}
                {error && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-rose-900/20 to-red-900/20 rounded-xl border border-rose-500/30">
                    <p className="text-rose-300 text-sm">{error}</p>
                  </div>
                )}
                
                {info && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-emerald-900/20 to-green-900/20 rounded-xl border border-emerald-500/30">
                    <p className="text-emerald-300 text-sm">{info}</p>
                  </div>
                )}

                {/* LOGIN FORM */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* EMAIL INPUT */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-5 w-5 text-slate-500" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 p-4 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition duration-200 text-white placeholder-slate-500 group-hover:border-slate-600"
                        placeholder="you@company.com"
                      />
                    </div>
                  </div>

                  {/* PASSWORD INPUT */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-white">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
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
                        placeholder="Enter your password"
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
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="relative group w-full p-4 rounded-xl font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>

                    {/* Button content */}
                    <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 p-4">

{isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Signing In...</span>
                        </div>
                      ) : (
                        "Sign In"
                      )}
                    </div>
                  </button>

                  {/* REGISTER LINK */}
                  <div className="text-center pt-4">
                    <p className="text-slate-400">
                      Don't have an account?{" "}
                      <Link
                        to="/register"
                        className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                      >
                        Create Account
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

export default Login;
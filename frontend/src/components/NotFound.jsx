import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  HiHome, 
  HiExclamationCircle, 
  HiArrowLeft,
  HiSearch,
  HiCloud
} from "react-icons/hi";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Add some fun effects
    const handleMouseMove = (e) => {
      const cards = document.querySelectorAll('.floating-card');
      cards.forEach(card => {
        const speed = card.getAttribute('data-speed');
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        card.style.transform = `translateX(${x}px) translateY(${y}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 floating-card" data-speed="0.2"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-slate-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 floating-card" data-speed="0.3"></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-slate-900 rounded-full mix-blend-multiply filter blur-3xl opacity-10 floating-card" data-speed="0.1"></div>
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Animated 404 Text */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
              404
            </h1>
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl animate-pulse">
              <HiExclamationCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          
          {/* Animated Line */}
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto my-6 rounded-full"></div>
          
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Page Not Found
          </h2>
          
          <p className="text-lg text-slate-600 max-w-md mx-auto mb-8">
            Oops! The page you're looking for seems to have wandered off into the digital void.
          </p>
        </div>

        {/* Search Box */}
        <div className="w-full max-w-md mb-10 animate-slideUp">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiSearch className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-700"
              placeholder="What are you looking for?"
              readOnly
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-slate-700 font-medium rounded-xl shadow-md hover:shadow-lg hover:bg-slate-50 transition-all duration-300 border border-slate-200 group"
          >
            <HiArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
          
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 group"
          >
            <HiHome className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Back to Home
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="w-full max-w-2xl">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <HiCloud className="w-5 h-5 mr-2 text-blue-500" />
              Quick Links
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Link
                to="/dashboard"
                className="p-4 bg-slate-50 hover:bg-blue-50 rounded-xl border border-slate-200 hover:border-blue-200 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                  <span className="text-blue-600 font-bold">📊</span>
                </div>
                <h4 className="font-medium text-slate-800 mb-1">Dashboard</h4>
                <p className="text-sm text-slate-500">Main dashboard</p>
              </Link>
              
              <Link
                to="/attendance"
                className="p-4 bg-slate-50 hover:bg-green-50 rounded-xl border border-slate-200 hover:border-green-200 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
                  <span className="text-green-600 font-bold">📅</span>
                </div>
                <h4 className="font-medium text-slate-800 mb-1">Attendance</h4>
                <p className="text-sm text-slate-500">Track attendance</p>
              </Link>
              
              <Link
                to="/employees"
                className="p-4 bg-slate-50 hover:bg-purple-50 rounded-xl border border-slate-200 hover:border-purple-200 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                  <span className="text-purple-600 font-bold">👥</span>
                </div>
                <h4 className="font-medium text-slate-800 mb-1">Employees</h4>
                <p className="text-sm text-slate-500">Manage team</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Fun Animation */}
        <div className="mt-12 flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
          <span className="text-sm text-slate-500 ml-2">Still searching...</span>
        </div>
      </div>

      {/* Footer Note */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-sm text-slate-500">
          Need help?{' '}
          <a href="mailto:support@litehr.com" className="text-blue-500 hover:underline">
            Contact Support
          </a>
        </p>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
        
        .floating-card {
          transition: transform 0.1s ease-out;
        }
        
        /* Add a subtle pulse to the main 404 */
        @keyframes subtlePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.9; }
        }
        
        .animate-pulse {
          animation: subtlePulse 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
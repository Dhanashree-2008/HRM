import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/LiteHR_logo.png";
import hero1 from "../images/hero3.jpg";
import hero2 from "../images/hero2.jpg";
import hero3 from "../images/hero3.jpg";
import { 
  Menu, X, Clock, Calendar, BarChart3, 
  ChevronRight, LogIn, Users, TrendingUp, Shield,
  Zap, CheckCircle, Briefcase, Home
} from "lucide-react";

export default function Homepage() {
  const navigate = useNavigate();
  const slides = [hero1, hero2, hero3];
  const [index, setIndex] = useState(0);
  const [menu, setMenu] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Navigation handlers
  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleCareersClick = () => {
    navigate("/careers");
  };

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-[#F9FAFB] overflow-x-hidden">

      {/* ============= PREMIUM NAVBAR ============= */}
      <header className="
        fixed top-0 left-0 w-full h-16 
        bg-[#0F172A]/90 backdrop-blur-md
        text-white flex items-center justify-between 
        shadow-[0_3px_20px_rgba(0,0,0,0.35)]
        z-50 px-6 md:px-20 border-b border-[#374151]
      ">
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="LiteHR"
            className="h-10 w-10 object-contain rounded-md"
          />
          <span className="text-2xl font-semibold tracking-wide">LiteHR</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex gap-8 text-sm tracking-wide">
          <button 
            onClick={() => navigate("/")}
            className="relative text-sm tracking-wide hover:text-[#8B5CF6] transition group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8B5CF6] group-hover:w-full transition-all duration-300"></span>
          </button>
          <button 
            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            className="relative text-sm tracking-wide hover:text-[#8B5CF6] transition group"
          >
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8B5CF6] group-hover:w-full transition-all duration-300"></span>
          </button>
          <button 
            onClick={() => document.getElementById('modules').scrollIntoView({ behavior: 'smooth' })}
            className="relative text-sm tracking-wide hover:text-[#8B5CF6] transition group"
          >
            Modules
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8B5CF6] group-hover:w-full transition-all duration-300"></span>
          </button>
          <button 
            onClick={handleCareersClick}
            className="relative text-sm tracking-wide hover:text-[#8B5CF6] transition group"
          >
            Careers
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8B5CF6] group-hover:w-full transition-all duration-300"></span>
          </button>
        </nav>

        {/* Login Button */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handleLoginClick}
            className="
              bg-[#8B5CF6] hover:bg-[#7C3AED]
              px-5 py-2 text-sm rounded-lg shadow-lg 
              transition-all duration-300 hover:shadow-xl
              hover:scale-[1.05] active:scale-[0.98]
              flex items-center gap-2
            "
          >
            <LogIn size={16} />
            Login
          </button>

          <button
            onClick={() => setMenu(!menu)}
            className="sm:hidden p-2 rounded-lg hover:bg-[#1E293B] transition"
          >
            {menu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      {menu && (
        <div className="
          fixed top-16 left-0 w-full bg-[#0F172A] text-white p-6
          sm:hidden z-40 border-b border-[#1F2937]
        ">
          <div className="flex flex-col gap-4 text-sm">
            <button 
              onClick={() => {
                navigate("/");
                setMenu(false);
              }}
              className="py-3 border-b border-[#1F2937] hover:bg-[#1E293B] px-2 rounded transition text-[#D1D5DB] flex items-center gap-2"
            >
              <Home size={16} />
              Home
            </button>
            <button 
              onClick={() => {
                document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
                setMenu(false);
              }}
              className="py-3 border-b border-[#1F2937] hover:bg-[#1E293B] px-2 rounded transition text-[#D1D5DB]"
            >
              Features
            </button>
            <button 
              onClick={() => {
                document.getElementById('modules').scrollIntoView({ behavior: 'smooth' });
                setMenu(false);
              }}
              className="py-3 border-b border-[#1F2937] hover:bg-[#1E293B] px-2 rounded transition text-[#D1D5DB]"
            >
              Modules
            </button>
            <button 
              onClick={() => {
                handleCareersClick();
                setMenu(false);
              }}
              className="py-3 border-b border-[#1F2937] hover:bg-[#1E293B] px-2 rounded transition text-[#D1D5DB] flex items-center gap-2"
            >
              <Briefcase size={16} />
              Careers
            </button>
            <button 
              onClick={() => {
                handleLoginClick();
                setMenu(false);
              }}
              className="
                bg-[#8B5CF6] hover:bg-[#7C3AED] px-4 py-3 rounded-lg shadow transition
                flex items-center justify-center gap-2
              "
            >
              <LogIn size={16} />
              Login
            </button>
          </div>
        </div>
      )}

      {/* ============= HERO SECTION ============= */}
      <section className="
        pt-24 md:pt-28 pb-20 px-6 md:px-20 
        flex flex-col md:flex-row items-center gap-16 
        bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#1E293B] relative
      ">
        {/* TEXT */}
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 bg-[rgba(139,92,246,0.2)] px-3 py-1 rounded-full text-sm text-[#D1D5DB] mb-4">
            <Zap size={14} />
            Streamlined HR Operations
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-[#F9FAFB] mb-6 tracking-tight">
            Internal HR Automation{" "}
            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#10B981] bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[#9CA3AF] max-w-xl mb-10">
            A modern internal system designed for employees, managers & admins to
            digitally manage attendance, leaves, work logs, and team activity —
            without using spreadsheets.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleGetStarted}
              className="
                bg-[#8B5CF6] hover:bg-[#7C3AED] text-white
                px-10 py-3 rounded-lg font-medium
                flex items-center gap-2 transition-all
                shadow-lg hover:shadow-xl
              "
            >
              Get Started
              <ChevronRight size={18} />
            </button>
            
            <button 
              onClick={handleCareersClick}
              className="
                bg-transparent border border-[#8B5CF6] text-[#8B5CF6]
                hover:bg-[#8B5CF6]/10 px-10 py-3 rounded-lg font-medium
                flex items-center gap-2 transition-all
                shadow-lg hover:shadow-xl
              "
            >
              <Briefcase size={18} />
              View Careers
            </button>
          </div>
        </div>

        {/* IMAGE SLIDER */}
        <div className="flex-1 w-full max-w-2xl">
          <div className="relative rounded-2xl shadow-2xl hover:shadow-[0_25px_60px_rgba(0,0,0,0.25)] transition-all duration-500">
            <img
              src={slides[index]}
              className="w-full h-[320px] md:h-[430px] rounded-2xl object-cover border-[6px] border-[#1E293B]"
              alt="HR Management Dashboard"
            />
            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`
                    w-2 h-2 rounded-full transition-all
                    ${i === index 
                      ? "w-8 bg-[#8B5CF6]" 
                      : "bg-[#374151] hover:bg-[#8B5CF6]"}
                  `}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============= FEATURES ============= */}
      <section id="features" className="py-20 px-6 md:px-20 bg-[#0F172A]">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#F9FAFB]">Key Features</h2>
          <p className="text-[#9CA3AF] max-w-2xl mx-auto">
            Experience seamless HR management with our intuitive features
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Clock size={22} />} 
            title="Mark Attendance" 
            description="Real-time attendance tracking with geolocation support"
            isActive={activeFeature === 0}
            onClick={() => setActiveFeature(0)}
          />
          <FeatureCard 
            icon={<Calendar size={22} />} 
            title="Leave Management" 
            description="Automated approval workflows and balance tracking"
            isActive={activeFeature === 1}
            onClick={() => setActiveFeature(1)}
          />
          <FeatureCard 
            icon={<BarChart3 size={22} />} 
            title="Work Log Submissions" 
            description="Daily task logging with productivity insights"
            isActive={activeFeature === 2}
            onClick={() => setActiveFeature(2)}
          />
        </div>

        {/* Feature Details Panel */}
        <div className="mt-12 bg-[#1E293B] rounded-2xl p-8 shadow-lg border border-[#374151]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#111827] rounded-lg flex items-center justify-center shadow">
              {activeFeature === 0 ? <Clock size={24} className="text-[#8B5CF6]" /> : 
               activeFeature === 1 ? <Calendar size={24} className="text-[#10B981]" /> : 
               <BarChart3 size={24} className="text-[#3B82F6]" />}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#F9FAFB]">
                {activeFeature === 0 ? "Attendance System" :
                 activeFeature === 1 ? "Leave Management" :
                 "Work Log Analytics"}
              </h3>
              <p className="text-[#9CA3AF]">Feature highlights and benefits</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-[#F9FAFB]">How It Works</h4>
              <p className="text-[#D1D5DB]">
                {activeFeature === 0 ? "Employees can clock in/out with a single click, view their attendance history, and request shift changes. Managers receive instant notifications for attendance exceptions." :
                 activeFeature === 1 ? "Submit leave requests, track balances, and get automated approvals. Managers can approve or reject requests with comments. All leave types are supported." :
                 "Log daily tasks, track project progress, and generate productivity reports. Managers can monitor team performance and identify bottlenecks."}
              </p>
            </div>
            
            <div className="bg-[#111827] rounded-xl p-6 shadow">
              <h4 className="font-semibold text-lg mb-4 text-[#F9FAFB]">Benefits</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-[#D1D5DB]">
                  <CheckCircle size={18} className="text-[#10B981]" />
                  <span>Real-time updates and notifications</span>
                </li>
                <li className="flex items-center gap-2 text-[#D1D5DB]">
                  <CheckCircle size={18} className="text-[#10B981]" />
                  <span>Mobile-friendly interface</span>
                </li>
                <li className="flex items-center gap-2 text-[#D1D5DB]">
                  <CheckCircle size={18} className="text-[#10B981]" />
                  <span>Automated reporting</span>
                </li>
                <li className="flex items-center gap-2 text-[#D1D5DB]">
                  <CheckCircle size={18} className="text-[#10B981]" />
                  <span>Role-based access control</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============= MODULES ============= */}
      <section id="modules" className="py-20 bg-[#1E293B] px-6 md:px-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#F9FAFB]">System Modules</h2>
          <p className="text-[#9CA3AF] max-w-2xl mx-auto">
            Tailored interfaces for different organizational roles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ModuleCard 
            title="Employee Portal" 
            items={[
              "Attendance (IN/OUT)",
              "Leave Requests",
              "Daily Work Summaries",
              "Attendance History"
            ]}
            icon={<Users />}
            color="purple"
          />

          <ModuleCard 
            title="Manager Portal" 
            items={[
              "Approve Attendance",
              "Approve Leaves",
              "Monitor Team Work Logs",
              "Team Overview & Analytics"
            ]}
            icon={<TrendingUp />}
            color="green"
          />

          <ModuleCard 
            title="Admin Portal" 
            items={[
              "Employee Master Records",
              "Role & Department Setup",
              "Leave Policies",
              "Full HR Reporting"
            ]}
            icon={<Shield />}
            color="blue"
          />
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-6 md:px-20 bg-gradient-to-r from-[#8B5CF6] to-[#10B981]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Simplify Your HR Processes?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join the modern approach to HR management
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={handleLoginClick}
              className="
                bg-white text-[#8B5CF6] hover:bg-[#F9FAFB]
                px-8 py-3 rounded-lg font-semibold
                flex items-center gap-2 transition-all shadow-lg
              "
            >
              <LogIn size={18} />
              Login to Dashboard
            </button>
            
            <button 
              onClick={handleCareersClick}
              className="
                bg-transparent border-2 border-white text-white hover:bg-white/10
                px-8 py-3 rounded-lg font-semibold
                flex items-center gap-2 transition-all shadow-lg
              "
            >
              <Briefcase size={18} />
              View Open Positions
            </button>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-20 px-6 md:px-20 bg-[#0F172A]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#F9FAFB]">About LiteHR</h2>
          <p className="text-lg text-[#D1D5DB] mb-8">
            LiteHR is a digitized internal HR solution aimed to replace spreadsheets
            and provide real-time attendance, approval workflows, and consolidated
            reporting for small teams. Our platform streamlines HR processes while
            maintaining data security and compliance.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-[#8B5CF6]">100%</div>
              <div className="text-sm text-[#9CA3AF]">Secure</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-[#10B981]">24/7</div>
              <div className="text-sm text-[#9CA3AF]">Availability</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-[#3B82F6]">99.9%</div>
              <div className="text-sm text-[#9CA3AF]">Uptime</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-[#F59E0B]">0</div>
              <div className="text-sm text-[#9CA3AF]">Spreadsheets</div>
            </div>
          </div>
        </div>
      </section>

      {/* PREMIUM FOOTER */}
      <footer className="w-full bg-[#020617] text-white py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                src={logo}
                alt="LiteHR"
                className="h-10 w-10 object-contain rounded-md"
              />
              <span className="text-xl font-semibold tracking-wide">LiteHR</span>
            </div>
            
            <p className="text-sm text-[#9CA3AF] text-center">
              Internal HR Automation System • © 2025 (Not for commercial use)
            </p>
            
            <div className="flex gap-6">
              <button 
                onClick={handleLoginClick}
                className="text-[#9CA3AF] hover:text-[#F9FAFB] transition text-sm"
              >
                Login
              </button>
              <button 
                onClick={handleCareersClick}
                className="text-[#9CA3AF] hover:text-[#F9FAFB] transition text-sm"
              >
                Careers
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ============= Components ============= */

function FeatureCard({ icon, title, description, isActive, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`
        bg-[#1E293B] rounded-xl p-6 text-left transition-all border
        ${isActive 
          ? 'shadow-xl border-[#8B5CF6] -translate-y-1' 
          : 'shadow-lg hover:shadow-xl hover:-translate-y-1 hover:border-[rgba(139,92,246,0.3)]'}
      `}
    >
      <div className={`
        w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all
        ${isActive ? 'bg-[rgba(139,92,246,0.2)] text-[#8B5CF6]' : 'bg-[#111827] text-[#9CA3AF]'}
      `}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-[#F9FAFB]">{title}</h3>
      <p className="text-[#9CA3AF] text-sm">{description}</p>
      {isActive && (
        <div className="mt-4 flex items-center text-[#8B5CF6] text-sm">
          <span>Selected</span>
          <ChevronRight size={16} className="ml-1" />
        </div>
      )}
    </button>
  );
}

function ModuleCard({ title, items, icon, color }) {
  const colorClasses = {
    purple: "bg-[rgba(139,92,246,0.2)] text-[#8B5CF6]",
    green: "bg-[rgba(16,185,129,0.2)] text-[#10B981]",
    blue: "bg-[rgba(59,130,246,0.2)] text-[#3B82F6]"
  };

  const dotColors = {
    purple: "bg-[#8B5CF6]",
    green: "bg-[#10B981]",
    blue: "bg-[#3B82F6]"
  };

  return (
    <div className="bg-[#1E293B] rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all border border-[#374151] group hover:-translate-y-1 hover:border-[rgba(139,92,246,0.3)]">
      <div className={`w-14 h-14 ${colorClasses[color]} rounded-xl flex items-center justify-center mb-6`}>
        {React.cloneElement(icon, { size: 28 })}
      </div>
      <h3 className="text-2xl font-bold mb-5 text-[#F9FAFB]">{title}</h3>
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-3 text-[#D1D5DB]">
            <div className={`w-2 h-2 rounded-full ${dotColors[color]}`}></div>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FiUsers, FiArrowLeft, FiEdit2, FiBriefcase, FiMapPin, FiClock, FiDollarSign, FiCalendar, FiCheckCircle } from "react-icons/fi";
import jobService from "../../../services/jobService";
import { toast } from "react-hot-toast";


const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const data = await jobService.getJobById(id);
                setJob(data);
            } catch (error) {
                console.error("Error fetching job details:", error);
                toast.error("Failed to load job details");
                navigate("/admin/recruitment/jobs");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchJob();
        }
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!job) {
        return null;
    }

    return (
        <div className="w-full text-white">
            {/* Header */}
            <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 p-8 shadow-2xl">
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                                <Link
                                    to="/admin/recruitment/jobs"
                                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                                >
                                    <FiArrowLeft className="w-5 h-5" />
                                </Link>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${job.status === "Active"
                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                    : "bg-slate-700/50 border-slate-600 text-slate-300"
                                    }`}>
                                    {job.status}
                                </span>
                            </div>

                            <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
                            <div className="flex flex-wrap gap-4 text-slate-300 text-sm">
                                <span className="flex items-center gap-1.5">
                                    <FiUsers className="w-4 h-4 text-cyan-400" />
                                    {job.department}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <FiBriefcase className="w-4 h-4 text-purple-400" />
                                    {job.jobType}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <FiMapPin className="w-4 h-4 text-rose-400" />
                                    {job.location || "Remote"}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <FiClock className="w-4 h-4 text-amber-400" />
                                    Posted {new Date(job.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <Link
                            to={`/admin/recruitment/edit-job/${job.id}`}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-colors shadow-lg shadow-white/10"
                        >
                            <FiEdit2 className="w-4 h-4" />
                            Edit Posting
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Description */}
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <FiBriefcase className="w-5 h-5 text-cyan-400" />
                            Job Description
                        </h2>
                        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
                            {job.description}
                        </div>
                    </div>

                    {/* Requirements */}
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <FiCheckCircle className="w-5 h-5 text-emerald-400" />
                            Requirements
                        </h2>
                        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
                            {job.requirements}
                        </div>
                    </div>

                    {/* Responsibilities */}
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <FiCheckCircle className="w-5 h-5 text-emerald-400" />
                            Responsibilities
                        </h2>
                        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
                            {job.responsibilities}
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <FiCheckCircle className="w-5 h-5 text-emerald-400" />
                            Skills
                        </h2>
                        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
                            {job.skills}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Key Details Card */}
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                        <h3 className="text-lg font-semibold text-white mb-4">Key Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                    <FiDollarSign className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Salary Range</p>
                                    <p className="font-medium text-white">
                                        {job.salaryRangeMin && job.salaryRangeMax
                                            ? `₹${job.salaryRangeMin} - ₹${job.salaryRangeMax}`
                                            : "Not specified"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                    <FiBriefcase className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Experience</p>
                                    <p className="font-medium text-white">
                                        {job.experienceMin || job.experienceMax
                                            ? `${job.experienceMin || 0} - ${job.experienceMax || "10+"} Years`
                                            : "Not specified"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                                    <FiCalendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Application Deadline</p>
                                    <p className="font-medium text-white">
                                        {job.deadline ? new Date(job.deadline).toLocaleDateString() : "No deadline"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                                    <FiCalendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Openings</p>
                                    <p className="font-medium text-white">
                                        {job.openings}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;

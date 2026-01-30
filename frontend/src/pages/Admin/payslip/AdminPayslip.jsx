import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiDownload, FiCheckCircle, FiPlus, FiSearch, FiFilter, FiX } from "react-icons/fi";

const AdminPayslip = () => {
    const [payslips, setPayslips] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");

    // Modal State
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [generateData, setGenerateData] = useState({
        employeeId: "",
        month: new Date().getMonth() + 1, // Current month (1-12)
        year: new Date().getFullYear()
    });
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchPayslips();
        fetchEmployees();
    }, []);

    const fetchPayslips = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("/api/payslips", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPayslips(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching payslips:", error);
            toast.error("Failed to load payslips");
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("/api/admin/employees", {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Normalize data: backend returns Users with nested employeeProfile
            // We need to extract the employee profile part
            const validEmployees = response.data
                .filter(user => user.employee || user.employeeProfile) // Ensure employee profile exists
                .map(user => {
                    const emp = user.employee || user.employeeProfile;
                    return {
                        id: emp.id,
                        fullName: emp.fullName,
                        employeeCode: emp.employeeCode
                    };
                });

            setEmployees(validEmployees);
        } catch (error) {
            console.error("Error fetching employees for dropdown:", error);
        }
    };

    const handleGeneratePayslip = async (e) => {
        e.preventDefault();

        if (!generateData.employeeId) {
            toast.error("Please select an employee");
            return;
        }

        setGenerating(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post("/api/payslips/generate", generateData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Payslip generated successfully");
            setShowGenerateModal(false);
            fetchPayslips(); // Refresh list
        } catch (error) {
            console.error("Generate error:", error);
            toast.error(error.response?.data?.message || "Failed to generate payslip");
        } finally {
            setGenerating(false);
        }
    };

    const handlePublish = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`/api/payslips/${id}/publish`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Payslip published successfully");
            fetchPayslips();
        } catch (error) {
            toast.error("Failed to publish payslip");
        }
    };

    const filteredPayslips = payslips.filter(payslip => {
        const matchesSearch = payslip.employee?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payslip.employee?.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "ALL" || payslip.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6 relative">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-black">
                        Payslips
                    </h1>

                    <p className="text-gray-600 dark:text-gray-400">Manage employee payslips</p>
                </div>
                <button
                    onClick={() => setShowGenerateModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <FiPlus /> Generate Payslip
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by employee name or code..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <FiFilter className="text-gray-500" />
                    <select
                        className="border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="ALL">All Status</option>
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200 text-sm uppercase">
                                <th className="px-6 py-3 font-medium">Employee</th>
                                <th className="px-6 py-3 font-medium">Month/Year</th>
                                <th className="px-6 py-3 font-medium">Net Salary</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">Loading payslips...</td>
                                </tr>
                            ) : filteredPayslips.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No payslips found.</td>
                                </tr>
                            ) : (
                                filteredPayslips.map((payslip) => (
                                    <tr key={payslip.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                                            <div className="font-medium">{payslip.employee?.fullName || "Unknown"}</div>
                                            <div className="text-xs text-gray-500">{payslip.employee?.employeeCode}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                                            {payslip.month}/{payslip.year}
                                        </td>
                                        <td className="px-6 py-4 text-gray-800 dark:text-gray-200 font-medium">
                                            ₹{parseFloat(payslip.netSalary).toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${payslip.status === "PUBLISHED"
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                }`}>
                                                {payslip.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            {payslip.status === "DRAFT" && (
                                                <button
                                                    onClick={() => handlePublish(payslip.id)}
                                                    className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                                                    title="Publish"
                                                >
                                                    <FiCheckCircle size={18} />
                                                </button>
                                            )}
                                            <button
                                                className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                                title="Download PDF"
                                            >
                                                <FiDownload size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Generate Payslip Modal */}
            {showGenerateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold dark:text-white">Generate Payslip</h3>
                            <button onClick={() => setShowGenerateModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                <FiX size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleGeneratePayslip} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Employee</label>
                                <select
                                    className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    value={generateData.employeeId}
                                    onChange={(e) => setGenerateData({ ...generateData, employeeId: e.target.value })}
                                    required
                                >
                                    <option value="">-- Choose Employee --</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.fullName} ({emp.employeeCode})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Month</label>
                                    <select
                                        className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        value={generateData.month}
                                        onChange={(e) => setGenerateData({ ...generateData, month: e.target.value })}
                                        required
                                    >
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                            <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'long' })}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
                                    <input
                                        type="number"
                                        min="2020"
                                        max="2030"
                                        className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        value={generateData.year}
                                        onChange={(e) => setGenerateData({ ...generateData, year: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowGenerateModal(false)}
                                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={generating}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {generating ? "Generating..." : "Generate"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPayslip;

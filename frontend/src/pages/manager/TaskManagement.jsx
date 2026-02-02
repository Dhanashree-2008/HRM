import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Search,
    Plus,
    Filter,
    MoreVertical,
    Calendar,
    User,
    Clock,
    CheckCircle,
    AlertCircle,
    X,
    Target,
    List,
    Grid
} from "lucide-react";
import toast from "react-hot-toast";
import { managerService } from "../../services/managerService";

const TaskManagement = () => {
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        assignedToEmployeeId: "",
        priority: "MEDIUM",
        dueDate: ""
    });

    const { isDarkMode = true } = useOutletContext() || {};

    // Theme colors synchronized with Dashboard.jsx
    const themeColors = isDarkMode ? {
        primary: '#8b5cf6',      // Purple
        secondary: '#10b981',    // Green
        accent: '#3b82f6',       // Blue
        warning: '#f59e0b',      // Amber
        danger: '#ef4444',       // Red
        background: '#0f172a',   // Dark background
        card: '#1e293b',         // Dark card
        text: '#f9fafb',         // Light text
        muted: '#9ca3af',        // Muted text
        border: '#374151',       // Border color
        inputBg: '#1e293b',      // Input background
    } : {
        primary: '#2563eb',      // Blue
        secondary: '#10b981',    // Green
        accent: '#8b5cf6',       // Purple
        warning: '#f59e0b',      // Amber
        danger: '#ef4444',       // Red
        background: '#f8fafc',   // Light slate
        card: '#ffffff',         // White
        text: '#1e293b',         // Slate 800
        muted: '#64748b',        // Slate 500
        border: '#e2e8f0',       // Light border
        inputBg: '#ffffff',      // Input background
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [tasksData, employeesData] = await Promise.all([
                managerService.getTeamTasks(),
                managerService.getEmployees()
            ]);
            setTasks(tasksData);

            // API returns users with nested employee profile: [{ id, email, employee: { ... } }]
            // We need to extract the employee profile and filter out those without one
            const rawList = Array.isArray(employeesData) ? employeesData : (employeesData.employees || []);

            const empList = rawList
                .filter(user => user.employee)
                .map(user => ({
                    id: user.employee.id, // Use Employee ID
                    fullName: user.employee.fullName,
                    department: user.employee.department
                }));

            setEmployees(empList);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await managerService.createTask(formData);
            toast.success("Task assigned successfully");
            setShowModal(false);
            setFormData({
                title: "",
                description: "",
                assignedToEmployeeId: "",
                priority: "MEDIUM",
                dueDate: ""
            });
            fetchData(); // Refresh list
        } catch (error) {
            console.error("Error creating task:", error);
            toast.error(error.response?.data?.message || "Failed to assign task");
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "HIGH": return { bg: `${themeColors.danger}20`, text: themeColors.danger, border: themeColors.danger };
            case "MEDIUM": return { bg: `${themeColors.warning}20`, text: themeColors.warning, border: themeColors.warning };
            case "LOW": return { bg: `${themeColors.secondary}20`, text: themeColors.secondary, border: themeColors.secondary };
            default: return { bg: `${themeColors.muted}20`, text: themeColors.muted, border: themeColors.muted };
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "COMPLETED": return { bg: `${themeColors.secondary}20`, text: themeColors.secondary };
            case "IN_PROGRESS": return { bg: `${themeColors.accent}20`, text: themeColors.accent };
            case "PENDING": return { bg: `${themeColors.warning}20`, text: themeColors.warning };
            default: return { bg: `${themeColors.muted}20`, text: themeColors.muted };
        }
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.assignee?.fullName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "ALL" || task.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 transition-colors duration-300" style={{ backgroundColor: themeColors.background, minHeight: '100vh', padding: '1.5rem' }}>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold transition-colors duration-300" style={{ color: themeColors.text }}>Task Management</h1>
                    <p className="transition-colors duration-300" style={{ color: themeColors.muted }}>Assign and track team tasks</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center px-4 py-2 text-white rounded-lg shadow-sm hover:opacity-90 transition-colors duration-300"
                    style={{ backgroundColor: themeColors.primary }}
                >
                    <Plus size={20} className="mr-2" />
                    Assign Task
                </button>
            </div>

            {/* Filters & Controls */}
            <div className="flex flex-col md:flex-row gap-4 rounded-xl border shadow-sm p-4 transition-colors duration-300" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}>
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300" size={20} style={{ color: themeColors.muted }} />
                    <input
                        type="text"
                        placeholder="Search tasks or assignees..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300"
                        style={{
                            backgroundColor: themeColors.inputBg,
                            borderColor: themeColors.border,
                            color: themeColors.text,
                            '--tw-ring-color': themeColors.primary
                        }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <select
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300"
                        style={{
                            backgroundColor: themeColors.inputBg,
                            borderColor: themeColors.border,
                            color: themeColors.text,
                            '--tw-ring-color': themeColors.primary
                        }}
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                    <div className="flex border rounded-lg overflow-hidden transition-colors duration-300" style={{ borderColor: themeColors.border }}>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 transition-colors duration-300`}
                            style={{
                                backgroundColor: viewMode === "list" ? `${themeColors.primary}20` : themeColors.card,
                                color: viewMode === "list" ? themeColors.primary : themeColors.muted
                            }}
                        >
                            <List size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 transition-colors duration-300`}
                            style={{
                                backgroundColor: viewMode === "grid" ? `${themeColors.primary}20` : themeColors.card,
                                color: viewMode === "grid" ? themeColors.primary : themeColors.muted
                            }}
                        >
                            <Grid size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Task List/Grid */}
            {loading ? (
                <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto" style={{ borderColor: themeColors.primary }}></div>
                </div>
            ) : filteredTasks.length === 0 ? (
                <div className="text-center py-12 rounded-xl border border-dashed transition-colors duration-300" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}>
                    <Target className="mx-auto h-12 w-12 transition-colors duration-300" style={{ color: themeColors.muted }} />
                    <h3 className="mt-2 text-sm font-medium transition-colors duration-300" style={{ color: themeColors.text }}>No tasks found</h3>
                    <p className="mt-1 text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>Get started by assigning a new task.</p>
                </div>
            ) : viewMode === "list" ? (
                <div className="rounded-xl border shadow-sm overflow-hidden transition-colors duration-300" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}>
                    <table className="w-full">
                        <thead className="transition-colors duration-300" style={{ backgroundColor: isDarkMode ? themeColors.background : '#f8fafc', borderBottom: `1px solid ${themeColors.border}` }}>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" style={{ color: themeColors.muted }}>Task</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" style={{ color: themeColors.muted }}>Assignee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" style={{ color: themeColors.muted }}>Priority</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" style={{ color: themeColors.muted }}>Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" style={{ color: themeColors.muted }}>Due Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y transition-colors duration-300" style={{ divideColor: themeColors.border }}>
                            {filteredTasks.map((task) => (
                                <tr key={task.id} className="hover:opacity-90 transition-colors duration-300" style={{ backgroundColor: themeColors.card }}>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium transition-colors duration-300" style={{ color: themeColors.text }}>{task.title}</div>
                                        {task.description && <div className="text-xs truncate max-w-xs transition-colors duration-300" style={{ color: themeColors.muted }}>{task.description}</div>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs mr-3 transition-colors duration-300" style={{ backgroundColor: `${themeColors.primary}20`, color: themeColors.primary }}>
                                                {task.assignee?.fullName?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium transition-colors duration-300" style={{ color: themeColors.text }}>{task.assignee?.fullName}</div>
                                                <div className="text-xs transition-colors duration-300" style={{ color: themeColors.muted }}>{task.assignee?.department}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {(() => {
                                            const styles = getPriorityColor(task.priority);
                                            return (
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border`}
                                                    style={{ backgroundColor: styles.bg, color: styles.text, borderColor: styles.border }}>
                                                    {task.priority}
                                                </span>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {(() => {
                                            const styles = getStatusColor(task.status);
                                            return (
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}
                                                    style={{ backgroundColor: styles.bg, color: styles.text }}>
                                                    {task.status.replace("_", " ")}
                                                </span>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-6 py-4 text-sm transition-colors duration-300" style={{ color: themeColors.muted }}>
                                        <div className="flex items-center">
                                            <Calendar size={14} className="mr-1.5" />
                                            {task.dueDate || "No deadline"}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTasks.map((task) => (
                        <div key={task.id} className="rounded-xl border shadow-sm p-6 hover:shadow-md transition-all duration-300" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}>
                            <div className="flex justify-between items-start mb-4">
                                {(() => {
                                    const styles = getPriorityColor(task.priority);
                                    return (
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border`}
                                            style={{ backgroundColor: styles.bg, color: styles.text, borderColor: styles.border }}>
                                            {task.priority}
                                        </span>
                                    );
                                })()}
                                {(() => {
                                    const styles = getStatusColor(task.status);
                                    return (
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}
                                            style={{ backgroundColor: styles.bg, color: styles.text }}>
                                            {task.status.replace("_", " ")}
                                        </span>
                                    );
                                })()}
                            </div>
                            <h3 className="text-lg font-semibold mb-2 transition-colors duration-300" style={{ color: themeColors.text }}>{task.title}</h3>
                            <p className="text-sm mb-4 line-clamp-2 transition-colors duration-300" style={{ color: themeColors.muted }}>{task.description || "No description provided."}</p>

                            <div className="flex items-center justify-between border-t pt-4 mt-auto transition-colors duration-300" style={{ borderColor: isDarkMode ? '#334155' : '#f1f5f9' }}>
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs mr-2 transition-colors duration-300" style={{ backgroundColor: `${themeColors.primary}20`, color: themeColors.primary }}>
                                        {task.assignee?.fullName?.charAt(0) || "U"}
                                    </div>
                                    <div className="text-sm">
                                        <div className="font-medium transition-colors duration-300" style={{ color: themeColors.text }}>{task.assignee?.fullName}</div>
                                    </div>
                                </div>
                                <div className="text-xs flex items-center transition-colors duration-300" style={{ color: themeColors.muted }}>
                                    <Calendar size={14} className="mr-1" />
                                    {task.dueDate || "No date"}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Task Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-colors duration-300" style={{ backgroundColor: themeColors.card }}>
                        <div className="flex justify-between items-center p-6 border-b transition-colors duration-300" style={{ borderColor: themeColors.border }}>
                            <h3 className="text-xl font-bold transition-colors duration-300" style={{ color: themeColors.text }}>Assign New Task</h3>
                            <button onClick={() => setShowModal(false)} className="hover:opacity-80 transition-colors duration-300" style={{ color: themeColors.muted }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 transition-colors duration-300" style={{ color: themeColors.text }}>Task Title <span style={{ color: themeColors.danger }}>*</span></label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300"
                                    style={{
                                        backgroundColor: themeColors.inputBg,
                                        borderColor: themeColors.border,
                                        color: themeColors.text,
                                        '--tw-ring-color': themeColors.primary
                                    }}
                                    placeholder="e.g. Prepare Q1 Report"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 transition-colors duration-300" style={{ color: themeColors.text }}>Description</label>
                                <textarea
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300 resize-none h-24"
                                    style={{
                                        backgroundColor: themeColors.inputBg,
                                        borderColor: themeColors.border,
                                        color: themeColors.text,
                                        '--tw-ring-color': themeColors.primary
                                    }}
                                    placeholder="Task details..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 transition-colors duration-300" style={{ color: themeColors.text }}>Assign To <span style={{ color: themeColors.danger }}>*</span></label>
                                    <select
                                        required
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300"
                                        style={{
                                            backgroundColor: themeColors.inputBg,
                                            borderColor: themeColors.border,
                                            color: themeColors.text,
                                            '--tw-ring-color': themeColors.primary
                                        }}
                                        value={formData.assignedToEmployeeId}
                                        onChange={(e) => setFormData({ ...formData, assignedToEmployeeId: e.target.value })}
                                    >
                                        <option value="">Select Employee</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id}>
                                                {emp.fullName} ({emp.department})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 transition-colors duration-300" style={{ color: themeColors.text }}>Due Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300"
                                        style={{
                                            backgroundColor: themeColors.inputBg,
                                            borderColor: themeColors.border,
                                            color: themeColors.text,
                                            '--tw-ring-color': themeColors.primary
                                        }}
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 transition-colors duration-300" style={{ color: themeColors.text }}>Priority</label>
                                <div className="flex gap-4">
                                    {["LOW", "MEDIUM", "HIGH"].map((p) => (
                                        <label key={p} className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="priority"
                                                value={p}
                                                checked={formData.priority === p}
                                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                                className="h-4 w-4 focus:ring-2 transition-colors duration-300"
                                                style={{ color: themeColors.primary, '--tw-ring-color': themeColors.primary }}
                                            />
                                            <span className="ml-2 text-sm capitalize transition-colors duration-300" style={{ color: themeColors.text }}>{p.toLowerCase()}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border rounded-lg hover:opacity-80 transition-colors duration-300"
                                    style={{ borderColor: themeColors.border, color: themeColors.text }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white rounded-lg shadow-md hover:opacity-90 transition-all duration-300"
                                    style={{ backgroundColor: themeColors.primary }}
                                >
                                    Assign Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskManagement;

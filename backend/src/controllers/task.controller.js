import {
  createTaskService,
  getMyTasksService,
  getTeamTasksService,
  updateTaskStatusService,
} from "../services/task.service.js";

export const createTaskController = async (req, res) => {
  try {
    const task = await createTaskService(req.user, req.body);
    res.status(201).json({ message: "Task created successfully", task });
  } catch (err) {
    console.error("Create task error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

export const myTasksController = async (req, res) => {
  try {
    const tasks = await getMyTasksService(req.user.employeeId);
    res.json(tasks);
  } catch (err) {
    console.error("My tasks error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

export const teamTasksController = async (req, res) => {
  try {
    const tasks = await getTeamTasksService(req.user);

    const mapped = tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate,
      createdAt: t.createdAt,
      assignee: t.assignee
        ? {
            id: t.assignee.id,
            fullName: t.assignee.fullName,
            department: t.assignee.department,
            designation: t.assignee.designation,
          }
        : null,
      assigner: t.assigner
        ? {
            id: t.assigner.id,
            fullName: t.assigner.fullName,
            department: t.assigner.department,
            designation: t.assigner.designation,
          }
        : null,
    }));

    res.json(mapped);
  } catch (err) {
    console.error("Team tasks error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

export const updateTaskStatusController = async (req, res) => {
  try {
    const { status } = req.body;
    const taskId = req.params.id;
    const task = await updateTaskStatusService(req.user, taskId, status);
    res.json({ message: "Task status updated", task });
  } catch (err) {
    console.error("Update task status error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

import { Employee, Task, User } from "../models/index.js";
import { createNotification } from "./notification.service.js";
import { sendEmail } from "../utils/email.js";

// MANAGER / ADMIN: assign task to employee
export const createTaskService = async (user, data) => {
  let { title, description, assignedToEmployeeId, priority, dueDate } = data;

  // If EMPLOYEE creates a task, it is self-assigned
  if (user.role === "EMPLOYEE") {
    assignedToEmployeeId = user.employeeId;
  }

  if (!title || !assignedToEmployeeId) {
    throw new Error("title and assignedToEmployeeId are required");
  }

  // ensure assignee exists
  const assignee = await Employee.findByPk(assignedToEmployeeId);
  if (!assignee) {
    throw new Error("Assigned employee not found");
  }

  // if MANAGER → allow assigning to ANYONE (Department restriction removed)
  if (user.role === "MANAGER") {
    const managerEmp = await Employee.findByPk(user.employeeId);
    if (!managerEmp) throw new Error("Manager employee profile not found");
  }

  const task = await Task.create({
    title,
    description,
    assignedToEmployeeId,
    assignedByEmployeeId: user.employeeId,
    priority: priority || "MEDIUM",
    dueDate: dueDate || null,
    status: "PENDING",
  });

  // 🔔 NOTIFY EMPLOYEE
  const assigneeUser = await User.findByPk(assignee.userId);

  await createNotification({
    userId: assigneeUser.id,
    title: "New Task Assigned",
    message: `Task assigned: ${task.title}`,
    type: "TASK",
  });
  await sendEmail({
    to: assigneeUser.email,
    subject: "New Task Assigned",
    text: `You have been assigned a task: ${task.title}`,
  });

  return task;
};

// EMPLOYEE: my tasks
export const getMyTasksService = async (employeeId) => {
  return Task.findAll({
    where: { assignedToEmployeeId: employeeId },
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: Employee,
        as: "assigner",
        attributes: ["id", "fullName", "department", "designation"],
      },
    ],
  });
};

// MANAGER / ADMIN: team tasks
export const getTeamTasksService = async (user) => {
  const include = [
    {
      model: Employee,
      as: "assignee",
    },
    {
      model: Employee,
      as: "assigner",
    },
  ];

  if (user.role === "MANAGER") {
    const managerEmp = await Employee.findByPk(user.employeeId);
    if (!managerEmp) throw new Error("Manager employee profile not found");

    include[0].where = { department: managerEmp.department };
  }

  return Task.findAll({
    include,
    order: [["createdAt", "DESC"]],
  });
};

// EMPLOYEE / MANAGER / ADMIN: update task status
export const updateTaskStatusService = async (user, taskId, newStatus) => {
  if (!["PENDING", "IN_PROGRESS", "COMPLETED"].includes(newStatus)) {
    throw new Error("Invalid task status");
  }

  const task = await Task.findByPk(taskId);
  if (!task) throw new Error("Task not found");

  // Employee can update only own tasks
  if (user.role === "EMPLOYEE") {
    if (task.assignedToEmployeeId !== user.employeeId) {
      throw new Error("You are not allowed to update this task");
    }
  }

  task.status = newStatus;
  await task.save();

  // 🔔 NOTIFY MANAGER / ASSIGNER
  if (task.assignedByEmployeeId) {
    const assigner = await Employee.findByPk(task.assignedByEmployeeId);
    const assignerUser = await User.findByPk(assigner.userId);

    await createNotification({
      userId: assignerUser.id,
      title: "Task Status Updated",
      message: `Task "${task.title}" updated to ${newStatus}`,
      type: "TASK",
    });
  }

  return task;
};

import { Employee, Worklog } from "../models/index.js";

// EMPLOYEE: add worklog
export const addWorklogService = async (employeeId, data) => {
  const { date, description, hoursWorked } = data;

  if (!date || !description) {
    throw new Error("date and description are required");
  }

  const entry = await Worklog.create({
    employeeId,
    date,
    description,
    hoursWorked: hoursWorked || null,
  });

  return entry;
};

// EMPLOYEE: get my worklogs
export const getMyWorklogsService = async (employeeId) => {
  return Worklog.findAll({
    where: { employeeId },
    order: [["date", "DESC"]],
  });
};

// MANAGER + ADMIN: view team worklogs
export const getTeamWorklogsService = async (user) => {
  const include = [
    {
      model: Employee,
      as: "employee",
    },
  ];

  if (user.role === "MANAGER") {
    const managerEmp = await Employee.findByPk(user.employeeId);

    include[0].where = { department: managerEmp.department };
  }

  return Worklog.findAll({
    include,
    order: [["date", "DESC"]],
  });
};

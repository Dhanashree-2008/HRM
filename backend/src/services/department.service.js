// src/services/department.service.js
import { Department, Employee } from "../models/index.js";

export const createDepartmentService = async (data) => {
  const { name, code, description, headEmployeeId } = data;

  // Check duplicate name
  const existing = await Department.findOne({ where: { name } });
  if (existing) throw new Error("Department name already exists");

  if (code) {
    const existingCode = await Department.findOne({ where: { code } });
    if (existingCode) throw new Error("Department code already exists");
  }

  return await Department.create({
    name,
    code,
    description,
    headEmployeeId,
    isActive: true,
  });
};

export const getDepartmentsService = async () => {
  const departments = await Department.findAll({
    include: [
      {
        model: Employee,
        as: "head",
        attributes: ["id", "fullName", "employeeCode", "designation"],
        required: false,
      },
    ],
    order: [["name", "ASC"]],
  });
  
  // Get employee counts for each department
  const departmentsWithEmployees = await Promise.all(
    departments.map(async (dept) => {
      const employeeCount = await Employee.count({
        where: { department: dept.name },
      });
      return {
        ...dept.toJSON(),
        employeeCount,
      };
    })
  );
  
  return departmentsWithEmployees;
};

export const getDepartmentByIdService = async (departmentId) => {
  const department = await Department.findByPk(departmentId, {
    include: [
      {
        model: Employee,
        as: "head",
        attributes: ["id", "fullName", "employeeCode", "designation"],
        required: false,
      },
    ],
  });

  if (!department) throw new Error("Department not found");
  
  // Get employees by department name (since department is string in Employee model)
  const employees = await Employee.findAll({
    where: { department: department.name },
    attributes: ["id", "fullName", "employeeCode", "designation", "status"],
  });
  
  return {
    ...department.toJSON(),
    employees,
  };
};

export const updateDepartmentService = async (departmentId, data) => {
  const department = await Department.findByPk(departmentId);
  if (!department) throw new Error("Department not found");

  // Check duplicate name if changed
  if (data.name && data.name !== department.name) {
    const existing = await Department.findOne({ where: { name: data.name } });
    if (existing) throw new Error("Department name already exists");
  }

  // Check duplicate code if changed
  if (data.code && data.code !== department.code) {
    const existing = await Department.findOne({ where: { code: data.code } });
    if (existing) throw new Error("Department code already exists");
  }

  await department.update(data);
  return department;
};

export const deleteDepartmentService = async (departmentId) => {
  const department = await Department.findByPk(departmentId);
  if (!department) throw new Error("Department not found");

  // Check if department has employees
  const employeeCount = await Employee.count({ where: { department: department.name } });
  if (employeeCount > 0) {
    throw new Error("Cannot delete department with existing employees");
  }

  await department.destroy();
  return { message: "Department deleted successfully" };
};


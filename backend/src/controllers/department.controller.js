// src/controllers/department.controller.js
import {
  createDepartmentService,
  getDepartmentsService,
  getDepartmentByIdService,
  updateDepartmentService,
  deleteDepartmentService,
} from "../services/department.service.js";

export const createDepartmentController = async (req, res) => {
  try {
    const department = await createDepartmentService(req.body);
    res.status(201).json({
      message: "Department created successfully",
      department,
    });
  } catch (err) {
    console.error("Create department error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

export const getDepartmentsController = async (req, res) => {
  try {
    const departments = await getDepartmentsService();
    res.json(departments);
  } catch (err) {
    console.error("Get departments error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDepartmentByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await getDepartmentByIdService(id);
    res.json(department);
  } catch (err) {
    console.error("Get department error:", err.message);
    res.status(404).json({ message: err.message });
  }
};

export const updateDepartmentController = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await updateDepartmentService(id, req.body);
    res.json({
      message: "Department updated successfully",
      department,
    });
  } catch (err) {
    console.error("Update department error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

export const deleteDepartmentController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteDepartmentService(id);
    res.json(result);
  } catch (err) {
    console.error("Delete department error:", err.message);
    res.status(400).json({ message: err.message });
  }
};




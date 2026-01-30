import { Role, Employee } from "../models/index.js";

// Get all roles
export const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll({
            include: [
                {
                    model: Employee,
                    as: "employees",
                    attributes: ["id"], // Only need count, but sequelize requires attributes to count
                },
            ],
        });

        const rolesWithCount = roles.map((role) => {
            const roleJson = role.toJSON();
            roleJson.userCount = role.employees.length;
            delete roleJson.employees;
            return roleJson;
        });

        res.json(rolesWithCount);
    } catch (error) {
        console.error("Error fetching roles:", error);
        res.status(500).json({ message: "Failed to fetch roles" });
    }
};

// Get role by ID
export const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.findByPk(id, {
            include: [
                {
                    model: Employee,
                    as: "employees",
                    attributes: ["id", "fullName", "department", "designation", "profileImage"]
                },
            ],
        });

        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        res.json(role);
    } catch (error) {
        console.error("Error fetching role:", error);
        res.status(500).json({ message: "Failed to fetch role" });
    }
};

// Create new role
export const createRole = async (req, res) => {
    try {
        const { name, description, permissions } = req.body;

        const existingRole = await Role.findOne({ where: { name } });
        if (existingRole) {
            return res.status(400).json({ message: "Role with this name already exists" });
        }

        const newRole = await Role.create({
            name,
            description,
            permissions,
        });

        res.status(201).json(newRole);
    } catch (error) {
        console.error("Error creating role:", error);
        res.status(500).json({ message: "Failed to create role" });
    }
};

// Update role
export const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, permissions, status } = req.body;

        const role = await Role.findByPk(id);
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        await role.update({
            name,
            description,
            permissions,
            status,
        });

        res.json(role);
    } catch (error) {
        console.error("Error updating role:", error);
        res.status(500).json({ message: "Failed to update role" });
    }
};

// Delete role
export const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        const role = await Role.findByPk(id);
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        // Check if any employees are assigned to this role
        const employeeCount = await Employee.count({ where: { roleId: id } });
        if (employeeCount > 0) {
            return res.status(400).json({ message: "Cannot delete role because it is assigned to employees." });
        }

        await role.destroy();

        res.json({ message: "Role deleted successfully" });
    } catch (error) {
        console.error("Error deleting role:", error);
        res.status(500).json({ message: "Failed to delete role" });
    }
};

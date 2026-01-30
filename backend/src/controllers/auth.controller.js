// src/controllers/auth.controller.js
import { loginService, forgotPasswordService, resetPasswordService } from "../services/auth.service.js";
import { User, Employee } from "../models/index.js";


export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const result = await loginService(email, password);

    res.json({
      message: "Login successful",
      ...result,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(401).json({ message: err.message || "Login failed" });
  }
};

export const meController = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      include: [
        {
          model: Employee,
          as: "employeeProfile",
        },
      ],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const username = user.username || user.email.split("@")[0];

    res.json({
      id: user.id,
      email: user.email,
      username: username,
      role: user.role,
      employee: user.employeeProfile
        ? {
          id: user.employeeProfile.id,
          fullName: user.employeeProfile.fullName,
          employeeCode: user.employeeProfile.employeeCode,
          department: user.employeeProfile.department,
          designation: user.employeeProfile.designation,
          phone: user.employeeProfile.phone,
          location: user.employeeProfile.location,
          status: user.employeeProfile.status,
          profileImage: user.employeeProfile.profileImage,
          basicSalary: user.employeeProfile.basicSalary,
          dateOfJoining: user.employeeProfile.dateOfJoining,
        }
        : null,
    });
  } catch (err) {
    console.error("ME error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateMeController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, department, position, joiningDate } = req.body;

    const user = await User.findByPk(userId, {
      include: [{ model: Employee, as: "employeeProfile" }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Update User email if provided
    if (email && email !== user.email) {
      // Check if email taken
      const exists = await User.findOne({ where: { email } });
      if (exists) return res.status(400).json({ message: "Email already in use" });
      user.email = email;
      await user.save();
    }

    // Update Employee details
    if (user.employeeProfile) {
      const emp = user.employeeProfile;
      if (name) emp.fullName = name;
      if (phone) emp.phone = phone;
      if (department) emp.department = department; // Note: Usually dept is managed by Admin, but allowing edit for now as per UI
      if (position) emp.designation = position;
      if (joiningDate) emp.dateOfJoining = joiningDate;

      await emp.save();
    }

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const result = await forgotPasswordService(email);
    res.json(result);
  } catch (err) {
    console.error("Forgot password error:", err.message);
    res.status(400).json({ message: err.message || "Failed to process request" });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const result = await resetPasswordService(token, password);
    res.json(result);
  } catch (err) {
    console.error("Reset password error:", err.message);
    res.status(400).json({ message: err.message || "Failed to reset password" });
  }
};

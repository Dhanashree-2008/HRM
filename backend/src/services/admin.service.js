import { User, Employee } from "../models/index.js";
import { Op } from "sequelize";
import { hashPassword } from "../utils/password.js";
import { LeaveType, EmployeeLeaveBalance } from "../models/index.js";
import { sendEmployeeCredentials } from "../utils/email.js";
import { sequelize } from "../config/db.js";

// Generate password from lastname + 4 random digits
const generatePassword = (fullName) => {
  // Extract lastname (last word in fullName)
  const nameParts = fullName.trim().split(/\s+/);
  const lastName = nameParts.length > 1
    ? nameParts[nameParts.length - 1]
    : nameParts[0];

  // Convert to lowercase and remove special characters
  const cleanLastName = lastName.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Generate 4 random digits
  const randomDigits = Math.floor(1000 + Math.random() * 9000);

  // Combine: lastname + 4 digits
  return `${cleanLastName}${randomDigits}`;
};

const generateEmployeeCode = async (role) => {
  const prefix = (role === "MANAGER" || role === "ADMIN") ? "MGR" : "EMP";

  // Find the last employee code with this prefix
  const lastEmployee = await Employee.findOne({
    where: {
      employeeCode: {
        [Op.like]: `${prefix}%`
      }
    },
    order: [['createdAt', 'DESC']],
    attributes: ['employeeCode']
  });

  let nextNum = 1;
  if (lastEmployee && lastEmployee.employeeCode) {
    // Extract numeric part (assuming format PRE001)
    const currentNum = parseInt(lastEmployee.employeeCode.replace(prefix, ''), 10);
    if (!isNaN(currentNum)) {
      nextNum = currentNum + 1;
    }
  }

  // Format as PRE001, PRE002, etc.
  return `${prefix}${String(nextNum).padStart(3, '0')}`;
};

export const createEmployeeService = async (data) => {
  const CURRENT_YEAR = new Date().getFullYear();
  const {
    email,
    password, // Optional - will be auto-generated if not provided
    role,
    fullName,
    employeeCode,
    department,
    designation,
    dateOfJoining,
    // New fields
    phone,
    personalEmail,
    dateOfBirth,
    gender,
    location,
    address,
    employmentType,
    shift,
    status,
    managerId,
    qualifications,
    experience,
    skills,
    profileImage,
  } = data;

  // Validate required fields
  if (!email) throw new Error("Email is required");
  if (!fullName) throw new Error("Full name is required");
  // if (!employeeCode) throw new Error("Employee code is required"); // No longer required

  // Auto-generate employee code if missing
  let finalEmployeeCode = employeeCode;
  if (!finalEmployeeCode) {
    finalEmployeeCode = await generateEmployeeCode(role);
  }

  // Check duplicate email
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error("Email already registered");

  // Check duplicate employee code
  const existingEmpCode = await Employee.findOne({ where: { employeeCode: finalEmployeeCode } });
  if (existingEmpCode) throw new Error(`Employee code ${finalEmployeeCode} already exists`);

  // Generate password automatically: lastname + 4 random digits
  const generatedPassword = password || generatePassword(fullName);

  // Hash password
  const passwordHash = await hashPassword(generatedPassword);

  // Use transaction to ensure both User and Employee are created or neither
  const transaction = await sequelize.transaction();

  try {
    // Create user
    const user = await User.create({
      email,
      passwordHash,
      role: role || "EMPLOYEE", // EMPLOYEE or MANAGER
      isActive: true,
    }, { transaction });

    // Create employee profile with all fields
    const employee = await Employee.create({
      userId: user.id,
      fullName,
      employeeCode: finalEmployeeCode,
      department,
      designation,
      dateOfJoining,
      phone,
      personalEmail,
      dateOfBirth,
      gender,
      location,
      address,
      employmentType,
      shift,
      status: status || "Active",
      managerId,
      qualifications,
      experience,
      skills,
      profileImage,
    }, { transaction });

    // Create leave balances for employee
    const leaveTypes = await LeaveType.findAll({ where: { isActive: true } });

    for (const type of leaveTypes) {
      await EmployeeLeaveBalance.create({
        employeeId: employee.id,
        leaveTypeId: type.id,
        year: CURRENT_YEAR,
        total: type.yearlyLimit,
        used: 0,
        remaining: type.yearlyLimit,
      }, { transaction });
    }

    // Commit transaction - all operations succeeded
    await transaction.commit();

    // Send credentials email to employee (after successful creation)
    try {
      await sendEmployeeCredentials({
        to: email,
        personalEmail: personalEmail || email,
        fullName,
        email,
        password: generatedPassword, // Send plain password in email
        employeeCode: finalEmployeeCode,
      });
    } catch (emailError) {
      // Log error but don't fail employee creation (already committed)
      console.error("Failed to send credentials email:", emailError.message);
      // Continue - employee is created successfully even if email fails
    }

    return {
      user,
      employee,
      password: generatedPassword, // Return password for admin reference (optional)
    };

  } catch (error) {
    // Rollback transaction on any error
    await transaction.rollback();

    // Re-throw the error with more context
    console.error("Employee creation failed:", error);
    throw new Error(error.message || "Failed to create employee");
  }
};

export const getEmployeesService = async (requestingUser = null) => {
  const employees = await User.findAll({
    where: { isActive: true },
    include: [
      {
        model: Employee,
        as: "employeeProfile",
        include: [
          {
            model: Employee,
            as: "manager",
            attributes: ["id", "fullName", "employeeCode"],
            required: false,
          },
        ],
      },
    ],
    order: [["id", "ASC"]],
  });

  return employees;
};

export const getEmployeeByIdService = async (employeeId) => {
  const employee = await Employee.findByPk(employeeId, {
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "email", "role", "isActive"],
      },
      {
        model: Employee,
        as: "manager",
        attributes: ["id", "fullName", "employeeCode", "designation"],
        required: false,
      },
    ],
  });

  if (!employee) throw new Error("Employee not found");
  return employee;
};

export const updateEmployeeService = async (employeeId, data) => {
  const employee = await Employee.findByPk(employeeId);
  if (!employee) throw new Error("Employee not found");

  const transaction = await sequelize.transaction();

  try {
    // Update employee fields
    await employee.update({
      fullName: data.fullName,
      employeeCode: data.employeeCode,
      department: data.department,
      designation: data.designation,
      dateOfJoining: data.dateOfJoining,
      phone: data.phone,
      personalEmail: data.personalEmail,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      location: data.location,
      address: data.address,
      employmentType: data.employmentType,
      shift: data.shift,
      status: data.status,
      managerId: data.managerId,
      qualifications: data.qualifications,
      experience: data.experience,
      skills: data.skills,
      profileImage: data.profileImage,
    }, { transaction });

    // Update user email if provided
    if (data.email) {
      const user = await User.findByPk(employee.userId);
      if (user && user.email !== data.email) {
        const existing = await User.findOne({ where: { email: data.email } });
        if (existing && existing.id !== user.id) {
          throw new Error("Email already registered");
        }
        await user.update({ email: data.email }, { transaction });
      }
    }

    await transaction.commit();
    return employee;

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const deactivateEmployeeService = async (employeeId) => {
  const employee = await Employee.findByPk(employeeId);
  if (!employee) throw new Error("Employee not found");

  const transaction = await sequelize.transaction();

  try {
    // Deactivate employee
    await employee.update({ status: "Inactive" }, { transaction });

    // Deactivate user account
    const user = await User.findByPk(employee.userId);
    if (user) {
      await user.update({ isActive: false }, { transaction });
    }

    await transaction.commit();
    return { employee, user };

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const activateEmployeeService = async (employeeId) => {
  const employee = await Employee.findByPk(employeeId);
  if (!employee) throw new Error("Employee not found");

  const transaction = await sequelize.transaction();

  try {
    // Activate employee
    await employee.update({ status: "Active" }, { transaction });

    // Activate user account
    const user = await User.findByPk(employee.userId);
    if (user) {
      await user.update({ isActive: true }, { transaction });
    }

    await transaction.commit();
    return { employee, user };

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Upload handlers (profile image and resume)
export const uploadEmployeeProfileImageService = async (employeeId, fileBuffer, filename) => {
  const employee = await Employee.findByPk(employeeId);
  if (!employee) throw new Error("Employee not found");

  // Lazy-load cloudinary to avoid failing if not configured
  const { uploadBuffer } = await import("./cloudinary.service.js");

  // upload to Cloudinary (folder optional)
  const folder = process.env.CLOUDINARY_FOLDER ? `${process.env.CLOUDINARY_FOLDER}/profiles` : "litehr/profiles";
  const res = await uploadBuffer(fileBuffer, { resource_type: "image", folder, public_id: `${employee.employeeCode || 'emp'}_${Date.now()}` });

  // Optionally remove previous asset (if public_id tracked)
  // Save new profileImage url
  employee.profileImage = res.secure_url;
  await employee.save();

  return { employee, uploaded: res };
};

export const uploadEmployeeResumeService = async (employeeId, fileBuffer, filename) => {
  const employee = await Employee.findByPk(employeeId);
  if (!employee) throw new Error("Employee not found");

  const { uploadBuffer } = await import("./cloudinary.service.js");

  const folder = process.env.CLOUDINARY_FOLDER ? `${process.env.CLOUDINARY_FOLDER}/resumes` : "litehr/resumes";
  const res = await uploadBuffer(fileBuffer, { resource_type: "auto", folder, public_id: `${employee.employeeCode || 'emp'}_resume_${Date.now()}` });

  // Save resume URL
  employee.resumeUrl = res.secure_url;
  await employee.save();

  return { employee, uploaded: res };
};

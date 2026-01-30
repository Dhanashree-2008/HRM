import { createEmployeeService, getEmployeesService, getEmployeeByIdService, updateEmployeeService, deactivateEmployeeService, activateEmployeeService, uploadEmployeeProfileImageService, uploadEmployeeResumeService } from "../services/admin.service.js";


export const createEmployeeController = async (req, res) => {
  try {
    const { email, personalEmail } = req.body;
    const result = await createEmployeeService(req.body);

    // Don't return password in response for security
    // Password is sent via email to the employee
    const credentialsSentTo = personalEmail
      ? [personalEmail, email].filter(Boolean)
      : [email];

    res.status(201).json({
      message: "Employee created successfully. Login credentials have been sent to the employee's email.",
      employee: result.employee,
      emailSent: true,
      credentialsSentTo,
    });
  } catch (err) {
    console.error("Create employee error:", err.message);
    res.status(400).json({ message: err.message });
  }
};


export const listEmployeesController = async (req, res) => {
  try {
    const list = await getEmployeesService(req.user);

    res.json(
      list.map((item) => ({
        id: item.id,
        email: item.email,
        role: item.role,
        employee: item.employeeProfile
          ? {
            id: item.employeeProfile.id,
            fullName: item.employeeProfile.fullName,
            employeeCode: item.employeeProfile.employeeCode,
            department: item.employeeProfile.department,
            designation: item.employeeProfile.designation,
            dateOfJoining: item.employeeProfile.dateOfJoining,
            phone: item.employeeProfile.phone,
            personalEmail: item.employeeProfile.personalEmail,
            dateOfBirth: item.employeeProfile.dateOfBirth,
            gender: item.employeeProfile.gender,
            location: item.employeeProfile.location,
            address: item.employeeProfile.address,
            employmentType: item.employeeProfile.employmentType,
            shift: item.employeeProfile.shift,
            status: item.employeeProfile.status,
            managerId: item.employeeProfile.managerId,
            manager: item.employeeProfile.manager
              ? {
                id: item.employeeProfile.manager.id,
                fullName: item.employeeProfile.manager.fullName,
                employeeCode: item.employeeProfile.manager.employeeCode,
              }
              : null,
            qualifications: item.employeeProfile.qualifications,
            experience: item.employeeProfile.experience,
            skills: item.employeeProfile.skills,
            profileImage: item.employeeProfile.profileImage,
          }
          : null,
      }))
    );
  } catch (err) {
    console.error("List employees error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getEmployeeByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await getEmployeeByIdService(id);
    res.json(employee);
  } catch (err) {
    console.error("Get employee error:", err.message);
    res.status(404).json({ message: err.message });
  }
};

export const updateEmployeeController = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await updateEmployeeService(id, req.body);
    res.json({
      message: "Employee updated successfully",
      employee,
    });
  } catch (err) {
    console.error("Update employee error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

export const deactivateEmployeeController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deactivateEmployeeService(id);
    res.json({
      message: "Employee deactivated successfully",
      employee: result.employee,
    });
  } catch (err) {
    console.error("Deactivate employee error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

export const activateEmployeeController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await activateEmployeeService(id);
    res.json({
      message: "Employee activated successfully",
      employee: result.employee,
    });
  } catch (err) {
    console.error("Activate employee error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// Upload controllers
export const uploadProfileController = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const result = await uploadEmployeeProfileImageService(id, file.buffer, file.originalname);
    res.json({ message: "Profile image uploaded", profileImage: result.employee.profileImage, uploaded: result.uploaded });
  } catch (err) {
    console.error("Upload profile error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

export const uploadResumeController = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const result = await uploadEmployeeResumeService(id, file.buffer, file.originalname);
    res.json({ message: "Resume uploaded", resumeUrl: result.employee.resumeUrl, uploaded: result.uploaded });
  } catch (err) {
    console.error("Upload resume error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

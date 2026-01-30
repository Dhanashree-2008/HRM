import { defineUserModel } from "./user.model.js";
import { defineRoleModel } from "./role.model.js";
import { defineEmployeeModel } from "./employee.model.js";
import { defineAttendanceModel } from "./attendance.model.js";
import { defineLeaveRequestModel } from "./leaveRequest.model.js";
import { defineWorklogModel } from "./worklog.model.js";
import { defineTaskModel } from "./task.model.js";
import { defineLeaveTypeModel } from "./leaveType.model.js";
import { defineEmployeeLeaveBalanceModel } from "./employeeLeaveBalance.model.js";
import { defineNotificationModel } from "./notification.model.js";
import { defineDepartmentModel } from "./department.model.js";
import { defineHolidayModel } from "./holiday.model.js";
import { defineAuditLogModel } from "./auditLog.model.js";
import { defineJobModel } from "./job.model.js";
import { defineJobApplicationModel } from "./jobApplication.model.js";
import { defineTermsAcceptanceModel } from "./termsAcceptance.model.js";
import { defineSettingModel } from "./setting.model.js";
import { definePayslipModel } from "./payslip.model.js";
import { defineDocumentModel } from "./document.model.js";


let User;
let Role;
let Employee;
let Attendance;
let LeaveRequest;
let Worklog;
let Task;
let LeaveType;
let EmployeeLeaveBalance;
let Notification;
let Department;
let Holiday;
let AuditLog;
let Job;
let JobApplication;
let TermsAcceptance;
let Setting;
let Payslip;
let Document;


export const setupModels = (sequelize) => {
  // Define models
  User = defineUserModel(sequelize);
  Role = defineRoleModel(sequelize);
  Employee = defineEmployeeModel(sequelize);
  Attendance = defineAttendanceModel(sequelize);
  LeaveRequest = defineLeaveRequestModel(sequelize);
  Worklog = defineWorklogModel(sequelize);
  Task = defineTaskModel(sequelize);
  LeaveType = defineLeaveTypeModel(sequelize);
  EmployeeLeaveBalance = defineEmployeeLeaveBalanceModel(sequelize);
  Notification = defineNotificationModel(sequelize);
  Setting = defineSettingModel(sequelize);
  Department = defineDepartmentModel(sequelize);
  Holiday = defineHolidayModel(sequelize);
  AuditLog = defineAuditLogModel(sequelize);
  Job = defineJobModel(sequelize);
  JobApplication = defineJobApplicationModel(sequelize);

  TermsAcceptance = defineTermsAcceptanceModel(sequelize);
  Payslip = definePayslipModel(sequelize);
  Document = defineDocumentModel(sequelize);


  // User ↔ Employee
  User.hasOne(Employee, {
    foreignKey: "userId",
    as: "employeeProfile",
  });

  Employee.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  // Role ↔ Employee
  Role.hasMany(Employee, { foreignKey: "roleId", as: "employees" });
  Employee.belongsTo(Role, { foreignKey: "roleId", as: "role" });

  // Employee ↔ Attendance (one-to-many)
  Employee.hasMany(Attendance, {
    foreignKey: "employeeId",
    as: "attendanceRecords",
  });

  Attendance.belongsTo(Employee, {
    foreignKey: "employeeId",
    as: "employee",
  });

  // Employee ↔ LeaveRequest (one-to-many)
  Employee.hasMany(LeaveRequest, {
    foreignKey: "employeeId",
    as: "leaveRequests",
  });

  LeaveRequest.belongsTo(Employee, {
    foreignKey: "employeeId",
    as: "employee",
  });

  // Employee ↔ Worklog (1-to-many)
  Employee.hasMany(Worklog, {
    foreignKey: "employeeId",
    as: "worklogs",
  });

  Worklog.belongsTo(Employee, {
    foreignKey: "employeeId",
    as: "employee",
  });
  // Employee ↔ Task (assigned to, assigned by)
  Employee.hasMany(Task, {
    foreignKey: "assignedToEmployeeId",
    as: "assignedTasks",
  });

  Employee.hasMany(Task, {
    foreignKey: "assignedByEmployeeId",
    as: "createdTasks",
  });

  Task.belongsTo(Employee, {
    foreignKey: "assignedToEmployeeId",
    as: "assignee",
  });

  Task.belongsTo(Employee, {
    foreignKey: "assignedByEmployeeId",
    as: "assigner",
  });

  // associations
  LeaveType.hasMany(EmployeeLeaveBalance, {
    foreignKey: "leaveTypeId",
  });

  EmployeeLeaveBalance.belongsTo(LeaveType, {
    foreignKey: "leaveTypeId",
  });

  Employee.hasMany(EmployeeLeaveBalance, {
    foreignKey: "employeeId",
  });

  EmployeeLeaveBalance.belongsTo(Employee, {
    foreignKey: "employeeId",
  });

  // Employee ↔ Employee (Manager relationship - self-referential)
  Employee.belongsTo(Employee, {
    foreignKey: "managerId",
    as: "manager",
  });

  Employee.hasMany(Employee, {
    foreignKey: "managerId",
    as: "teamMembers",
  });

  User.hasMany(Notification, { foreignKey: "userId" });
  Notification.belongsTo(User, { foreignKey: "userId" });

  // Department Head (Department.belongsTo Employee for headEmployeeId)
  Department.belongsTo(Employee, {
    foreignKey: "headEmployeeId",
    as: "head",
  });

  // Note: Employee.department is currently a string field
  // For future migration to departmentId foreign key, uncomment:
  // Department.hasMany(Employee, {
  //   foreignKey: "departmentId",
  //   as: "employees",
  // });
  // Employee.belongsTo(Department, {
  //   foreignKey: "departmentId",
  //   as: "departmentInfo",
  // });

  // User ↔ AuditLog
  User.hasMany(AuditLog, { foreignKey: "userId" });
  AuditLog.belongsTo(User, { foreignKey: "userId" });

  // Job ↔ JobApplication
  Job.hasMany(JobApplication, {
    foreignKey: "jobId",
    as: "applications",
  });
  JobApplication.belongsTo(Job, {
    foreignKey: "jobId",
    as: "job",
  });

  // User ↔ Job (posted by)
  User.hasMany(Job, { foreignKey: "postedBy" });
  Job.belongsTo(User, { foreignKey: "postedBy", as: "poster" });

  // User ↔ TermsAcceptance
  User.hasMany(TermsAcceptance, { foreignKey: "userId" });

  TermsAcceptance.belongsTo(User, { foreignKey: "userId" });

  // Employee ↔ Payslip
  Employee.hasMany(Payslip, { foreignKey: "employeeId", as: "payslips" });
  Payslip.belongsTo(Employee, { foreignKey: "employeeId", as: "employee" });

  // Employee ↔ Document
  Employee.hasMany(Document, { foreignKey: "employeeId", as: "documents" });
  Document.belongsTo(Employee, { foreignKey: "employeeId", as: "employee" });
};


export {
  User,
  Role,
  Employee,
  Attendance,
  LeaveRequest,
  Worklog,
  Task,
  LeaveType,
  EmployeeLeaveBalance,
  Notification,
  Setting, // Added Setting to exports
  Department,
  Holiday,
  AuditLog,
  Job,
  JobApplication,
  TermsAcceptance,
  Payslip,
  Document
};


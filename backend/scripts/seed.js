// scripts/seed.js
import "dotenv/config";
import readline from "node:readline";
import { initDb, sequelize } from "../src/config/db.js";
import { User, Employee, LeaveType, EmployeeLeaveBalance } from "../src/models/index.js";
import { hashPassword } from "../src/utils/password.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (q) => new Promise((res) => rl.question(q, res));

const createUserIfNotExists = async ({ email, password, role = "EMPLOYEE", username = null }) => {
  const passwordHash = await hashPassword(password);
  const [user, created] = await User.findOrCreate({
    where: { email },
    defaults: {
      username: username || email.split("@")[0],
      passwordHash,
      role,
    },
  });
  if (!created) {
    // ensure role is set (do not overwrite existing high-privilege users)
    if (user.role !== role) {
      user.role = role;
      await user.save();
    }
  }
  return user;
};

const createEmployeeIfNotExists = async ({ userId, fullName, employeeCode, designation = "", department = "General", managerId = null }) => {
  const [emp, created] = await Employee.findOrCreate({
    where: { userId },
    defaults: {
      userId,
      employeeCode,
      fullName,
      designation,
      department,
      managerId,
    },
  });

  if (!created && managerId && emp.managerId !== managerId) {
    emp.managerId = managerId;
    await emp.save();
  }

  return emp;
};

const main = async () => {
  try {
    console.log("Seeding database with sample users and employees...");

    await initDb(); // will authenticate, setup models and sync

    const proceedArg = process.argv.includes("--yes");

    if (!proceedArg) {
      const answer = (await question("This will insert sample data into your DB. Proceed? (yes/no): ")).trim().toLowerCase();
      if (answer !== "yes" && answer !== "y") {
        console.log("Aborted by user.");
        process.exit(0);
      }
    }

    // Create Admin
    const adminEmail = "admin@litehr.com";
    const adminPassword = "123456";
    const adminUser = await createUserIfNotExists({ email: adminEmail, password: adminPassword, role: "ADMIN", username: "admin" });

    // Create a manager user
    const mgrEmail = "manager1@litehr.com";
    const mgrPassword = "123456";
    const managerUser = await createUserIfNotExists({ email: mgrEmail, password: mgrPassword, role: "MANAGER", username: "manager1" });

    // Create manager employee profile
    const managerEmp = await createEmployeeIfNotExists({ userId: managerUser.id, fullName: "Priya Sharma", employeeCode: "MGR-001", designation: "Engineering Manager", department: "Engineering" });

    // Create employees under manager
    const employeesData = [
      { email: "alice@litehr.com", name: "Alice Kapoor", code: "EMP-001", designation: "Frontend Developer" },
      { email: "bob@litehr.com", name: "Bob Singh", code: "EMP-002", designation: "Backend Developer" },
      { email: "carla@litehr.com", name: "Carla Mehta", code: "EMP-003", designation: "QA Engineer" },
    ];

    for (const e of employeesData) {
      const user = await createUserIfNotExists({ email: e.email, password: "123456", role: "EMPLOYEE", username: e.email.split("@")[0] });
      await createEmployeeIfNotExists({ userId: user.id, fullName: e.name, employeeCode: e.code, designation: e.designation, department: "Engineering", managerId: managerEmp.id });
    }

    // Seed default leave types (if not present)
    const leaveTypesData = [
      { name: "Earned Leave", code: "AL", yearlyLimit: 20, autoApproveDays: 1 },
      { name: "Sick Leave", code: "SL", yearlyLimit: 10, requireDocumentation: true },
      { name: "Casual Leave", code: "CL", yearlyLimit: 7 },
    ];

    for (const lt of leaveTypesData) {
      await LeaveType.findOrCreate({ where: { code: lt.code }, defaults: lt });
    }

    // Ensure employees have leave balances for current year
    const currentYear = new Date().getFullYear();
    const allLeaveTypes = await LeaveType.findAll();
    const allEmployees = await Employee.findAll();

    for (const emp of allEmployees) {
      for (const lt of allLeaveTypes) {
        const total = lt.yearlyLimit || 0;
        await EmployeeLeaveBalance.findOrCreate({
          where: { employeeId: emp.id, leaveTypeId: lt.id, year: currentYear },
          defaults: { employeeId: emp.id, leaveTypeId: lt.id, year: currentYear, total, used: 0, remaining: total },
        });
      }
    }

    console.log("Seeding complete. Created the following accounts:");
    console.log(`- Admin: ${adminEmail} / ${adminPassword} (role: ADMIN)`);
    console.log(`- Manager: ${mgrEmail} / 123456 (role: MANAGER)`);
    console.log(`- Employees: ${employeesData.map((x) => x.email).join(", ")}`);

    // Close readline and sequelize
    rl.close();
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    rl.close();
    process.exit(1);
  }
};

main();
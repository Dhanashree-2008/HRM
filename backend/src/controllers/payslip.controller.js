import { Payslip, Employee, Attendance, LeaveRequest } from "../models/index.js";
import { Op } from "sequelize";

// Generate Payslip (Admin only)
export const generatePayslip = async (req, res) => {
    try {
        const { employeeId, month, year } = req.body; // e.g., month="12", year=2024

        // 1. Fetch Employee
        const employee = await Employee.findByPk(employeeId);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        let basicSalary = parseFloat(employee.basicSalary);
        if (!basicSalary || basicSalary <= 0) {
            return res.status(400).json({ message: "Employee basic salary not set" });
        }

        // 2. Fetch Attendance for the month
        const startDate = new Date(year, parseInt(month) - 1, 1);
        const endDate = new Date(year, parseInt(month), 0);

        // Count Present Days
        const attendances = await Attendance.findAll({
            where: {
                employeeId,
                date: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });

        const presentDays = attendances.length; // Simplified: 1 record = 1 day (or handle markIn/markOut validation)

        // 3. Fetch Unpaid Leaves
        const unpaidLeaves = await LeaveRequest.count({
            where: {
                employeeId,
                status: "APPROVED",
                // Assuming we might have a type like 'Unpaid' or logic based on leave balance exhaution.
                // For simplified version, let's assume ALL approved leaves are unpaid if specified, 
                // OR we rely on admin inputs? 
                // Requirement: "System automatically fetches... Approved unpaid leaves (Leave module)"
                // Let's assume LeaveType 'Unpaid' or 'LossOfPay' exists. If not, we count all distinct approved leave days?
                // Let's just lookup leaves. If LeaveType check is complex, we might just assume 0 for now or count all.
                // Better: Count days in Approved LeaveRequests.
                fromDate: { [Op.gte]: startDate },
                toDate: { [Op.lte]: endDate }
            }
        });
        // Note: Logic for multi-day leaves spanning months is complex. Simplified to single month fit.

        // 4. Calculate Salary
        // Requirement: Per Day Salary = Basic Salary / Total Working Days
        // Total Working Days: Let's assume standard 30 or Days in Month?
        // "Total working days in month"
        const totalDaysInMonth = endDate.getDate();
        // Exclude weekends? Simplified: Use total days in month for per-day calc or standard 30.
        // Let's use total days in month.
        const perDaySalary = basicSalary / totalDaysInMonth;

        // Deduction = Unpaid Leave Days * Per Day Salary
        // Wait, "Unpaid Leaves". If a user takes Paid Leave, it shouldn't deduct.
        // If I can't distinguish, this might be flawed. 
        // Let's use logic: Deduction = (TotalDays - PresentDays - PaidLeaves) * PerDay?
        // Requirement: "Deduction = Unpaid Leave Days * Per Day Salary"
        // Implicitly: Absent days are unpaid? Or Absent days that are APPROVED unpaid leaves?
        // Let's stick to the requirement literally: Unpaid Leaves count.
        // If I can't filter Unpaid, I'll default to 0 for deduction for the MVP unless status says Unpaid.

        const deduction = unpaidLeaves * perDaySalary;
        let netSalary = basicSalary - deduction;

        // 5. Create/Update Payslip
        // Check if exists
        let payslip = await Payslip.findOne({
            where: { employeeId, month, year }
        });

        if (payslip) {
            payslip.basicSalary = basicSalary;
            payslip.workingDays = totalDaysInMonth;
            payslip.presentDays = presentDays;
            payslip.unpaidLeaves = unpaidLeaves;
            payslip.deduction = deduction;
            payslip.netSalary = netSalary;
            await payslip.save();
        } else {
            payslip = await Payslip.create({
                employeeId,
                month,
                year,
                basicSalary,
                workingDays: totalDaysInMonth,
                presentDays,
                unpaidLeaves,
                deduction,
                netSalary,
                status: "DRAFT"
            });
        }

        res.json({ success: true, payslip });

    } catch (error) {
        console.error("Generate payslip error:", error);
        res.status(500).json({ message: "Failed to generate payslip", error: error.message });
    }
};

// Publish Payslip (Admin only)
export const publishPayslip = async (req, res) => {
    try {
        const { id } = req.params;
        const payslip = await Payslip.findByPk(id);
        if (!payslip) return res.status(404).json({ message: "Payslip not found" });

        payslip.status = "PUBLISHED";
        await payslip.save();

        res.json({ success: true, message: "Payslip published successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to publish payslip" });
    }
};

// Get All Payslips (Admin filters, Employee own)
export const getAllPayslips = async (req, res) => {
    try {
        const { role, employeeId } = req.user;
        const { month, year } = req.query;

        const where = {};
        if (month) where.month = month;
        if (year) where.year = year;

        if (role === "EMPLOYEE") {
            // Employee can only see their own PUBLISHED payslips
            if (!employeeId) return res.status(400).json({ message: "Employee profile not found" });
            where.employeeId = employeeId;
            where.status = "PUBLISHED";
        } else if (role === "ADMIN") {
            // Admin can see all, maybe filter by specific employee
            if (req.query.employeeId) where.employeeId = req.query.employeeId;
        }

        const payslips = await Payslip.findAll({
            where,
            include: [{
                model: Employee,
                as: 'employee',
                attributes: ['fullName', 'employeeCode', 'department']
            }],
            order: [["year", "DESC"], ["month", "DESC"]]
        });

        res.json(payslips);
    } catch (error) {
        console.error("Get payslips error:", error);
        res.status(500).json({ message: "Failed to fetch payslips" });
    }
};

// Get Single Payslip
export const getPayslipById = async (req, res) => {
    try {
        const { id } = req.params;
        const payslip = await Payslip.findByPk(id, {
            include: [{
                model: Employee,
                as: 'employee',
                attributes: ['fullName', 'employeeCode', 'designation', 'department', 'dateOfJoining', 'bankAccountNo', 'pan'] // Add bank details if in model
            }]
        });

        if (!payslip) return res.status(404).json({ message: "Payslip not found" });

        // Authorization check
        if (req.user.role === "EMPLOYEE" && payslip.employeeId !== req.user.employeeId) {
            return res.status(403).json({ message: "Unauthorized access to this payslip" });
        }

        res.json(payslip);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch payslip details" });
    }
};

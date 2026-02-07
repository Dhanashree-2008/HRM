import { Payslip, Employee, Attendance, LeaveRequest } from "../models/index.js";
import { Op } from "sequelize";
import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";

/* ================= ES MODULE PATH FIX ================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =====================================================
   Generate Payslip (Admin only)
===================================================== */
export const generatePayslip = async (req, res) => {
    try {
        const { employeeId, month, year } = req.body;

        const employee = await Employee.findByPk(employeeId);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        let basicSalary = parseFloat(employee.basicSalary);
        if (!basicSalary || basicSalary <= 0) {
            return res.status(400).json({ message: "Employee basic salary not set" });
        }

        const startDate = new Date(year, parseInt(month) - 1, 1);
        const endDate = new Date(year, parseInt(month), 0);

        const attendances = await Attendance.findAll({
            where: {
                employeeId,
                date: { [Op.between]: [startDate, endDate] }
            }
        });

        const presentDays = attendances.length;

        const unpaidLeaves = await LeaveRequest.count({
            where: {
                employeeId,
                status: "APPROVED",
                fromDate: { [Op.gte]: startDate },
                toDate: { [Op.lte]: endDate }
            }
        });

        const totalDaysInMonth = endDate.getDate();
        const perDaySalary = basicSalary / totalDaysInMonth;

        const deduction = unpaidLeaves * perDaySalary;
        const netSalary = basicSalary - deduction;

        let payslip = await Payslip.findOne({
            where: { employeeId, month, year }
        });

        if (payslip) {
            Object.assign(payslip, {
                basicSalary,
                workingDays: totalDaysInMonth,
                presentDays,
                unpaidLeaves,
                deduction,
                netSalary
            });
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
        res.status(500).json({ message: "Failed to generate payslip" });
    }
};

/* =====================================================
   Publish Payslip
===================================================== */
export const publishPayslip = async (req, res) => {
    try {
        const { id } = req.params;
        const payslip = await Payslip.findByPk(id);
        if (!payslip) return res.status(404).json({ message: "Payslip not found" });

        payslip.status = "PUBLISHED";
        await payslip.save();

        res.json({ success: true, message: "Payslip published successfully" });
    } catch {
        res.status(500).json({ message: "Failed to publish payslip" });
    }
};

/* =====================================================
   Get All Payslips
===================================================== */
export const getAllPayslips = async (req, res) => {
    try {
        const { role, employeeId } = req.user;
        const { month, year } = req.query;

        const where = {};
        if (month) where.month = month;
        if (year) where.year = year;

        if (role === "EMPLOYEE") {
            where.employeeId = employeeId;
            where.status = "PUBLISHED";
        } else if (req.query.employeeId) {
            where.employeeId = req.query.employeeId;
        }

        const payslips = await Payslip.findAll({
            where,
            include: [{
                model: Employee,
                as: "employee",
                attributes: ["fullName", "employeeCode", "department"]
            }],
            order: [["year", "DESC"], ["month", "DESC"]]
        });

        res.json(payslips);
    } catch {
        res.status(500).json({ message: "Failed to fetch payslips" });
    }
};

/* =====================================================
   Get Single Payslip
===================================================== */
export const getPayslipById = async (req, res) => {
    try {
        const payslip = await Payslip.findByPk(req.params.id, {
            include: [{
                model: Employee,
                as: "employee",
                attributes: ["fullName", "employeeCode", "designation", "department"]
            }]
        });

        if (!payslip) return res.status(404).json({ message: "Payslip not found" });

        if (req.user.role === "EMPLOYEE" && payslip.employeeId !== req.user.employeeId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        res.json(payslip);
    } catch {
        res.status(500).json({ message: "Failed to fetch payslip" });
    }
};

/* =====================================================
   DOWNLOAD PAYSLIP PDF (ATTRACTIVE + PROFESSIONAL)
===================================================== */
/* =====================================================
   DOWNLOAD PAYSLIP PDF (ATTRACTIVE + PROFESSIONAL)
===================================================== */
/* =====================================================
   DOWNLOAD PAYSLIP PDF (FIXED VERSION - NO ERRORS)
===================================================== */
export const downloadPayslipPDF = async (req, res) => {
    try {
        const payslip = await Payslip.findByPk(req.params.id, {
            include: [{
                model: Employee,
                as: "employee",
                attributes: [
                    "fullName",
                    "employeeCode",
                    "department",
                    "designation",
                    "dateOfJoining",
                    "personalEmail",
                    "phone"
                ]
            }]
        });

        if (!payslip) return res.status(404).json({ message: "Payslip not found" });

        if (req.user.role === "EMPLOYEE" && payslip.employeeId !== req.user.employeeId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const doc = new PDFDocument({ size: "A4", margin: 40 });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=payslip-${payslip.employee.employeeCode}-${payslip.month}-${payslip.year}.pdf`
        );

        doc.pipe(res);

        /* ===== LOGO ===== */
        const logoPath = path.join(__dirname, "../assets/logo.png");
        doc.image(logoPath, 40, 35, { width: 60 });

        /* ===== HEADER ===== */
        doc.rect(0, 0, 595, 110).fill("#4F46E5");
        doc.fillColor("#fff")
           .font("Helvetica-Bold")
           .fontSize(22)
           .text("HRM PRO", 120, 40);

        doc.fontSize(12)
           .fillColor("#E0E7FF")
           .font("Helvetica")
           .text("Employee Management System", 120, 70);

        doc.moveDown(3);
        doc.fillColor("#111827")
           .fontSize(18)
           .font("Helvetica-Bold")
           .text("MONTHLY PAYSLIP", { align: "center" });

        doc.fontSize(12)
           .fillColor("#6B7280")
           .text(`${payslip.month} / ${payslip.year}`, { align: "center" });

        /* ===== EMPLOYEE INFO ===== */
        doc.moveDown();
        doc.rect(40, 190, 515, 90).stroke("#E5E7EB");

        doc.font("Helvetica-Bold").text("Employee Details", 50, 200);
        doc.font("Helvetica").fontSize(10);

        doc.text(`Name: ${payslip.employee.fullName}`, 50, 220);
        doc.text(`Employee Code: ${payslip.employee.employeeCode}`, 50, 235);
        doc.text(`Department: ${payslip.employee.department}`, 50, 250);

        doc.text(`Designation: ${payslip.employee.designation}`, 300, 220);
        doc.text(
            `Joining Date: ${
                payslip.employee.dateOfJoining
                    ? new Date(payslip.employee.dateOfJoining).toLocaleDateString()
                    : "N/A"
            }`,
            300,
            235
        );
        doc.text(`Pay Period: ${payslip.month}/${payslip.year}`, 300, 250);

        /* ===== ATTENDANCE ===== */
        doc.moveDown(2);
        doc.font("Helvetica-Bold").fontSize(14).text("Attendance Summary");

        doc.font("Helvetica").fontSize(11);
        doc.text(`Working Days: ${payslip.workingDays}`);
        doc.text(`Present Days: ${payslip.presentDays}`);
        doc.text(`Unpaid Leaves: ${payslip.unpaidLeaves}`);

        /* ===== SALARY ===== */
        doc.moveDown();
        doc.font("Helvetica-Bold").fontSize(14).text("Salary Breakdown");

        doc.font("Helvetica").fontSize(11);
        doc.text(`Basic Salary: ₹${Number(payslip.basicSalary).toFixed(2)}`);
        doc.text(`Total Deduction: ₹${Number(payslip.deduction).toFixed(2)}`);

        /* ===== NET SALARY ===== */
        doc.moveDown();
        doc.rect(40, doc.y, 515, 45).fill("#10B981");
        doc.fillColor("#fff")
           .font("Helvetica-Bold")
           .fontSize(18)
           .text(
               `Net Salary Payable: ₹${Number(payslip.netSalary).toFixed(2)}`,
               60,
               doc.y + 12
           );

        /* ===== FOOTER ===== */
        doc.fillColor("#6B7280")
           .fontSize(9)
           .text(
               "This is a system-generated payslip. No signature required.",
               40,
               doc.page.height - 80,
               { align: "center" }
           );

        doc.text(
            `Generated on ${new Date().toLocaleString("en-IN")}`,
            40,
            doc.page.height - 60,
            { align: "center" }
        );

        doc.end();

    } catch (error) {
        console.error("Payslip PDF error:", error);
        res.status(500).json({ message: "Failed to generate payslip PDF" });
    }
};

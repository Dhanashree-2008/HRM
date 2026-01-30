import { DataTypes } from "sequelize";

export const definePayslipModel = (sequelize) => {
    const Payslip = sequelize.define(
        "Payslip",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            employeeId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            month: {
                type: DataTypes.STRING(20), // e.g., "December" or "12"
                allowNull: false,
            },
            year: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            basicSalary: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0.00,
            },
            workingDays: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            presentDays: {
                type: DataTypes.FLOAT, // Float to handle half days
                allowNull: false,
                defaultValue: 0,
            },
            unpaidLeaves: {
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
            },
            deduction: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0.00,
            },
            netSalary: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0.00,
            },
            status: {
                type: DataTypes.ENUM("DRAFT", "PUBLISHED"),
                defaultValue: "DRAFT",
            },
            generatedDate: {
                type: DataTypes.DATEONLY,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "payslips",
            timestamps: true,
        }
    );

    return Payslip;
};

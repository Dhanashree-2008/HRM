import { DataTypes } from "sequelize";

export const defineDocumentModel = (sequelize) => {
    const Document = sequelize.define(
        "Document",
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
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING(50), // e.g., "appointment", "offer", "idproof"
                allowNull: false,
            },
            category: {
                type: DataTypes.STRING, // Changed from ENUM to allow flexibility
                allowNull: false,
                defaultValue: "Personal",
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            confidentialLevel: {
                type: DataTypes.STRING(20), // Low, Medium, High, Strict
                defaultValue: "Medium",
            },
            expiryDate: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            fileUrl: {
                type: DataTypes.STRING,
                allowNull: false, // Changed to false as file is required
            },
            fileSize: {
                type: DataTypes.STRING(20), // e.g., "2.4 MB"
                allowNull: true,
            },
            uploadDate: {
                type: DataTypes.DATEONLY,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "documents",
            timestamps: true,
        }
    );

    return Document;
};

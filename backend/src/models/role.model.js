import { DataTypes } from "sequelize";

export const defineRoleModel = (sequelize) => {
    const Role = sequelize.define(
        "Role",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            permissions: {
                type: DataTypes.JSON, // Stores permissions as a JSON object
                allowNull: false,
                defaultValue: {},
            },
            status: {
                type: DataTypes.ENUM("Active", "Inactive"),
                defaultValue: "Active",
            },
        },
        {
            tableName: "roles",
            timestamps: true,
        }
    );

    return Role;
};

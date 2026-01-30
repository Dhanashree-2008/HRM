import { DataTypes } from "sequelize";

export const defineSettingModel = (sequelize) => {
    const Setting = sequelize.define(
        "Setting",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            key: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            value: {
                type: DataTypes.JSON,
                allowNull: false,
            },
        },
        {
            tableName: "settings",
            timestamps: true,
        }
    );

    return Setting;
};

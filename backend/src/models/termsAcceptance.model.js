// src/models/termsAcceptance.model.js
import { DataTypes } from "sequelize";

export const defineTermsAcceptanceModel = (sequelize) => {
  const TermsAcceptance = sequelize.define(
    "TermsAcceptance",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      documentType: {
        type: DataTypes.ENUM("Company Policy", "Leave Rules", "Code of Conduct", "Data Privacy", "Terms of Service"),
        allowNull: false,
      },
      version: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      acceptedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      userAgent: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
    },
    {
      tableName: "terms_acceptances",
      timestamps: true,
    }
  );

  return TermsAcceptance;
};




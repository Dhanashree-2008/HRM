import { Sequelize } from "sequelize";
import "dotenv/config";

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false,
  }
);

export const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected");

    const { setupModels } = await import("../models/index.js");
    setupModels(sequelize);

    await sequelize.sync();
    console.log("Models synced");
  } catch (err) {
    console.error("❌ MySQL error:", err.message);
    throw err;
  }
};

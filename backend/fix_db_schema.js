import { sequelize } from "./src/config/db.js";

const fixSchema = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connected to DB");

        try {
            await sequelize.query("ALTER TABLE employees ADD COLUMN roleId INT;");
            console.log("Added roleId column");
        } catch (e) {
            console.log("roleId column might already exist or error:", e.message);
        }

        try {
            await sequelize.query("ALTER TABLE employees ADD CONSTRAINT fk_employees_role FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE SET NULL ON UPDATE CASCADE;");
            console.log("Added foreign key constraint");
        } catch (e) {
            console.log("Constraint might already exist or error:", e.message);
        }

        console.log("Fix complete");
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
};

fixSchema();

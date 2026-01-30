import { sequelize } from "./src/config/db.js";

const updateEnum = async () => {
    try {
        // Ensure connection
        await sequelize.authenticate();
        console.log("✅ Authenticated with DB");

        // Run raw query to update ENUM
        const query = `ALTER TABLE employees MODIFY COLUMN employmentType ENUM('Full-time', 'Part-time', 'Contract', 'Intern', 'Freelance') DEFAULT 'Full-time';`;

        await sequelize.query(query);
        console.log("✅ Successfully updated employmentType ENUM to include 'Freelance'");

    } catch (error) {
        console.error("❌ Error updating schema:", error);
    } finally {
        await sequelize.close();
        process.exit();
    }
};

updateEnum();

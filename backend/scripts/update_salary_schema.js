
import { initDb, sequelize } from "../src/config/db.js";
import { Employee } from "../src/models/index.js";

const updateSalaries = async () => {
    try {
        // Must initialize DB and models first!
        await initDb();
        console.log("Database connected and models initialized.");

        // Now Employee model is defined
        if (!Employee) {
            throw new Error("Employee model is not defined after initDb");
        }

        // Update all employees to have a default basic salary of 50000 
        // where basicSalary is 0 or null
        // We can just update all for now to be sure.

        // Note: Employee.update returns [affectedCount]
        const [affectedCount] = await Employee.update(
            { basicSalary: 50000 },
            { where: {} }
        );

        console.log(`Updated salaries for ${affectedCount} employees.`);

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error("Error updating salaries:", error);
        process.exit(1);
    }
};

updateSalaries();

import "dotenv/config";
import { sequelize } from "../src/config/db.js";
import { setupModels } from "../src/models/index.js";

const syncDb = async () => {
    try {
        console.log("Connecting to database...");
        await sequelize.authenticate();
        console.log("Connected.");

        console.log("Setting up models...");
        setupModels(sequelize);

        console.log("Syncing Document table ONLY with alter: true...");
        // Only sync the Document model to avoid issues with other tables like Users
        await sequelize.models.Document.sync({ alter: true });

        console.log("Document table schema updated successfully.");

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error("Sync failed:", error);
        process.exit(1);
    }
};

syncDb();

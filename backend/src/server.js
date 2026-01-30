import app from "./app.js";
import { initDb } from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await initDb(); // connect to DB + sync models
    app.listen(PORT, () => {
      console.log(`LiteHR backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
  }
};

startServer();

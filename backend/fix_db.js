import mysql from "mysql2/promise";
import "dotenv/config";

async function run() {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "litehr",
    });

    try {
        await conn.query(`
      ALTER TABLE attendance
      ADD COLUMN status 
      ENUM('PRESENT', 'ABSENT', 'LEAVE', 'HALF_DAY')
      DEFAULT 'PRESENT';
    `);
        console.log("Attendance status column added");
    } catch (e) {
        if (e.code === "ER_DUP_FIELDNAME") {
            console.log("Attendance status column already exists");
        } else {
            console.error("Error:", e.message);
        }
    }

    await conn.end();
}

run();

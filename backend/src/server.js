import "dotenv/config";

import app from "./app.js";
import pool from "./config/db.js";
import "dotenv/config";

console.log(process.env.ADMIN_EMAIL);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await pool.query("SELECT NOW()");

    console.log("✅ Connected to Neon PostgreSQL");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to the database");
    console.error(error.message);
    process.exit(1);
  }
}

startServer();
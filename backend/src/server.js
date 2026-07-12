import "dotenv/config";

import app from "./app.js";
import pool from "./config/db.js";
import cloudinary from "./config/cloudinary.js";


const PORT = process.env.PORT || 5000;

async function startServer() {
  try {

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
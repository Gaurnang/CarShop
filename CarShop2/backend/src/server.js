import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import pool from "./config/db.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
import productRoutes from "./routes/product.routes.js";
import productCompatibilityRoutes from "./routes/productCompatibility.routes.js";
import userSavedCarRoutes from "./routes/userSavedCar.routes.js";
import catalogRoutes from "./routes/catalog.routes.js";
import authRoutes from "./routes/auth.routes.js";



dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/vehicles", vehicleRoutes);
app.use("/api/products", productRoutes);
app.use("/api/products", productCompatibilityRoutes);
app.use("/api/users", userSavedCarRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CarShop API Running",
  });
});

const PORT = process.env.PORT || 5000;

try {
  await pool.query("SELECT NOW()");

  console.log("✅ PostgreSQL Connected");

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

} catch (error) {
  console.error("❌ Database Connection Failed");
  console.error(error.message);
}
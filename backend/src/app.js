import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import modelRoutes from "./routes/modelRoutes.js";
import variantRoutes from "./routes/variantRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import productCompatibilityRoutes from "./routes/productCompatibilityRoutes.js";
import savedCarRoutes from "./routes/savedCarRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/models", modelRoutes);
app.use("/api/variants", variantRoutes);
app.use("/api/products", productRoutes);
app.use("/api/products", productCompatibilityRoutes);
app.use("/api/my-cars", savedCarRoutes);



app.get("/", (req, res) => {
  res.json({
    message: "CarShop API is running 🚗",
  });
});

export default app;
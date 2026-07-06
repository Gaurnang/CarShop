import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import modelRoutes from "./routes/modelRoutes.js";
import variantRoutes from "./routes/variantRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/models", modelRoutes);
app.use("/api/variants", variantRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "CarShop API is running 🚗",
  });
});

export default app;
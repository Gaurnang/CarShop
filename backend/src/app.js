import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/brands", brandRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "CarShop API is running 🚗",
  });
});

export default app;
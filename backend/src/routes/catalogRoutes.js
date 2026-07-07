import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  getAllProducts,
  getProductsBySavedCar,
} from "../controllers/catalogController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAllProducts);

router.get("/car/:savedCarId", getProductsBySavedCar);

export default router;
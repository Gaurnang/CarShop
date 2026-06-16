import express from "express";
import {
  getBrands,
  getModelsByBrandId,
  getVariantsByModelId,
} from "../controllers/vehicle.controller.js";

const router = express.Router();

router.get("/brands", getBrands);

router.get(
  "/brands/:brandId/models",
  getModelsByBrandId
);

router.get(
  "/models/:modelId/variants",
  getVariantsByModelId
);

export default router;
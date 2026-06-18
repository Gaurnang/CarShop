import express from "express";
import {
  getBrands,
  getModelsByBrandId,
  getVariantsByModelId,
} from "../controllers/vehicle.controller.js";

import {
  createBrand,
  updateBrand,
  deleteBrand,

  createModel,
  updateModel,
  deleteModel,

  createVariant,
  updateVariant,
  deleteVariant,
} from "../controllers/vehicle.controller.js";

import protect from "../middleware/auth.middleware.js";

import isAdmin from "../middleware/admin.middleware.js";;


const router = express.Router();

router.get("/brands", getBrands);

router.get("/brands/:brandId/models", getModelsByBrandId);

router.get("/models/:modelId/variants", getVariantsByModelId);


router.post("/brands", protect, isAdmin, createBrand);

router.patch("/brands/:brandId", protect, isAdmin, updateBrand);

router.delete("/brands/:brandId", protect, isAdmin, deleteBrand);


router.post("/brands/:brandId/models", protect, isAdmin, createModel);

router.patch("/models/:modelId", protect, isAdmin, updateModel);

router.delete("/models/:modelId", protect, isAdmin, deleteModel);


router.post("/models/:modelId/variants", protect, isAdmin, createVariant);

router.patch("/variants/:variantId", protect, isAdmin, updateVariant);

router.delete("/variants/:variantId", protect, isAdmin, deleteVariant);

export default router;
import express from "express";

import {
  addProductCompatibility,
  getProductCompatibility,
  removeProductCompatibility,
} from "../controllers/productCompatibility.controller.js";

import protect from "../middleware/auth.middleware.js";

import isAdmin from "../middleware/admin.middleware.js";


const router = express.Router();

router.post(
  "/:productId/compatibility",
  protect,
  isAdmin,
  addProductCompatibility
);

router.get(
  "/:productId/compatibility",
  getProductCompatibility
);

router.delete(
  "/:productId/compatibility/:variantId",
  protect,
  isAdmin,
  removeProductCompatibility
);

export default router;
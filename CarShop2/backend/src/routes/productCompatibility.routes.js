import express from "express";

import {
  addProductCompatibility,
  getProductCompatibility,
} from "../controllers/productCompatibility.controller.js";

const router = express.Router();

router.post(
  "/:productId/compatibility",
  addProductCompatibility
);

router.get(
  "/:productId/compatibility",
  getProductCompatibility
);

export default router;
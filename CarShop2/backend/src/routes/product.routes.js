import express from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

import protect from "../middleware/auth.middleware.js";
import isAdmin from "../middleware/admin.middleware.js";

import upload from "../middleware/upload.middleware.js";
import {uploadImage} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post("/", protect, isAdmin, createProduct);

router.patch("/:id", protect, isAdmin, updateProduct);

router.delete( "/:id", protect, isAdmin, deleteProduct);

export default router;
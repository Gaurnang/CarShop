import express from "express";

import * as categoryController from "../controllers/categoryController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public Routes
router.get(
    "/",
    categoryController.getCategories
);

router.get(
    "/:id",
    categoryController.getCategoryById
);

// Admin Routes
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    categoryController.createCategory
);

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    categoryController.updateCategory
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    categoryController.deleteCategory
);

export default router;